"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE_NAME } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "Fitur", href: "#fitur" },
  { label: "Marketplace", href: "#marketplace" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-6 md:px-[60px] transition-all duration-400 ${
        scrolled
          ? "py-3.5 bg-[rgba(13,6,8,0.92)] backdrop-blur-[20px] border-b border-[rgba(192,57,43,0.2)]"
          : "py-5"
      }`}
    >
      <a
        href="#"
        className="font-serif text-[28px] font-bold text-white tracking-[2px] no-underline"
      >
        {SITE_NAME.split("").map((char, i) =>
          i === 0 ? (
            <span key={i} className="text-crimson-glow">
              {char}
            </span>
          ) : (
            <span key={i}>{char}</span>
          )
        )}
      </a>

      {/* Desktop */}
      <ul className="hidden md:flex items-center gap-10 list-none">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-muted no-underline text-sm font-medium tracking-[0.5px] hover:text-white transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
        <li>
          <motion.a
            href="#"
            className="bg-crimson text-white px-6 py-2.5 rounded-md text-sm font-semibold no-underline"
            whileHover={{ backgroundColor: "#E74C3C", y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            Mulai Gratis
          </motion.a>
        </li>
      </ul>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden text-white text-2xl bg-transparent border-none"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[rgba(13,6,8,0.97)] backdrop-blur-[20px] border-b border-[rgba(192,57,43,0.2)] md:hidden"
          >
            <ul className="flex flex-col items-center gap-6 py-8 list-none">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-muted no-underline text-base font-medium hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#"
                  className="bg-crimson text-white px-6 py-2.5 rounded-md text-sm font-semibold no-underline"
                >
                  Mulai Gratis
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
