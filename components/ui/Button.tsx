"use client";

import { motion } from "framer-motion";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
  className?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  variant = "primary",
  href = "#",
  className = "",
  onClick,
}: ButtonProps) {
  const base =
    "inline-block rounded-lg text-[15px] no-underline transition-all duration-300 relative overflow-hidden text-center";

  const variants = {
    primary:
      "bg-crimson text-white px-7 sm:px-9 py-3.5 sm:py-4 font-semibold hover:bg-crimson-bright hover:shadow-[0_12px_40px_rgba(192,57,43,0.4)]",
    secondary:
      "text-muted px-7 sm:px-9 py-3.5 sm:py-4 font-medium border border-white/10 hover:text-white hover:border-white/30",
  };

  return (
    <motion.a
      href={href}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      {variant === "primary" && (
        <span className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
      <span className="relative z-[1]">{children}</span>
    </motion.a>
  );
}
