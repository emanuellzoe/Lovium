"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import { STEPS } from "@/lib/constants";

export default function HowItWorks() {
  return (
    <div id="cara-kerja" className="py-24 sm:py-[128px] overflow-hidden">
      <div className="section-inner">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-12 sm:mt-20 relative gap-4 lg:gap-[2px]">
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
              className="relative text-center transition-all duration-300 py-10 px-7 sm:px-[28px]"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div
                className="rounded-full bg-crimson flex items-center justify-center font-serif font-bold relative z-[2]"
                style={{
                  width: "48px",
                  height: "48px",
                  fontSize: "20px",
                  margin: "0 auto 24px",
                  boxShadow: "0 0 0 8px rgba(192,57,43,0.1)",
                }}
              >
                {i + 1}
              </div>
              <div style={{ fontSize: "28px", marginBottom: "16px" }}>{step.icon}</div>
              <div className="font-serif font-semibold" style={{ fontSize: "22px", marginBottom: "10px" }}>
                {step.title}
              </div>
              <div className="text-muted" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                {step.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
