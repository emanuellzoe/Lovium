type Rarity = "Legendary" | "Epic" | "Rare";

const rarityStyles: Record<Rarity, string> = {
  Legendary:
    "bg-[rgba(212,175,55,0.2)] text-gold-light border border-[rgba(212,175,55,0.3)]",
  Epic: "bg-[rgba(107,45,107,0.3)] text-[#D9A8FF] border border-[rgba(107,45,107,0.4)]",
  Rare: "bg-[rgba(192,57,43,0.2)] text-crimson-glow border border-[rgba(192,57,43,0.3)]",
};

export default function RarityBadge({ rarity }: { rarity: Rarity }) {
  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase ${rarityStyles[rarity]}`}
    >
      {rarity}
    </span>
  );
}
