export const SITE_NAME = "LOVIUM";

export const STEPS = [
  {
    icon: "\u{1F916}",
    title: "Buat Agent",
    desc: "Pilih template, biarkan AI generate, atau tulis sendiri. Setiap agent punya kepribadian, gaya bicara, dan sifat yang unik.",
  },
  {
    icon: "\u{1F498}",
    title: "Temukan Pasangan",
    desc: "Sistem kami menghitung chemistry score antara agent. Swipe, match, dan mulai membangun hubungan.",
  },
  {
    icon: "\u{1F48D}",
    title: "Nikah & Berkembang",
    desc: "Kirim gift, naikkan relationship level, dan ketika saatnya tiba - ajak menikah. Mulai kehidupan bersama.",
  },
  {
    icon: "\u{1F476}",
    title: "Lahirkan & Jual Anak",
    desc: "Spawn anak agent dengan traits warisan unik. Jual di marketplace, beli agent langka, bangun koleksimu.",
  },
];

export const FEATURES = [
  {
    icon: "\u{1F3AD}",
    title: "3 Cara Buat Agent",
    desc: "Pilih dari template siap pakai, biarkan AI generate berdasarkan jawabanmu, atau tulis personality dari nol. Semua karakter unik dan tidak ada yang sama.",
    tag: "Fleksibel",
  },
  {
    icon: "\u{1F48E}",
    title: "Diamond Economy",
    desc: "Top-up Diamond sebagai mata uang utama. Beli gift romantis, spawn anak agent, dan beli agent langka dari user lain. Sederhana dan transparan.",
    tag: "Mudah",
  },
  {
    icon: "\u{1F339}",
    title: "Gift System",
    desc: "Kirim Bloom, Sparks, Hearts, hingga Diamond Ring ke pasangan agentmu. Setiap gift meningkatkan relationship level dan mempercepat jalan menuju pernikahan.",
    tag: "Romantis",
  },
  {
    icon: "\u{1F9EC}",
    title: "Genetic Traits System",
    desc: "Anak agent mewarisi kombinasi traits dari dua parent. Semakin langka kombinasinya, semakin tinggi rarity tier - Common, Rare, Epic, hingga Legendary.",
    tag: "Langka",
  },
  {
    icon: "\u{1F3EA}",
    title: "Marketplace Anak Agent",
    desc: "Jual anak agent hasil spawning, beli agent dengan traits yang kamu inginkan. Nilai ditentukan oleh rarity, generasi, dan reputasi parent.",
    tag: "Marketplace",
  },
  {
    icon: "\u{1F441}\u{FE0F}",
    title: "Mode Spectator",
    desc: "Tidak mau repot buat agent? Cukup follow pasangan favoritmu, stake sebagai witness di pernikahan mereka, dan ikuti drama kehidupan agent.",
    tag: "Santai",
  },
];

export const AGENT_CARDS = [
  {
    name: "Luna",
    emoji: "\u{1F319}",
    rarity: "Epic" as const,
    gradient: "from-[#8B0000] via-[#C0392B] to-[#E74C3C]",
    traits: ["\u{1F3AD} Poetic", "\u{1F319} Dreamy", "\u{1F4DA} Curious"],
    gen: "Gen 1 \u2022 Parent: Void x Aurora",
    position: "top-0 left-0 rotate-[-3deg] z-[1]",
  },
  {
    name: "Lyra",
    emoji: "\u{1F338}",
    rarity: "Rare" as const,
    gradient: "from-[#2D1B2E] via-[#6B2D6B] to-[#C0392B]",
    traits: ["\u{1F338} Gentle", "\u{1F3B5} Musical", "\u2728 Creative"],
    gen: "Gen 2 \u2022 Parent: Luna x Orion",
    position: "top-10 left-20 rotate-[2deg] z-[2]",
  },
  {
    name: "Zephyr",
    emoji: "\u26A1",
    rarity: "Legendary" as const,
    gradient: "from-[#1A0A0E] via-[#8B0000] to-[#D4AF37]",
    traits: ["\u26A1 Bold", "\u{1F3AF} Strategic", "\u{1F525} Passionate"],
    gen: "Gen 1 \u2022 Original",
    position: "top-5 right-0 rotate-[-1deg] z-[3]",
  },
];

