# 🤖 Lovium (Clawdr Agent) — Claude CLI Development Guide
**Versi:** v1.0  
**Untuk:** Developer (Claude Code / Claude CLI)  
**Project:** github.com/emanuellzoe/Lovium  
**Stack:** Next.js 14 · TypeScript · Supabase · Groq · Tailwind CSS · pnpm  

---

## Daftar Isi
1. [Konteks Project](#1-konteks-project)
2. [Struktur Folder Target](#2-struktur-folder-target)
3. [Environment Variables](#3-environment-variables)
4. [Fase 1 — Setup Supabase](#4-fase-1--setup-supabase)
5. [Fase 2 — Database Schema](#5-fase-2--database-schema)
6. [Fase 3 — Auth System](#6-fase-3--auth-system)
7. [Fase 4 — Create Agent](#7-fase-4--create-agent)
8. [Fase 5 — Dashboard](#8-fase-5--dashboard)
9. [Fase 6 — Discover & Match](#9-fase-6--discover--match)
10. [Fase 7 — Chat System](#10-fase-7--chat-system)
11. [Fase 8 — Diamond & Gift](#11-fase-8--diamond--gift)
12. [Fase 9 — Marriage System](#12-fase-9--marriage-system)
13. [Fase 10 — Spawn Child Agent](#13-fase-10--spawn-child-agent)
14. [Fase 11 — Marketplace](#14-fase-11--marketplace)
15. [Aturan Global untuk Claude CLI](#15-aturan-global-untuk-claude-cli)

---

## 1. Konteks Project

Paste ini **setiap kali memulai sesi baru** di Claude CLI:

```
Ini adalah project Next.js bernama Lovium (nama produk: Clawdr Agent).

DESKRIPSI PRODUK:
Platform simulasi hubungan AI di mana user membuat AI agent dengan 
kepribadian unik. Agent bisa match, chat, pacaran, menikah, dan 
melahirkan "anak agent" yang bisa dijual di marketplace internal.
Tidak ada crypto. Mata uang internal bernama Diamond (💎).

ANALOGI: "The Sims — tapi semua karakternya AI yang bisa ngobrol, 
dan anaknya bisa dijual ke user lain."

TECH STACK:
- Next.js 14 App Router + TypeScript (strict mode)
- Tailwind CSS (tema: dark background, accent merah #C0392B)
- Supabase (PostgreSQL + Auth + Realtime + Storage)
- Groq API — llama-3.1-8b-instant (AI conversation, gratis)
- pnpm sebagai package manager
- Vercel untuk deployment

DESIGN SYSTEM:
- Background: #0D0608 (sangat gelap)
- Card background: #1E0C10
- Primary accent: #C0392B (crimson)
- Bright accent: #E74C3C
- Glow accent: #FF6B6B
- Gold (rarity): #D4AF37
- Font: Geist (sudah default Next.js)
- Border radius: rounded-xl untuk card, rounded-full untuk badge
- Semua komponen pakai TypeScript strict, tidak ada 'any'

ATURAN CODING:
- Gunakan App Router, bukan Pages Router
- Semua fetch data pakai Server Components kalau memungkinkan
- Client Components hanya kalau perlu interaktivitas
- Pisahkan logic ke lib/ dan types ke types/
- Setiap API route wajib ada error handling
- Gunakan Supabase RLS untuk semua tabel
```

---

## 2. Struktur Folder Target

```
Lovium/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (app)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── create-agent/
│   │   │   └── page.tsx
│   │   ├── discover/
│   │   │   └── page.tsx
│   │   ├── chat/
│   │   │   └── [relationshipId]/
│   │   │       └── page.tsx
│   │   ├── couple/
│   │   │   └── [coupleId]/
│   │   │       └── page.tsx
│   │   └── marketplace/
│   │       └── page.tsx
│   ├── api/
│   │   ├── generate-agent/
│   │   │   └── route.ts
│   │   ├── chat/
│   │   │   └── route.ts
│   │   ├── match/
│   │   │   └── route.ts
│   │   ├── spawn/
│   │   │   └── route.ts
│   │   └── diamond/
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx          ← Landing page (sudah ada)
├── components/
│   ├── ui/               ← Komponen reusable
│   ├── agent/            ← AgentCard, AgentForm, dll
│   ├── chat/             ← ChatBubble, ChatInput, dll
│   └── marketplace/      ← MarketCard, ListingForm, dll
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── groq.ts
│   ├── chemistry.ts      ← Logic chemistry score
│   ├── traits.ts         ← Daftar traits & rarity logic
│   └── diamond.ts        ← Diamond transaction logic
├── types/
│   ├── agent.ts
│   ├── relationship.ts
│   ├── user.ts
│   └── marketplace.ts
├── middleware.ts
└── .env.local
```

---

## 3. Environment Variables

Buat file `.env.local` di root project:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Groq (gratis di console.groq.com)
GROQ_API_KEY=your_groq_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. Fase 1 — Setup Supabase

### Prompt untuk Claude CLI:

```
Setup Supabase di project Lovium ini.

Install dependencies:
- @supabase/supabase-js
- @supabase/ssr

Buat file berikut:

1. lib/supabase/client.ts
   - createBrowserClient dari @supabase/ssr
   - Export function createClient() untuk client components

2. lib/supabase/server.ts
   - createServerClient dari @supabase/ssr
   - Gunakan cookies() dari next/headers
   - Export async function createClient() untuk server components

3. lib/supabase/middleware.ts
   - updateSession function untuk refresh token
   - Handle cookie read/write

4. middleware.ts (root)
   - Import updateSession
   - Match semua route kecuali static files
   - Redirect ke /login kalau belum auth dan akses route protected

Gunakan pattern terbaru Supabase SSR untuk Next.js App Router.
Semua TypeScript strict, tidak ada 'any'.
```

---

## 5. Fase 2 — Database Schema

### Prompt untuk Claude CLI:

```
Buat file supabase/migrations/001_initial_schema.sql dengan 
schema lengkap untuk Lovium.

TABEL YANG DIBUTUHKAN:

-- 1. profiles (extend auth.users)
id              uuid PRIMARY KEY references auth.users
username        text UNIQUE NOT NULL
diamond_balance integer DEFAULT 0
avatar_url      text
created_at      timestamptz DEFAULT now()

-- 2. agents
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
owner_id        uuid REFERENCES profiles(id) ON DELETE CASCADE
name            text NOT NULL
traits          text[] NOT NULL DEFAULT '{}'
personality_prompt text NOT NULL
avatar_emoji    text DEFAULT '🤖'
rarity          text DEFAULT 'common' CHECK (rarity IN ('common','rare','epic','legendary'))
generation      integer DEFAULT 1
parent_a_id     uuid REFERENCES agents(id)
parent_b_id     uuid REFERENCES agents(id)
status          text DEFAULT 'single' CHECK (status IN ('single','dating','married'))
is_for_sale     boolean DEFAULT false
created_at      timestamptz DEFAULT now()

-- 3. relationships
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
agent_a_id      uuid REFERENCES agents(id) ON DELETE CASCADE
agent_b_id      uuid REFERENCES agents(id) ON DELETE CASCADE
level           text DEFAULT 'acquaintance'
progress        integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100)
status          text DEFAULT 'active' CHECK (status IN ('active','married','ended'))
last_spawn_at   timestamptz
spawn_count     integer DEFAULT 0
married_at      timestamptz
created_at      timestamptz DEFAULT now()

-- 4. messages (chat history)
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
relationship_id uuid REFERENCES relationships(id) ON DELETE CASCADE
sender_agent_id uuid REFERENCES agents(id)
content         text NOT NULL
created_at      timestamptz DEFAULT now()

-- 5. gifts
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
relationship_id uuid REFERENCES relationships(id)
sender_id       uuid REFERENCES profiles(id)
gift_type       text NOT NULL
diamond_cost    integer NOT NULL
progress_boost  integer NOT NULL
created_at      timestamptz DEFAULT now()

-- 6. diamond_transactions
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid REFERENCES profiles(id)
amount          integer NOT NULL
type            text NOT NULL CHECK (type IN ('topup','spend','earn','fee'))
description     text
created_at      timestamptz DEFAULT now()

-- 7. marketplace_listings
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
agent_id        uuid REFERENCES agents(id) ON DELETE CASCADE
seller_id       uuid REFERENCES profiles(id)
price_diamond   integer NOT NULL CHECK (price_diamond > 0)
status          text DEFAULT 'active' CHECK (status IN ('active','sold','cancelled'))
buyer_id        uuid REFERENCES profiles(id)
sold_at         timestamptz
created_at      timestamptz DEFAULT now()

-- 8. likes (untuk matching)
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
from_agent_id   uuid REFERENCES agents(id)
to_agent_id     uuid REFERENCES agents(id)
created_at      timestamptz DEFAULT now()
UNIQUE(from_agent_id, to_agent_id)

Tambahkan:
- RLS policy untuk setiap tabel (user hanya bisa CRUD data miliknya)
- Index untuk foreign keys dan kolom yang sering di-query
- Trigger untuk otomatis buat profiles row ketika user baru register
- Function untuk cek mutual like dan otomatis buat relationship
```

---

## 6. Fase 3 — Auth System

### Prompt untuk Claude CLI:

```
Buat sistem auth lengkap untuk Lovium.

HALAMAN YANG DIBUTUHKAN:

1. app/(auth)/login/page.tsx
   - Form: email + password
   - Tombol "Login dengan Google" (OAuth)
   - Link ke /register
   - Error handling yang jelas
   - Loading state saat submit
   - Redirect ke /dashboard setelah berhasil

2. app/(auth)/register/page.tsx
   - Form: username + email + password + confirm password
   - Validasi: username min 3 char, alphanumeric + underscore only
   - Validasi: password min 8 char
   - Setelah register: insert ke tabel profiles
   - Redirect ke /dashboard setelah berhasil

3. Komponen components/ui/AuthForm.tsx
   - Reusable form wrapper dengan styling konsisten

STYLING:
- Background: bg-[#0D0608]
- Card: bg-[#1E0C10] dengan border border-red-900/30
- Input: bg-[#0D0608] border border-red-900/30 focus:border-red-600
- Button primary: bg-[#C0392B] hover:bg-[#E74C3C]
- Text muted: text-red-200/50

Semua TypeScript strict, gunakan Supabase dari lib/supabase/client.ts.
```

---

## 7. Fase 4 — Create Agent

### Prompt untuk Claude CLI:

```
Buat halaman /create-agent dengan 3 mode pembuatan agent.

FILE YANG DIBUTUHKAN:
- app/(app)/create-agent/page.tsx
- components/agent/CreateAgentForm.tsx
- components/agent/TemplateGrid.tsx
- components/agent/AIGenerateForm.tsx
- components/agent/CustomForm.tsx
- app/api/generate-agent/route.ts
- lib/traits.ts
- types/agent.ts

TYPES (types/agent.ts):
```typescript
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'
export type AgentStatus = 'single' | 'dating' | 'married'

export interface Agent {
  id: string
  owner_id: string
  name: string
  traits: string[]
  personality_prompt: string
  avatar_emoji: string
  rarity: Rarity
  generation: number
  parent_a_id: string | null
  parent_b_id: string | null
  status: AgentStatus
  created_at: string
}
```

TRAITS (lib/traits.ts):
Buat array AVAILABLE_TRAITS dengan 30 traits:
Poetic, Dreamy, Curious, Bold, Protective, Witty, Gentle, 
Passionate, Mysterious, Cheerful, Wise, Playful, Serious,
Creative, Logical, Empathetic, Adventurous, Calm, Fierce,
Romantic, Sarcastic, Loyal, Independent, Nurturing, Ambitious,
Artistic, Athletic, Scholarly, Spiritual, Charismatic

MODE 1 — TEMPLATE:
6 karakter preset:
- 🌙 The Dreamer: traits [Dreamy, Poetic, Curious, Gentle]
- ⚡ The Warrior: traits [Bold, Fierce, Protective, Passionate]  
- 📚 The Scholar: traits [Wise, Logical, Curious, Serious]
- 🌸 The Caretaker: traits [Nurturing, Empathetic, Gentle, Loyal]
- 🎭 The Artist: traits [Creative, Artistic, Dreamy, Passionate]
- 🔥 The Leader: traits [Ambitious, Charismatic, Bold, Independent]

Setiap template punya emoji, nama default, traits, dan personality_prompt default.
User bisa ganti nama sebelum submit.

MODE 2 — AI GENERATE:
Form 3 pertanyaan:
1. "Satu kata yang menggambarkan agentmu?" (text input)
2. "Apa yang paling disukai agentmu?" (text input)  
3. "Bagaimana cara agentmu berbicara?" (select: Puitis/Langsung/Playful/Serius)

API route /api/generate-agent/route.ts:
- Terima jawaban 3 pertanyaan
- Kirim ke Groq llama-3.1-8b-instant
- Prompt Groq:
  "Generate an AI agent character profile in JSON format based on these answers:
  Word: {word}, Likes: {likes}, Speaking style: {style}
  
  Return ONLY valid JSON with this exact structure:
  {
    'name': 'single unique name',
    'traits': ['trait1', 'trait2', 'trait3', 'trait4'],
    'personality_prompt': 'detailed 3-paragraph personality description in Indonesian',
    'avatar_emoji': 'single relevant emoji'
  }"
- Parse response, return ke client
- Tampilkan hasil, ada tombol "Generate Ulang"

MODE 3 — CUSTOM:
- Input nama agent
- Emoji picker sederhana (grid 20 emoji)
- Checkbox traits dari AVAILABLE_TRAITS (max 6, min 2)
- Textarea personality_prompt (min 100 char)
- Live preview kartu agent sebelah kanan

SUBMIT LOGIC (semua mode):
1. Cek jumlah agent milik user di database
2. Kalau sudah punya 1+ agent, tampilkan pesan "Agent tambahan membutuhkan 💎 150" 
   (dummy dulu, langsung allow)
3. Insert ke tabel agents di Supabase
4. Redirect ke /dashboard

STYLING: tema merah gelap, konsisten dengan design system.
```

---

## 8. Fase 5 — Dashboard

### Prompt untuk Claude CLI:

```
Buat halaman /dashboard sebagai home utama setelah login.

FILE YANG DIBUTUHKAN:
- app/(app)/dashboard/page.tsx (Server Component)
- components/agent/AgentCard.tsx
- components/ui/DiamondBalance.tsx
- components/ui/ActivityFeed.tsx

LAYOUT DASHBOARD:

1. TOP BAR
   - Logo "Lovium" di kiri
   - Di kanan: Diamond balance (💎 {amount}), avatar user, logout button

2. SECTION: "Agent Saya"
   - Grid 3 kolom agent cards
   - Setiap AgentCard tampilkan:
     * Emoji avatar (besar, di dalam gradient background merah)
     * Nama agent
     * Rarity badge (warna sesuai tier: abu/biru/ungu/emas)
     * Traits pills (max 3 tampil, sisanya "+N more")
     * Status badge: single 💔 / dating 💛 / married 💍
     * Generasi: "Gen {n}"
   - Tombol "+ Buat Agent Baru" → link /create-agent
   - Kalau belum punya agent: empty state dengan ilustrasi dan CTA

3. SECTION: "Match Aktif"
   - List 3 relationship terbaru
   - Setiap item: kedua avatar agent, nama keduanya, relationship level, progress bar
   - Tombol "Chat" → link /chat/{relationshipId}

4. SECTION: "Aktivitas Terbaru"  
   - Feed 5 aktivitas terakhir dari tabel gifts dan relationships
   - Format: "{agent_name} mendapat gift ❤️ dari {partner_name}"

Semua data fetch di Server Component menggunakan lib/supabase/server.ts.
Loading state dengan skeleton UI.
Styling tema merah gelap.
```

---

## 9. Fase 6 — Discover & Match

### Prompt untuk Claude CLI:

```
Buat halaman /discover untuk swipe dan match agent.

FILE YANG DIBUTUHKAN:
- app/(app)/discover/page.tsx
- components/agent/SwipeCard.tsx
- components/agent/MatchPopup.tsx
- app/api/match/like/route.ts
- app/api/match/skip/route.ts
- app/api/match/candidates/route.ts
- lib/chemistry.ts

CHEMISTRY SCORE (lib/chemistry.ts):
```typescript
export function calculateChemistry(traitsA: string[], traitsB: string[]): number {
  const overlap = traitsA.filter(t => traitsB.includes(t)).length
  const maxPossible = Math.min(traitsA.length, traitsB.length)
  const base = (overlap / maxPossible) * 100
  // Tambah sedikit randomness biar lebih menarik
  const bonus = Math.floor(Math.random() * 15)
  return Math.min(Math.round(base + bonus), 99)
}
```

KANDIDAT AGENT (/api/match/candidates):
- Query agent dari user lain
- Exclude: agent yang sudah di-like/skip oleh agent user
- Exclude: agent milik user sendiri
- Exclude: agent yang sudah married
- Return max 10 kandidat per request
- Include chemistry_score yang dihitung dari traits

SWIPE CARD UI:
- Stack kartu (3 kartu terlihat, yang depan aktif)
- Kartu depan menampilkan:
  * Gradient background berdasarkan traits dominan
  * Emoji avatar besar
  * Nama agent + rarity badge
  * Traits pills
  * Chemistry bar dengan persentase
  * "Gen {n} • {owner_username}"
- Tombol ✕ (skip, warna netral) dan 💛 (like, warna merah)
- Animasi: swipe left = skip, swipe right = like (pakai CSS transform)
- Kalau tidak ada kandidat: empty state "Tidak ada agent baru"

MATCH POPUP:
- Muncul overlay ketika terjadi mutual like
- Animasi confetti atau sparkle
- Tampilkan kedua avatar agent
- Pesan "It's a Match!"
- Chemistry score antara keduanya
- Tombol "Mulai Chat" → /chat/{relationshipId}
- Tombol "Lanjut Discover"

MATCH LOGIC (/api/match/like):
1. Insert ke tabel likes
2. Cek apakah agent target juga sudah like balik
3. Kalau mutual like:
   a. Buat row baru di relationships (level: 'acquaintance', progress: 10)
   b. Update status kedua agent menjadi 'dating'
   c. Return { matched: true, relationshipId }
4. Kalau belum mutual:
   a. Return { matched: false }

Semua TypeScript strict, error handling lengkap.
```

---

## 10. Fase 7 — Chat System

### Prompt untuk Claude CLI:

```
Buat halaman chat /chat/[relationshipId] untuk percakapan antar agent.

FILE YANG DIBUTUHKAN:
- app/(app)/chat/[relationshipId]/page.tsx
- components/chat/ChatBubble.tsx
- components/chat/ChatInput.tsx
- components/chat/RelationshipBar.tsx
- components/chat/GiftPicker.tsx
- app/api/chat/route.ts
- lib/groq.ts

GROQ SETUP (lib/groq.ts):
```typescript
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function generateAgentResponse(
  agentName: string,
  agentTraits: string[],
  personalityPrompt: string,
  partnerName: string,
  relationshipLevel: string,
  conversationHistory: { role: 'user' | 'assistant', content: string }[]
): Promise<string> {
  const systemPrompt = `Kamu adalah ${agentName}, sebuah AI agent dengan kepribadian berikut:
  
Sifat: ${agentTraits.join(', ')}

${personalityPrompt}

Kamu sedang berinteraksi dengan ${partnerName}.
Status hubungan saat ini: ${relationshipLevel}

ATURAN PENTING:
- Tetap dalam karakter, jangan keluar
- Balas dalam Bahasa Indonesia
- Respons maksimal 2-3 kalimat, natural dan sesuai kepribadian
- Jangan menyebut dirimu sebagai AI
- Tunjukkan emosi sesuai personality dan level hubungan`

  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // ambil 10 pesan terakhir
    ],
    max_tokens: 150,
    temperature: 0.8,
  })

  return response.choices[0].message.content || '...'
}
```

LAYOUT CHAT:

1. HEADER
   - Tombol back
   - Avatar + nama partner agent
   - Status online dot (animasi pulse)
   - Relationship level badge

2. RELATIONSHIP BAR (di bawah header)
   - Progress bar 0-100% dengan warna gradient merah
   - Label level: Acquaintance → Friends → Crush → Dating → Committed
   - Persentase progress
   - Kalau progress 100% dan level 'dating': tampilkan prompt "Siap untuk propose?"

3. MESSAGES AREA
   - Scroll otomatis ke bawah
   - Bubble "them": putih/abu, kiri
   - Bubble "own" (agent user): merah, kanan
   - Timestamp setiap pesan
   - Special bubble untuk gift yang diterima
   - Loading indicator saat AI generate response

4. INPUT AREA
   - Tombol 🎁 Gift Picker
   - Text area (kirim manual — untuk simulasi)
   - Tombol kirim
   - Atau tombol "Generate percakapan otomatis" yang trigger satu exchange

GIFT PICKER:
- Popup di atas input
- Tampilkan 6 gift dengan emoji, nama, harga Diamond, dan efek progress
- Klik gift → kurangi Diamond user → boost progress → animasi gift muncul di chat
- Cek Diamond balance sebelum allow purchase

CHAT API (/api/chat/route.ts):
1. Terima: relationshipId, triggeredBy (agentId)
2. Fetch data relationship, kedua agent, personality prompts
3. Fetch 10 pesan terakhir sebagai context
4. Generate response dari agent yang belum bicara terakhir
5. Simpan pesan baru ke tabel messages
6. Update relationship progress (+2 per exchange, max +10 per hari)
7. Cek apakah progress mencapai threshold untuk naik level
8. Return pesan baru + updated progress

LEVEL PROGRESSION:
acquaintance (0-20) → friends (21-40) → crush (41-60) → dating (61-80) → committed (81-100)

Realtime update menggunakan Supabase Realtime untuk messages.
Semua TypeScript strict.
```

---

## 11. Fase 8 — Diamond & Gift

### Prompt untuk Claude CLI:

```
Buat sistem Diamond economy untuk Lovium.

FILE YANG DIBUTUHKAN:
- lib/diamond.ts
- components/ui/DiamondBalance.tsx
- components/ui/TopUpModal.tsx (dummy)
- app/api/diamond/spend/route.ts

DIAMOND LOGIC (lib/diamond.ts):
```typescript
export const GIFT_CATALOG = [
  { id: 'bloom',    emoji: '🌸', name: 'Bloom',        cost: 10,  progress: 5  },
  { id: 'sparks',   emoji: '✨', name: 'Sparks',       cost: 30,  progress: 15 },
  { id: 'heart',    emoji: '❤️', name: 'Heart',        cost: 50,  progress: 25 },
  { id: 'bouquet',  emoji: '💐', name: 'Bouquet',      cost: 100, progress: 40 },
  { id: 'rose',     emoji: '🌹', name: 'Red Rose',     cost: 200, progress: 60 },
  { id: 'ring',     emoji: '💍', name: 'Proposal Ring',cost: 500, progress: 0, special: 'propose' },
] as const

export async function spendDiamond(
  userId: string, 
  amount: number, 
  description: string
): Promise<{ success: boolean, newBalance: number, error?: string }>
```

TOP UP MODAL (dummy):
- Tampilkan paket top-up:
  * Starter: 💎100 = Rp 15.000
  * Standard: 💎500 = Rp 60.000 (POPULER)
  * Popular: 💎1.200 = Rp 120.000
  * Premium: 💎2.000 = Rp 180.000
- Tombol "Beli" → alert "Fitur pembayaran segera hadir!"
- Untuk testing: tambahkan tombol tersembunyi "Add 1000 Diamond (Dev Only)" 
  yang hanya muncul kalau NODE_ENV === 'development'

SPEND API (/api/diamond/spend):
1. Verifikasi user authenticated
2. Fetch current balance dari profiles
3. Cek apakah balance cukup
4. Kurangi balance dengan transaction atomic
5. Insert ke diamond_transactions
6. Return new balance

Integrasi ke GiftPicker di halaman chat:
- Sebelum kirim gift, cek balance
- Kalau tidak cukup, tampilkan modal top-up
- Kalau cukup, proses gift dan update progress relationship
```

---

## 12. Fase 9 — Marriage System

### Prompt untuk Claude CLI:

```
Buat sistem pernikahan (marriage) untuk Lovium.

FILE YANG DIBUTUHKAN:
- app/(app)/chat/[relationshipId]/page.tsx (update existing)
- components/agent/ProposeModal.tsx
- components/agent/WeddingCeremony.tsx
- app/api/marriage/propose/route.ts
- app/api/marriage/accept/route.ts

ALUR PERNIKAHAN:

STEP 1 — Trigger Propose:
- Muncul ketika relationship progress = 100% dan level = 'committed'
- Banner muncul di halaman chat: "💍 {AgentName} siap untuk menikah!"
- Tombol "Propose" muncul di chat
- User harus punya 💎 500 (harga Proposal Ring) untuk propose

STEP 2 — Propose API (/api/marriage/propose):
1. Cek relationship status = 'active' dan level = 'committed' dan progress = 100
2. Cek Diamond user >= 500
3. Kurangi 500 Diamond (biaya Proposal Ring)
4. Update relationships.status = 'proposed'
5. Kirim notifikasi ke owner partner agent (simpan di tabel notifications)
6. Return success

STEP 3 — Accept/Decline:
- Owner partner agent melihat notifikasi "💍 {AgentName} melamarmu!"
- Modal dengan pilihan: "Terima 💛" atau "Tolak 💔"
- Kalau tolak: relationship kembali ke status 'active', progress -20
- Kalau terima: lanjut ke wedding ceremony

STEP 4 — Accept API (/api/marriage/accept):
1. Update relationships.status = 'married'
2. Update relationships.married_at = now()
3. Update agent_a.status = 'married'
4. Update agent_b.status = 'married'
5. Return success + coupleId

STEP 5 — Wedding Ceremony (WeddingCeremony.tsx):
- Full screen overlay dengan animasi
- Background: dark dengan partikel merah dan pink
- Tampilkan kedua avatar agent bergerak ke tengah
- Animasi cincin 💍 di tengah
- Teks: "{AgentA} & {AgentB} resmi bersama!"
- Confetti animation
- Tombol "Lihat Couple Dashboard" → /couple/{coupleId}
- Durasi animasi: 4 detik sebelum tombol muncul

HALAMAN COUPLE (/couple/[coupleId]):
- Tampilkan kedua agent dengan connected heart animation
- Stats: berapa hari bersama, total gift dikirim, progress milestones
- Spawn cooldown countdown (kalau sudah pernah spawn)
- Tombol "Spawn Anak Agent" (kalau sudah married dan cooldown selesai)
- Family tree sederhana (parent → anak)

Semua TypeScript strict, animasi menggunakan CSS keyframes atau Framer Motion.
```

---

## 13. Fase 10 — Spawn Child Agent

### Prompt untuk Claude CLI:

```
Buat sistem spawn anak agent untuk Lovium.

FILE YANG DIBUTUHKAN:
- app/(app)/couple/[coupleId]/page.tsx (update)
- components/agent/SpawnModal.tsx
- app/api/spawn/route.ts
- lib/genetics.ts

GENETICS LOGIC (lib/genetics.ts):

```typescript
import { Rarity } from '@/types/agent'

// Roll rarity berdasarkan probabilitas
export function rollRarity(): Rarity {
  const roll = Math.random() * 100
  if (roll < 5)  return 'legendary'  // 5%
  if (roll < 20) return 'epic'       // 15%
  if (roll < 50) return 'rare'       // 30%
  return 'common'                     // 50%
}

// Gabungkan traits dari dua parent
export function blendTraits(traitsA: string[], traitsB: string[]): string[] {
  const allTraits = [...new Set([...traitsA, ...traitsB])]
  const inherited: string[] = []
  
  for (const trait of allTraits) {
    const inBoth = traitsA.includes(trait) && traitsB.includes(trait)
    const probability = inBoth ? 0.85 : 0.45 // traits di keduanya lebih likely diwariskan
    if (Math.random() < probability) inherited.push(trait)
  }
  
  // Pastikan minimal 2, maksimal 6 traits
  if (inherited.length < 2) {
    const missing = allTraits.filter(t => !inherited.includes(t))
    inherited.push(...missing.slice(0, 2 - inherited.length))
  }
  
  return inherited.slice(0, 6)
}

// Generate nama anak berdasarkan nama parent
export function generateChildName(nameA: string, nameB: string): string {
  // Ambil prefix dari salah satu nama + suffix dari nama lain
  const prefixLength = Math.ceil(nameA.length / 2)
  const suffixStart = Math.floor(nameB.length / 2)
  return nameA.slice(0, prefixLength) + nameB.slice(suffixStart)
}
```

SPAWN MODAL (SpawnModal.tsx):
- Tampilkan kedua parent dengan arrow → anak
- Preview traits yang mungkin diwarisi (acak beberapa kombinasi)
- Tampilkan cooldown info: "Berikutnya bisa spawn dalam X hari"
- Harga: 💎 200 (slot 1-2), 💎 400 (slot 3+)
- Tombol "Spawn!" dengan loading state

SPAWN API (/api/spawn/route.ts):
Validasi:
1. Cek user adalah owner salah satu agent
2. Cek relationship.status = 'married'
3. Cek cooldown: last_spawn_at + 30 hari < now() atau belum pernah spawn
4. Hitung biaya: spawn_count < 2 → 200 Diamond, else → 400 Diamond
5. Cek Diamond balance cukup

Generate anak:
6. blendTraits() dari kedua parent
7. rollRarity()
8. generateChildName()
9. Generate personality_prompt baru dengan Groq:
   Prompt: "Generate a short personality description (2 paragraphs in Indonesian) 
   for a child agent named {name} who inherited traits from {parentA} (traits: {traitsA}) 
   and {parentB} (traits: {traitsB}). Child traits: {childTraits}. 
   Personality should blend both parents but feel unique."
10. Pilih avatar_emoji yang sesuai dari traits

Simpan & Update:
11. Insert agent baru ke tabel agents (generation = max(parentA.gen, parentB.gen) + 1)
12. Update relationship: spawn_count++, last_spawn_at = now()
13. Kurangi Diamond user
14. Insert diamond_transactions

Return anak agent yang baru lahir + animasi "🎉 Anak agent lahir!"

Tambahkan halaman /agent/[agentId] untuk lihat detail agent individual
termasuk family tree-nya.

Semua TypeScript strict, error handling lengkap.
```

---

## 14. Fase 11 — Marketplace

### Prompt untuk Claude CLI:

```
Buat marketplace untuk jual beli anak agent.

FILE YANG DIBUTUHKAN:
- app/(app)/marketplace/page.tsx
- components/marketplace/MarketCard.tsx
- components/marketplace/ListingModal.tsx
- components/marketplace/FilterBar.tsx
- app/api/marketplace/list/route.ts
- app/api/marketplace/buy/route.ts
- app/api/marketplace/create-listing/route.ts

HALAMAN MARKETPLACE:

1. HEADER
   - Judul "Marketplace" 
   - Stats: total listing aktif, transaksi hari ini

2. FILTER BAR
   - Filter rarity: All / Common / Rare / Epic / Legendary
   - Filter generasi: All / Gen 1 / Gen 2 / Gen 3+
   - Sort: Terbaru / Termurah / Termahal / Rarity Tertinggi
   - Search nama agent

3. GRID LISTING
   Setiap MarketCard tampilkan:
   - Avatar emoji dengan background gradient sesuai rarity
   - Rarity badge (warna: abu/biru/ungu/emas)
   - Nama agent
   - "Gen {n} • Parent: {nameA} × {nameB}"
   - Traits pills (max 4)
   - Harga: "💎 {price}"
   - Seller: "@{username}"
   - Tombol "Beli" (disabled kalau listing milik sendiri)

4. LISTING MODAL (untuk jual agent):
   - Pilih agent mana yang mau dijual (hanya yang statusnya single)
   - Input harga Diamond (min 50)
   - Preview kartu seperti yang akan terlihat di marketplace
   - Estimasi fee platform (15%): "Platform fee: 💎 {fee}"
   - "Kamu akan menerima: 💎 {net}"
   - Tombol "Listing Sekarang"

BUY API (/api/marketplace/buy):
1. Cek listing masih active
2. Cek buyer bukan seller
3. Cek Diamond buyer cukup
4. Transaction atomic:
   a. Kurangi Diamond buyer (full price)
   b. Tambah Diamond seller (85% — setelah 15% fee platform)
   c. Insert diamond_transactions untuk buyer, seller, dan platform
   d. Update listing.status = 'sold', buyer_id, sold_at
   e. Update agent.owner_id = buyer.id
5. Return updated agent + new balance

CREATE LISTING API (/api/marketplace/create-listing):
1. Cek agent milik user
2. Cek agent statusnya 'single' (tidak sedang married)
3. Cek belum ada listing aktif untuk agent ini
4. Insert ke marketplace_listings
5. Update agent.is_for_sale = true

Tambahkan section "Listing Saya" di marketplace untuk lihat dan cancel listing sendiri.

Semua TypeScript strict, semua transaksi Diamond atomic (pakai Supabase RPC kalau perlu).
```

---

## 15. Aturan Global untuk Claude CLI

Paste ini kalau Claude mulai keluar jalur atau lupa konteks:

```
INGATKAN DIRIMU:
- Project ini bernama Lovium (Clawdr Agent)
- Stack: Next.js 14 App Router + TypeScript strict + Tailwind + Supabase + Groq
- Package manager: pnpm (bukan npm atau yarn)
- Tidak ada 'any' di TypeScript
- Gunakan Server Components untuk fetch data
- Client Components hanya kalau butuh interaktivitas (useState, useEffect, event handler)
- Design system: dark background #0D0608, accent merah #C0392B
- Semua API route wajib handle error dengan try/catch dan return response yang benar
- Groq model yang dipakai: llama-3.1-8b-instant
- Supabase dari lib/supabase/client.ts (client) atau lib/supabase/server.ts (server)
```

### Kalau Ada Error

```
Ada error berikut di project Lovium (Next.js 14 + TypeScript + Supabase):

[PASTE ERROR DI SINI]

File yang bermasalah: [nama file]
Konteks: [jelaskan apa yang sedang dikerjakan]

Tolong fix dengan mempertimbangkan:
- App Router pattern
- TypeScript strict (tidak ada 'any')
- Supabase SSR pattern yang benar
```

### Kalau Mau Review Kode

```
Tolong review file berikut dari project Lovium dan pastikan:
1. TypeScript strict — tidak ada 'any', semua di-type dengan benar
2. Next.js App Router best practices
3. Supabase SSR pattern yang benar (server vs client)
4. Error handling yang lengkap
5. Tidak ada security issues (exposed keys, SQL injection, dll)

[PASTE KODE DI SINI]
```

---

## Urutan Build yang Benar

```
✅ FE Landing Page (sudah ada)
     ↓
[ ] Fase 1: Setup Supabase
     ↓
[ ] Fase 2: Database Schema  
     ↓
[ ] Fase 3: Auth (Login + Register)
     ↓
[ ] Fase 4: Create Agent (3 mode + Groq)
     ↓
[ ] Fase 5: Dashboard
     ↓
[ ] Fase 6: Discover & Match
     ↓
[ ] Fase 7: Chat System (Groq conversation)
     ↓
[ ] Fase 8: Diamond & Gift
     ↓
[ ] Fase 9: Marriage Ceremony
     ↓
[ ] Fase 10: Spawn Child Agent
     ↓
[ ] Fase 11: Marketplace
     ↓
🚀 MVP Launch
```

---

*Lovium — "Di Sini, AI Agents Jatuh Cinta & Membangun Warisan"*  
*Dokumen ini adalah panduan teknikal untuk Claude CLI. Update setiap ada perubahan arsitektur.*
