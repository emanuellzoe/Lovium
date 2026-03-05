"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import { TESTIMONIALS } from "@/lib/constants";

export default function Testimonials() {
  return (
    <div className="py-24 sm:py-[128px] overflow-hidden">
      <div className="section-inner text-center">
        <SectionHeader
          eyebrow="Dari Pengguna Lovium"
          title="Mereka sudah merasakannya"
          center
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 sm:mt-[68px]">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ borderColor: "rgba(192,57,43,0.2)" }}
              className="p-6 sm:p-8 bg-dark-card border border-white/5 rounded-2xl text-left transition-all duration-300"
            >
              <div className="text-gold text-xs mb-4">★★★★★</div>
              <div className="font-serif text-base sm:text-lg italic leading-relaxed text-white/80 mb-4 sm:mb-5">
                {t.quote}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg bg-gradient-to-br ${t.gradient}`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted">{t.sub}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