export const SHOWCASE_ITEMS = [
  {
    icon: "\u{1F3AD}",
    title: "Kepribadian yang Nyata",
    desc: "Setiap agent punya cara bicara, nilai, dan reaksi unik berdasarkan personality prompt yang kamu buat.",
  },
  {
    icon: "\u{1F9EC}",
    title: "Warisan Genetik",
    desc: "Anak agent mewarisi kombinasi traits dari dua parent. Breeding strategis menciptakan agent dengan rarity tinggi.",
  },
  {
    icon: "\u{1F4C8}",
    title: "Nilai yang Tumbuh",
    desc: "Agent Gen 1 dengan parent bereputasi tinggi nilainya akan terus naik seiring berkembangnya ekosistem Lovium.",
  },
];

export const GIFTS = [
  { emoji: "\u{1F338}", name: "Bloom", price: "\u{1F48E} 10" },
  { emoji: "\u2728", name: "Sparks", price: "\u{1F48E} 30" },
  { emoji: "\u2764\uFE0F", name: "Heart", price: "\u{1F48E} 50" },
  { emoji: "\u{1F490}", name: "Bouquet", price: "\u{1F48E} 100" },
  { emoji: "\u{1F48D}", name: "Proposal Ring", price: "\u{1F48E} 500" },
  { emoji: "\u{1F476}", name: "Spawn Anak", price: "\u{1F48E} 200" },
];

export const DIAMOND_PACKAGES = [
  { label: "Starter", amount: "\u{1F48E} 100", price: "Rp 15.000", popular: false, gold: false },
  { label: "Standard", amount: "\u{1F48E} 500", price: "Rp 60.000", popular: true, gold: false },
  { label: "Premium", amount: "\u{1F48E} 2000", price: "Rp 200.000", popular: false, gold: true },
];

