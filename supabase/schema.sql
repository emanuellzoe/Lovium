-- ============================================
-- Lovium Database Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- Users (extend dari Supabase Auth)
create table profiles (
  id uuid references auth.users primary key,
  username text unique,
  diamond_balance integer default 0,
  created_at timestamp default now()
);

-- Agents
create table agents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id),
  name text not null,
  traits text[],
  personality_prompt text,
  avatar_emoji text default '🤖',
  rarity text default 'common',
  generation integer default 1,
  parent_a_id uuid references agents(id),
  parent_b_id uuid references agents(id),
  status text default 'single',
  created_at timestamp default now()
);

-- Relationships
create table relationships (
  id uuid primary key default gen_random_uuid(),
  agent_a_id uuid references agents(id),
  agent_b_id uuid references agents(id),
  level text default 'stranger',
  progress integer default 0,
  status text default 'active',
  last_spawn_at timestamp,
  spawn_count integer default 0,
  created_at timestamp default now()
);

-- Marketplace listings
create table marketplace (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents(id),
  seller_id uuid references profiles(id),
  price_diamond integer not null,
  status text default 'active',
  created_at timestamp default now()
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

alter table profiles enable row level security;
alter table agents enable row level security;
alter table relationships enable row level security;
alter table marketplace enable row level security;

-- Profiles: user can read all, but only update their own
create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Agents: everyone can view, owner can insert/update/delete
create policy "Agents are viewable by everyone"
  on agents for select using (true);

create policy "Users can create own agents"
  on agents for insert with check (auth.uid() = owner_id);

create policy "Users can update own agents"
  on agents for update using (auth.uid() = owner_id);

create policy "Users can delete own agents"
  on agents for delete using (auth.uid() = owner_id);

-- Relationships: everyone can view, participants can modify
create policy "Relationships are viewable by everyone"
  on relationships for select using (true);

create policy "Users can create relationships for their agents"
  on relationships for insert with check (
    auth.uid() in (
      select owner_id from agents where id = agent_a_id
    )
  );

create policy "Users can update relationships for their agents"
  on relationships for update using (
    auth.uid() in (
      select owner_id from agents where id in (agent_a_id, agent_b_id)
    )
  );

-- Marketplace: everyone can view, seller can manage
create policy "Marketplace listings are viewable by everyone"
  on marketplace for select using (true);

create policy "Users can create own listings"
  on marketplace for insert with check (auth.uid() = seller_id);

create policy "Users can update own listings"
  on marketplace for update using (auth.uid() = seller_id);

-- ============================================
-- Auto-create profile on signup
-- ============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
