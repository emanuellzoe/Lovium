"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import { FEATURES } from "@/lib/constants";

export default function Features() {
  return (
    <section id="fitur" className="py-24 sm:py-[128px]">
      <div className="section-inner">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-12 sm:mt-[68px] gap-4 lg:gap-[2px]">
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
              className="group relative overflow-hidden transition-all duration-300 hover:bg-[rgba(192,57,43,0.06)] hover:border-[rgba(192,57,43,0.2)] py-8 px-7 sm:py-10 sm:px-9"
              style={{
                background: "var(--dark-card)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {/* Top line glow */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-crimson to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <span className="block" style={{ fontSize: "36px", marginBottom: "20px" }}>{feat.icon}</span>
              <div className="font-serif font-semibold" style={{ fontSize: "24px", marginBottom: "12px" }}>
                {feat.title}
              </div>
              <div className="text-muted" style={{ fontSize: "14px", lineHeight: "1.7" }}>{feat.desc}</div>
              <span
                className="inline-block text-crimson-glow tracking-wider uppercase"
                style={{
                  marginTop: "16px",
                  fontSize: "11px",
                  fontWeight: 600,
                  background: "rgba(192,57,43,0.1)",
                  border: "1px solid rgba(192,57,43,0.2)",
                  padding: "4px 12px",
                  borderRadius: "100px",
                  letterSpacing: "1px",
                }}
              >
                {feat.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
