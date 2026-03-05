import { SITE_NAME } from "@/lib/constants";

const FOOTER_LINKS = [
  { label: "Tentang", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "Marketplace", href: "#marketplace" },
  { label: "Blog", href: "#" },
];

export default function Footer() {
  return (
    <footer className="px-4 sm:px-6 md:px-[60px] py-10 sm:py-[72px] border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 text-center sm:text-left">
      <div className="font-serif text-xl sm:text-2xl font-bold text-white">
        {SITE_NAME.slice(0, -1)}
        <span className="text-crimson-glow">{SITE_NAME.slice(-1)}</span>
      </div>

      <div className="flex gap-6 sm:gap-10 flex-wrap justify-center">
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
