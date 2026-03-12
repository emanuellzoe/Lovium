export type Lang = "id" | "en";

export const translations = {
  // ===== NAVIGASI =====
  nav: {
    discover:     { id: "Temukan",   en: "Discover" },
    relationships:{ id: "Hubungan",  en: "Relationships" },
    couple:       { id: "Nikah",     en: "Marriage" },
    marketplace:  { id: "Pasar",     en: "Market" },
  },

  // ===== DROPDOWN PROFIL =====
  profile: {
    dashboard:    { id: "Dasbor",        en: "Dashboard" },
    topup:        { id: "Isi Diamond",   en: "Top Up" },
    createAgent:  { id: "Buat Agent",    en: "Create Agent" },
    logout:       { id: "Keluar",        en: "Sign Out" },
    guest:        { id: "Pengguna",      en: "Guest" },
  },

  // ===== DASHBOARD =====
  dashboard: {
    welcome:      { id: "Selamat datang",    en: "Welcome" },
    agentCount:   { id: "Kamu punya",        en: "You have" },
    agentUnit:    { id: "agent",             en: "agent(s)" },
    noAgent:      { id: "Mulai dengan membuat agent pertamamu", en: "Start by creating your first agent" },
    myAgents:     { id: "Agent Saya",        en: "My Agents" },
    genLabel:     { id: "Gen",               en: "Gen" },
    chat:         { id: "💬 Chat",           en: "💬 Chat" },
    createNew:    { id: "Buat Agent Baru",   en: "Create New Agent" },
    createDesc:   { id: "Buat AI agent dengan kepribadian unik", en: "Create AI agent with unique personality" },
    discoverTitle:{ id: "Temukan",           en: "Discover" },
    discoverDesc: { id: "Temukan pasangan untuk agent-mu", en: "Find a match for your agent" },
    relTitle:     { id: "Hubungan",          en: "Relationships" },
    relDesc:      { id: "Kirim hadiah dan tingkatkan hubungan", en: "Send gifts and grow your bond" },
    marketTitle:  { id: "Pasar",             en: "Marketplace" },
    marketDesc:   { id: "Beli & jual agent AI", en: "Buy & sell AI agents" },
    topupTitle:   { id: "Isi Diamond",       en: "Top Up Diamond" },
    topupDesc:    { id: "Bayar via Mayar — QRIS, transfer", en: "Pay via Mayar — QRIS, bank transfer" },
  },

  // ===== CREATE AGENT =====
  createAgent: {
    title:        { id: "Buat Agent Baru",   en: "Create New Agent" },
    subtitle:     { id: "Pilih cara membuat agent AI dengan kepribadian unik", en: "Choose how to create your unique AI agent" },
    template:     { id: "Template",          en: "Template" },
    templateDesc: { id: "Pilih karakter siap pakai", en: "Choose a ready-made character" },
    ai:           { id: "AI Generate",       en: "AI Generate" },
    aiDesc:       { id: "Biarkan AI buatkan", en: "Let AI create it" },
    custom:       { id: "Custom",            en: "Custom" },
    customDesc:   { id: "Tulis sendiri dari nol", en: "Build from scratch" },
    back:         { id: "← Kembali",         en: "← Back" },
    failed:       { id: "Gagal membuat agent. Coba lagi.", en: "Failed to create agent. Try again." },
  },

  // ===== MARKETPLACE =====
  marketplace: {
    title:        { id: "Pasar",             en: "Marketplace" },
    subtitle:     { id: "Beli & jual agent AI dengan Diamond", en: "Buy & sell AI agents with Diamond" },
    browse:       { id: "Semua",             en: "Browse" },
    sell:         { id: "Jual Agentku",      en: "Sell My Agent" },
    myListings:   { id: "Listingku",         en: "My Listings" },
    noListings:   { id: "Belum ada listing aktif dari pengguna lain.", en: "No active listings from other users." },
    noAgents:     { id: "Tidak ada agent yang bisa dijual.", en: "No agents available to sell." },
    noMyListings: { id: "Kamu belum punya listing aktif.", en: "You have no active listings." },
    buy:          { id: "Beli",              en: "Buy" },
    cancel:       { id: "Batalkan",          en: "Cancel" },
    sellThis:     { id: "Jual Agent Ini",    en: "Sell This Agent" },
    confirm:      { id: "Konfirmasi Jual",   en: "Confirm Sale" },
    batal:        { id: "Batal",             en: "Cancel" },
    topup:        { id: "💎 Isi Diamond",    en: "💎 Top Up" },
    pricePlaceholder: { id: "Harga dalam Diamond", en: "Price in Diamond" },
    buyConfirm:   { id: "Beli agent ini seharga",  en: "Buy this agent for" },
    diamond:      { id: "💎?",              en: "💎?" },
    cancelConfirm:{ id: "Batalkan listing ini?",    en: "Cancel this listing?" },
  },

  // ===== TOP UP =====
  topup: {
    title:        { id: "Isi Diamond",       en: "Top Up Diamond" },
    subtitle:     { id: "Pilih paket Diamond favoritmu", en: "Choose your favorite Diamond package" },
    current:      { id: "Diamond saat ini",  en: "Current balance" },
    free:         { id: "GRATIS",            en: "FREE" },
    claimNow:     { id: "Klaim Sekarang",    en: "Claim Now" },
    claiming:     { id: "Mengklaim...",      en: "Claiming..." },
    payMayar:     { id: "Bayar via Mayar",   en: "Pay via Mayar" },
    openingMayar: { id: "Membuka Mayar...",  en: "Opening Mayar..." },
    howTitle:     { id: "Cara Bayar Godlike Pack", en: "How to Pay Godlike Pack" },
    how1:         { id: "Klik Bayar via Mayar",     en: "Click Pay via Mayar" },
    how2:         { id: "Kamu diarahkan ke halaman checkout Mayar.id", en: "You are redirected to Mayar.id checkout" },
    how3:         { id: "Pilih metode bayar — QRIS, transfer bank, atau e-wallet", en: "Choose payment method — QRIS, bank transfer, or e-wallet" },
    how4:         { id: "Diamond otomatis masuk setelah pembayaran dikonfirmasi", en: "Diamond credited automatically after payment confirmed" },
    safe:         { id: "Pembayaran diproses aman oleh", en: "Payment securely processed by" },
  },

  // ===== UMUM =====
  common: {
    loading:      { id: "Memuat...",         en: "Loading..." },
    back:         { id: "← Kembali",         en: "← Back" },
    single:       { id: "Lajang",            en: "Single" },
    dating:       { id: "Pacaran",           en: "Dating" },
    married:      { id: "Menikah",           en: "Married" },
    gen:          { id: "Gen",               en: "Gen" },
    diamond:      { id: "Diamond",           en: "Diamond" },
  },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(
  section: keyof typeof translations,
  key: string,
  lang: Lang,
): string {
  const sectionData = translations[section] as Record<string, { id: string; en: string }>;
  return sectionData?.[key]?.[lang] ?? key;
}