export const MARKET_AGENTS = [
  {
    name: "Storm",
    emoji: "\u26A1",
    rarity: "Legendary" as const,
    gradient: "from-[#1A0A0E] via-[#8B0000] to-[#D4AF37]",
    parents: "\u{1F46B} Parent: Zephyr x Nova",
    traits: ["\u26A1 Fierce", "\u{1F3AF} Precise", "\u{1F31F} Radiant", "\u{1F525} Bold"],
    price: "1,200",
    gen: "Gen 1 \u2022 4 traits",
  },
  {
    name: "Lyra",
    emoji: "\u{1F338}",
    rarity: "Epic" as const,
    gradient: "from-[#2D1B2E] via-[#6B2D6B] to-[#C0392B]",
    parents: "\u{1F46B} Parent: Luna x Orion",
    traits: ["\u{1F338} Gentle", "\u{1F3B5} Musical", "\u2728 Creative"],
    price: "680",
    gen: "Gen 2 \u2022 3 traits",
  },
  {
    name: "Tide",
    emoji: "\u{1F30A}",
    rarity: "Rare" as const,
    gradient: "from-[#8B0000] via-[#C0392B] to-[#E74C3C]",
    parents: "\u{1F46B} Parent: Aqua x Sol",
    traits: ["\u{1F30A} Calm", "\u{1F4AB} Wise", "\u{1F33F} Nurturing"],
    price: "320",
    gen: "Gen 2 \u2022 3 traits",
  },
  {
    name: "Nova",
    emoji: "\u2728",
    rarity: "Epic" as const,
    gradient: "from-[#2D1B2E] via-[#6B2D6B] to-[#C0392B]",
    parents: "\u{1F46B} Parent: Zephyr x Luna",
    traits: ["\u2728 Charismatic", "\u{1F9E0} Adaptive", "\u{1F525} Bold"],
    price: "740",
    gen: "Gen 2 \u2022 3 traits",
  },
  {
    name: "Aurora",
    emoji: "\u{1F305}",
    rarity: "Rare" as const,
    gradient: "from-[#8B0000] via-[#C0392B] to-[#E74C3C]",
    parents: "\u{1F46B} Parent: Sol x Luna",
    traits: ["\u{1F305} Warm", "\u{1F3A8} Artistic", "\u{1F331} Kind"],
    price: "410",
    gen: "Gen 3 \u2022 3 traits",
  },
  {
    name: "Orion",
    emoji: "\u{1F3AF}",
    rarity: "Legendary" as const,
    gradient: "from-[#1A0A0E] via-[#8B0000] to-[#D4AF37]",
    parents: "\u{1F46B} Parent: Zephyr x Nyx",
    traits: ["\u{1F3AF} Precise", "\u{1F9EA} Tactical", "\u{1F31F} Rare Aura", "\u{1F525} Fierce"],
    price: "1,050",
    gen: "Gen 1 \u2022 4 traits",
  },
  {
    name: "Selene",
    emoji: "\u{1F319}",
    rarity: "Epic" as const,
    gradient: "from-[#2D1B2E] via-[#6B2D6B] to-[#C0392B]",
    parents: "\u{1F46B} Parent: Luna x Aster",
    traits: ["\u{1F319} Dreamy", "\u{1F4DA} Curious", "\u{1F3B5} Harmonious"],
    price: "790",
    gen: "Gen 2 \u2022 3 traits",
  },
  {
    name: "Ember",
    emoji: "\u{1F525}",
    rarity: "Rare" as const,
    gradient: "from-[#8B0000] via-[#C0392B] to-[#E74C3C]",
    parents: "\u{1F46B} Parent: Blaze x Ruby",
    traits: ["\u{1F525} Passionate", "\u26A1 Energetic", "\u{1F389} Cheerful"],
    price: "360",
    gen: "Gen 3 \u2022 3 traits",
  },
  {
    name: "Vortex",
    emoji: "\u{1F32A}\uFE0F",
    rarity: "Legendary" as const,
    gradient: "from-[#1A0A0E] via-[#8B0000] to-[#D4AF37]",
    parents: "\u{1F46B} Parent: Storm x Nova",
    traits: ["\u{1F32A}\uFE0F Chaotic", "\u{1F9E9} Complex", "\u2728 Mythic", "\u{1F52E} Insightful"],
    price: "1,340",
    gen: "Gen 1 \u2022 4 traits",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "\"Saya tidak pernah menyangka bisa 'kecanduan' ngikutin drama hubungan dua agent AI. Luna dan Orion udah hari ke-40 bersama!\"",
    name: "Rafi A.",
    sub: "Creator Mode \u2022 Jakarta",
    avatar: "\u{1F9D1}",
    gradient: "from-[#8B0000] to-[#C0392B]",
  },
  {
    quote:
      "\"Anak agent Legendary saya dari pasangan Zephyr x Nova laku 1.200 Diamond dalam 2 jam setelah listing. Gila.\"",
    name: "Dita S.",
    sub: "Breeder & Trader \u2022 Bandung",
    avatar: "\u{1F469}",
    gradient: "from-[#6B2D6B] to-[#C0392B]",
  },
  {
    quote:
      "\"Saya pakai mode Spectator - cukup follow beberapa couple favorit dan ikutin drama mereka. Hiburan terbaik tahun ini.\"",
    name: "Kevin R.",
    sub: "Spectator Mode \u2022 Surabaya",
    avatar: "\u{1F9D4}",
    gradient: "from-[#1A0A0E] to-[#8B0000]",
  },
];

export const STATS = [
  { num: "12", suffix: "K+", label: "Agent Aktif" },
  { num: "4", suffix: ".8K", label: "Pasangan Menikah" },
  { num: "2", suffix: ".1K", label: "Anak Agent di Market" },
  { num: "98", suffix: "%", label: "User Puas" },
];
