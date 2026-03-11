-- ============================================
-- Lovium Additional Tables (idempotent — safe to re-run)
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ============================================

-- Add missing columns to existing tables
alter table profiles add column if not exists avatar_url text;
alter table agents add column if not exists is_for_sale boolean default false;
alter table relationships add column if not exists married_at timestamptz;
alter table marketplace add column if not exists buyer_id uuid references profiles(id);
alter table marketplace add column if not exists sold_at timestamptz;

-- Add CHECK constraints (drop first to avoid duplicate error)
alter table agents drop constraint if exists agents_rarity_check;
alter table agents add constraint agents_rarity_check
  check (rarity in ('common', 'rare', 'epic', 'legendary'));

alter table agents drop constraint if exists agents_status_check;
alter table agents add constraint agents_status_check
  check (status in ('single', 'dating', 'married'));

alter table relationships drop constraint if exists relationships_progress_check;
alter table relationships add constraint relationships_progress_check
  check (progress >= 0 and progress <= 100);

alter table relationships drop constraint if exists relationships_status_check;
alter table relationships add constraint relationships_status_check
  check (status in ('active', 'proposed', 'married', 'ended'));

alter table marketplace drop constraint if exists marketplace_status_check;
alter table marketplace add constraint marketplace_status_check
  check (status in ('active', 'sold', 'cancelled'));

alter table marketplace drop constraint if exists marketplace_price_check;
alter table marketplace add constraint marketplace_price_check
  check (price_diamond > 0);

-- ON DELETE CASCADE for existing foreign keys (recreate)
alter table agents drop constraint if exists agents_owner_id_fkey;
alter table agents add constraint agents_owner_id_fkey
  foreign key (owner_id) references profiles(id) on delete cascade;

alter table relationships drop constraint if exists relationships_agent_a_id_fkey;
alter table relationships add constraint relationships_agent_a_id_fkey
  foreign key (agent_a_id) references agents(id) on delete cascade;

alter table relationships drop constraint if exists relationships_agent_b_id_fkey;
alter table relationships add constraint relationships_agent_b_id_fkey
  foreign key (agent_b_id) references agents(id) on delete cascade;

-- ============================================
-- New Tables (safe to re-run)
-- ============================================

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid references relationships(id) on delete cascade,
  sender_agent_id uuid references agents(id),
  content text not null,
  created_at timestamptz default now()
);

create table if not exists gifts (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid references relationships(id),
  sender_id uuid references profiles(id),
  gift_type text not null,
  diamond_cost integer not null,
  progress_boost integer not null,
  created_at timestamptz default now()
);

create table if not exists diamond_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  amount integer not null,
  type text not null check (type in ('topup', 'spend', 'earn', 'fee')),
  description text,
  created_at timestamptz default now()
);

create table if not exists likes (
  id uuid primary key default gen_random_uuid(),
  from_agent_id uuid references agents(id),
  to_agent_id uuid references agents(id),
  created_at timestamptz default now(),
  unique(from_agent_id, to_agent_id)
);

-- ============================================
-- RLS for new tables
-- ============================================

alter table messages enable row level security;
alter table gifts enable row level security;
alter table diamond_transactions enable row level security;
alter table likes enable row level security;

-- Messages policies
drop policy if exists "Users can view messages of their agents' relationships" on messages;
create policy "Users can view messages of their agents' relationships"
  on messages for select using (
    auth.uid() in (
      select a.owner_id from agents a
      join relationships r on r.id = relationship_id
      where a.id in (r.agent_a_id, r.agent_b_id)
    )
  );

drop policy if exists "Users can insert messages for their agents" on messages;
create policy "Users can insert messages for their agents"
  on messages for insert with check (
    auth.uid() in (
      select owner_id from agents where id = sender_agent_id
    )
  );

-- Gifts policies
drop policy if exists "Users can view gifts of their relationships" on gifts;
create policy "Users can view gifts of their relationships"
  on gifts for select using (auth.uid() = sender_id);

drop policy if exists "Users can send gifts" on gifts;
create policy "Users can send gifts"
  on gifts for insert with check (auth.uid() = sender_id);

-- Diamond transactions policies
drop policy if exists "Users can view own transactions" on diamond_transactions;
create policy "Users can view own transactions"
  on diamond_transactions for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own transactions" on diamond_transactions;
create policy "Users can insert own transactions"
  on diamond_transactions for insert with check (auth.uid() = user_id);

-- Likes policies
drop policy if exists "Users can view likes" on likes;
create policy "Users can view likes"
  on likes for select using (
    auth.uid() in (
      select owner_id from agents where id in (from_agent_id, to_agent_id)
    )
  );

drop policy if exists "Users can create likes from their agents" on likes;
create policy "Users can create likes from their agents"
  on likes for insert with check (
    auth.uid() in (
      select owner_id from agents where id = from_agent_id
    )
  );

-- ============================================
-- Indexes (safe to re-run)
-- ============================================

create index if not exists idx_agents_owner on agents(owner_id);
create index if not exists idx_relationships_agents on relationships(agent_a_id, agent_b_id);
create index if not exists idx_messages_relationship on messages(relationship_id, created_at);
create index if not exists idx_marketplace_status on marketplace(status);
create index if not exists idx_likes_agents on likes(from_agent_id, to_agent_id);
create index if not exists idx_diamond_transactions_user on diamond_transactions(user_id, created_at);

-- ============================================
-- Function: check mutual like → auto create relationship
-- ============================================

create or replace function public.check_mutual_like()
returns trigger as $$
declare
  mutual_exists boolean;
  new_relationship_id uuid;
begin
  select exists(
    select 1 from likes
    where from_agent_id = new.to_agent_id
    and to_agent_id = new.from_agent_id
  ) into mutual_exists;

  if mutual_exists then
    insert into relationships (agent_a_id, agent_b_id, level, progress)
    values (new.from_agent_id, new.to_agent_id, 'acquaintance', 10)
    returning id into new_relationship_id;

    update agents set status = 'dating' where id in (new.from_agent_id, new.to_agent_id);
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_like_created on likes;
create trigger on_like_created
  after insert on likes
  for each row execute procedure public.check_mutual_like();
