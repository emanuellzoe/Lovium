"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  center = false,
}: SectionHeaderProps) {
  return (
    <motion.div
      className={center ? "text-center" : ""}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="text-[10px] sm:text-[11px] font-semibold text-crimson-glow tracking-[2px] sm:tracking-[3px] uppercase mb-4 sm:mb-5">
        ✦ {eyebrow}
      </div>
      <h2 className="font-serif text-[clamp(32px,5vw,64px)] sm:text-[clamp(36px,5vw,64px)] font-bold leading-[1.1] mb-5 sm:mb-6">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-sm sm:text-base text-muted max-w-[520px] leading-[1.6] sm:leading-[1.7] font-light ${
            center ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
