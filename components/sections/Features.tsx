"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import { FEATURES } from "@/lib/constants";

export default function Features() {
  return (
    <section id="fitur" className="py-[120px] max-w-[1200px] mx-auto px-6 md:px-[60px]">
      <SectionHeader
        eyebrow="Fitur Unggulan"
        title={
          <>
            Semua yang kamu butuhkan
            <br />
            untuk Love Economy
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5 mt-[60px]">
        {FEATURES.map((feat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.7,
              delay: (i % 3) * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="group p-7 md:p-9 bg-dark-card border border-white/5 transition-all duration-300 relative overflow-hidden hover:bg-[rgba(192,57,43,0.06)] hover:border-[rgba(192,57,43,0.2)]"
          >
            {/* Top line glow */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-crimson to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <span className="text-4xl mb-5 block">{feat.icon}</span>
            <div className="font-serif text-2xl font-semibold mb-3">
              {feat.title}
            </div>
            <div className="text-sm text-muted leading-[1.7]">{feat.desc}</div>
            <span className="inline-block mt-4 text-[11px] font-semibold text-crimson-glow bg-[rgba(192,57,43,0.1)] border border-[rgba(192,57,43,0.2)] px-3 py-1 rounded-full tracking-wider uppercase">
              {feat.tag}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
