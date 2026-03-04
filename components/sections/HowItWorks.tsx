"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import { STEPS } from "@/lib/constants";

export default function HowItWorks() {
  return (
    <div id="cara-kerja" className="py-[120px] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
        <SectionHeader
          eyebrow="Cara Kerja"
          title={
            <>
              Sederhana seperti The Sims,
              <br />
              <em className="text-crimson-glow">Dalam di tiap langkahnya</em>
            </>
          }
          center
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 mt-20 relative">
          {/* Connection line */}
          <div className="absolute top-[60px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-crimson to-transparent opacity-30 hidden lg:block" />

          {STEPS.map((step, i) => (
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
              whileHover={{ y: -4, background: "rgba(192,57,43,0.08)" }}
              className="p-7 md:p-10 relative text-center bg-white/[0.02] border border-white/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-crimson flex items-center justify-center font-serif text-xl font-bold mx-auto mb-6 relative z-2 shadow-[0_0_0_8px_rgba(192,57,43,0.1)]">
                {i + 1}
              </div>
              <div className="text-[28px] mb-4">{step.icon}</div>
              <div className="font-serif text-[22px] font-semibold mb-2.5">
                {step.title}
              </div>
              <div className="text-sm text-muted leading-relaxed">
                {step.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
