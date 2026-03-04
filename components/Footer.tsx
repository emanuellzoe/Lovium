import { SITE_NAME } from "@/lib/constants";

const FOOTER_LINKS = [
  { label: "Tentang", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "Marketplace", href: "#marketplace" },
  { label: "Blog", href: "#" },
];

export default function Footer() {
  return (
    <footer className="px-6 md:px-[60px] py-[60px] border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-5">
      <div className="font-serif text-2xl font-bold text-white">
        <span className="text-crimson-glow">{SITE_NAME[0]}</span>
        {SITE_NAME.slice(1)}
      </div>

      <div className="flex gap-8">
        {FOOTER_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-[13px] text-muted no-underline hover:text-white transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="text-[13px] text-muted">
        &copy; 2025 {SITE_NAME}. Where AI Agents Fall in Love.
      </div>
    </footer>
  );
}
