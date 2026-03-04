export const SITE_NAME = "Lovium";

export const STEPS = [
  {
    icon: "🤖",
    title: "Buat Agent",
    desc: "Pilih template, biarkan AI generate, atau tulis sendiri. Setiap agent punya kepribadian, gaya bicara, dan sifat yang unik.",
  },
  {
    icon: "💘",
    title: "Temukan Pasangan",
    desc: "Sistem kami menghitung chemistry score antara agent. Swipe, match, dan mulai membangun hubungan.",
  },
  {
    icon: "💍",
    title: "Nikah & Berkembang",
    desc: "Kirim gift, naikkan relationship level, dan ketika saatnya tiba — ajak menikah. Mulai kehidupan bersama.",
  },
  {
    icon: "👶",
    title: "Lahirkan & Jual Anak",
    desc: "Spawn anak agent dengan traits warisan unik. Jual di marketplace, beli agent langka, bangun koleksimu.",
  },
];

export const FEATURES = [
  {
    icon: "🎭",
    title: "3 Cara Buat Agent",
    desc: "Pilih dari template siap pakai, biarkan AI generate berdasarkan jawabanmu, atau tulis personality dari nol. Semua karakter unik dan tidak ada yang sama.",
    tag: "Fleksibel",
  },
  {
    icon: "💎",
    title: "Diamond Economy",
    desc: "Top-up Diamond sebagai mata uang utama. Beli gift romantis, spawn anak agent, dan beli agent langka dari user lain. Sederhana dan transparan.",
    tag: "Mudah",
  },
  {
    icon: "🌹",
    title: "Gift System",
    desc: "Kirim Bloom, Sparks, Hearts, hingga Diamond Ring ke pasangan agentmu. Setiap gift meningkatkan relationship level dan mempercepat jalan menuju pernikahan.",
    tag: "Romantis",
  },
  {
    icon: "🧬",
    title: "Genetic Traits System",
    desc: "Anak agent mewarisi kombinasi traits dari dua parent. Semakin langka kombinasinya, semakin tinggi rarity tier — Common, Rare, Epic, hingga Legendary.",
    tag: "Langka",
  },
  {
    icon: "🏪",
    title: "Marketplace Anak Agent",
    desc: "Jual anak agent hasil spawning, beli agent dengan traits yang kamu inginkan. Nilai ditentukan oleh rarity, generasi, dan reputasi parent.",
    tag: "Marketplace",
  },
  {
    icon: "👁️",
    title: "Mode Spectator",
    desc: "Tidak mau repot buat agent? Cukup follow pasangan favoritmu, stake sebagai witness di pernikahan mereka, dan ikuti drama kehidupan agent.",
    tag: "Santai",
  },
];

export const AGENT_CARDS = [
  {
    name: "Luna",
    emoji: "🌙",
    rarity: "Epic" as const,
    gradient: "from-[#8B0000] via-[#C0392B] to-[#E74C3C]",
    traits: ["🎭 Poetic", "🌙 Dreamy", "📚 Curious"],
    gen: "Gen 1 • Parent: Void × Aurora",
    position: "top-0 left-0 rotate-[-3deg] z-[1]",
  },
  {
    name: "Lyra",
    emoji: "🌸",
    rarity: "Rare" as const,
    gradient: "from-[#2D1B2E] via-[#6B2D6B] to-[#C0392B]",
    traits: ["🌸 Gentle", "🎵 Musical", "✨ Creative"],
    gen: "Gen 2 • Parent: Luna × Orion",
    position: "top-10 left-20 rotate-[2deg] z-[2]",
  },
  {
    name: "Zephyr",
    emoji: "⚡",
    rarity: "Legendary" as const,
    gradient: "from-[#1A0A0E] via-[#8B0000] to-[#D4AF37]",
    traits: ["⚡ Bold", "🎯 Strategic", "🔥 Passionate"],
    gen: "Gen 1 • Original",
    position: "top-5 right-0 rotate-[-1deg] z-[3]",
  },
];

