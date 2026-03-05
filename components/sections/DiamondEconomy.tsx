"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import { GIFTS, DIAMOND_PACKAGES, SITE_NAME } from "@/lib/constants";

export default function DiamondEconomy() {
  return (
    <div className="py-24 sm:py-[128px]">
      <div className="section-inner">
        <SectionHeader
          eyebrow="Diamond Economy"
          title={
            <>
              Satu mata uang,
              <br />
              <em className="text-crimson-glow">Seribu cara pakai</em>
            </>
          }
          subtitle="Top-up Diamond, pakai sesuai kebutuhanmu. Tidak ada kerumitan, tidak ada crypto."
          center
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[72px] items-center mt-12 sm:mt-[68px]">
          {/* Diamond Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center relative"
          >
            <div className="absolute w-[140px] h-[140px] sm:w-[200px] sm:h-[200px] bg-[radial-gradient(circle,rgba(192,57,43,0.3),transparent)] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[pulse_3s_ease-in-out_infinite]" />
            <span className="text-[80px] sm:text-[100px] md:text-[120px] block animate-[diamondFloat_4s_ease-in-out_infinite] drop-shadow-[0_0_40px_rgba(192,57,43,0.5)]">
              💎
            </span>
            <div className="mt-5">
              <div className="font-serif text-2xl sm:text-[32px] font-bold">Diamond</div>
              <div className="text-sm text-muted mt-1">
                Mata uang resmi {SITE_NAME}
              </div>
            </div>

            {/* Pricing Packages */}
            <div className="flex gap-4 justify-center mt-10 flex-wrap">
              {DIAMOND_PACKAGES.map((pkg, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4 }}
                  className={`rounded-[10px] p-3.5 px-5 text-center relative ${
                    pkg.popular
                      ? "bg-[rgba(192,57,43,0.15)] border border-[rgba(192,57,43,0.3)]"
                      : pkg.gold
                        ? "bg-dark-card border border-[rgba(212,175,55,0.2)]"
                        : "bg-dark-card border border-white/8"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-crimson text-[10px] font-bold px-2.5 py-0.5 rounded whitespace-nowrap">
                      POPULER
                    </div>
                  )}
                  <div className="text-[13px] text-muted">{pkg.label}</div>
                  <div
                    className={`text-[22px] font-bold ${pkg.gold ? "text-gold-light" : "text-crimson-glow"}`}
                  >
                    {pkg.amount}
                  </div>
                  <div className="text-xs text-muted mt-0.5">{pkg.price}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Gift Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="font-serif text-xl sm:text-[28px] font-semibold mb-2">
              Pakai Diamond untuk:
            </h3>
            <p className="text-sm text-muted mb-7">
              Dari hadiah romantis hingga agent langka
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GIFTS.map((gift, i) => (
                <motion.div
                  key={i}
                  whileHover={{
                    borderColor: "rgba(192,57,43,0.3)",
                    background: "rgba(192,57,43,0.06)",
                  }}
                  className="flex items-center gap-3.5 p-4 sm:px-5 bg-dark-card border border-white/5 rounded-xl transition-all duration-300"
                >
                  <span className="text-2xl">{gift.emoji}</span>
                  <div>
                    <div className="text-[13px] font-semibold">{gift.name}</div>
                    <div className="text-xs text-crimson-glow mt-0.5">
                      {gift.price}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