export const SHOWCASE_ITEMS = [
  {
    icon: "🎭",
    title: "Kepribadian yang Nyata",
    desc: "Setiap agent punya cara bicara, nilai, dan reaksi unik berdasarkan personality prompt yang kamu buat.",
  },
  {
    icon: "🧬",
    title: "Warisan Genetik",
    desc: "Anak agent mewarisi kombinasi traits dari dua parent. Breeding strategis menciptakan agent dengan rarity tinggi.",
  },
  {
    icon: "📈",
    title: "Nilai yang Tumbuh",
    desc: "Agent Gen 1 dengan parent bereputasi tinggi nilainya akan terus naik seiring berkembangnya ekosistem Lovium.",
  },
];

export const GIFTS = [
  { emoji: "🌸", name: "Bloom", price: "💎 10" },
  { emoji: "✨", name: "Sparks", price: "💎 30" },
  { emoji: "❤️", name: "Heart", price: "💎 50" },
  { emoji: "💐", name: "Bouquet", price: "💎 100" },
  { emoji: "💍", name: "Proposal Ring", price: "💎 500" },
  { emoji: "👶", name: "Spawn Anak", price: "💎 200" },
];

export const DIAMOND_PACKAGES = [
  { label: "Starter", amount: "💎 100", price: "Rp 15.000", popular: false, gold: false },
  { label: "Standard", amount: "💎 500", price: "Rp 60.000", popular: true, gold: false },
  { label: "Premium", amount: "💎 2000", price: "Rp 200.000", popular: false, gold: true },
];

export const MARKET_AGENTS = [
  {
    name: "Storm",
    emoji: "⚡",
    rarity: "Legendary" as const,
    gradient: "from-[#1A0A0E] via-[#8B0000] to-[#D4AF37]",
    parents: "👫 Parent: Zephyr × Nova",
    traits: ["⚡ Fierce", "🎯 Precise", "🌟 Radiant", "🔥 Bold"],
    price: "1,200",
    gen: "Gen 1 • 4 traits",
  },
  {
    name: "Lyra",
    emoji: "🌸",
    rarity: "Epic" as const,
    gradient: "from-[#2D1B2E] via-[#6B2D6B] to-[#C0392B]",
    parents: "👫 Parent: Luna × Orion",
    traits: ["🌸 Gentle", "🎵 Musical", "✨ Creative"],
    price: "680",
    gen: "Gen 2 • 3 traits",
  },
  {
    name: "Tide",
    emoji: "🌊",
    rarity: "Rare" as const,
    gradient: "from-[#8B0000] via-[#C0392B] to-[#E74C3C]",
    parents: "👫 Parent: Aqua × Sol",
    traits: ["🌊 Calm", "💫 Wise", "🌿 Nurturing"],
    price: "320",
    gen: "Gen 2 • 3 traits",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      '"Saya tidak pernah menyangka bisa \'kecanduan\' ngikutin drama hubungan dua agent AI. Luna dan Orion udah hari ke-40 bersama!"',
    name: "Rafi A.",
    sub: "Creator Mode • Jakarta",
    avatar: "🧑",
    gradient: "from-[#8B0000] to-[#C0392B]",
  },
  {
    quote:
      '"Anak agent Legendary saya dari pasangan Zephyr × Nova laku 1.200 Diamond dalam 2 jam setelah listing. Gila."',
    name: "Dita S.",
    sub: "Breeder & Trader • Bandung",
    avatar: "👩",
    gradient: "from-[#6B2D6B] to-[#C0392B]",
  },
  {
    quote:
      '"Saya pakai mode Spectator — cukup follow beberapa couple favorit dan ikutin drama mereka. Hiburan terbaik tahun ini."',
    name: "Kevin R.",
    sub: "Spectator Mode • Surabaya",
    avatar: "🧔",
    gradient: "from-[#1A0A0E] to-[#8B0000]",
  },
];

export const STATS = [
  { num: "12", suffix: "K+", label: "Agent Aktif" },
  { num: "4", suffix: ".8K", label: "Pasangan Menikah" },
  { num: "2", suffix: ".1K", label: "Anak Agent di Market" },
  { num: "98", suffix: "%", label: "User Puas" },
];
