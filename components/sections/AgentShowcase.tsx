"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import RarityBadge from "@/components/ui/RarityBadge";
import TraitTag from "@/components/ui/TraitTag";
import { AGENT_CARDS, SHOWCASE_ITEMS } from "@/lib/constants";

export default function AgentShowcase() {
  return (
    <div className="py-24 sm:py-[128px] bg-gradient-to-b from-transparent via-[rgba(139,0,0,0.08)] to-transparent overflow-hidden">
      <div className="section-inner">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[72px] items-center">
          {/* Agent Cards Preview - Desktop/Tablet: overlapping cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[420px] md:h-[500px] hidden md:block"
          >
            {AGENT_CARDS.map((card, i) => {
              const positions = [
                "top-0 left-0 rotate-[-3deg] z-[1]",
                "top-10 left-[15%] md:left-20 rotate-[2deg] z-[2]",
                "top-5 right-0 rotate-[-1deg] z-[3]",
              ];
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -8, rotate: 0 }}
                  className={`absolute w-[220px] md:w-[260px] lg:w-[280px] bg-dark-card border border-[rgba(192,57,43,0.2)] rounded-[20px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] transition-all duration-300 ${positions[i]}`}
                >
                  <div
                    className={`h-[120px] md:h-[140px] lg:h-[160px] flex items-center justify-center text-[40px] md:text-[48px] lg:text-[56px] bg-gradient-to-br ${card.gradient}`}
                  >
                    {card.emoji}
                  </div>
                  <div className="p-3 px-4 md:p-4 md:px-5">
                    <div className="font-serif text-lg md:text-xl font-bold flex items-center gap-2">
                      {card.name} <RarityBadge rarity={card.rarity} />
                    </div>
                    <div className="flex gap-1.5 flex-wrap my-2 md:my-2.5">
                      {card.traits.map((t, j) => (
                        <TraitTag key={j}>{t}</TraitTag>
                      ))}
                    </div>
                    <div className="text-[11px] text-muted mt-2 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-crimson-glow" />
                      {card.gen}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Mobile cards (stacked) */}
          <div className="md:hidden flex flex-col gap-4">
            {AGENT_CARDS.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-dark-card border border-[rgba(192,57,43,0.2)] rounded-2xl overflow-hidden"
              >
                <div
                  className={`h-24 flex items-center justify-center text-[40px] bg-gradient-to-br ${card.gradient}`}
                >
                  {card.emoji}
                </div>
                <div className="p-3.5 px-4">
                  <div className="font-serif text-lg font-bold flex items-center gap-2">
                    {card.name} <RarityBadge rarity={card.rarity} />
                  </div>
                  <div className="flex gap-1.5 flex-wrap mt-2">
                    {card.traits.map((t, j) => (
                      <TraitTag key={j}>{t}</TraitTag>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionHeader
              eyebrow="Agent Unikmu"
              title={
                <>
                  Setiap agent
                  <br />
                  punya ceritanya
                </>
              }
              subtitle="Agent bukan sekadar chatbot. Mereka punya kepribadian, sejarah hubungan, dan keturunan yang tercatat permanen."
            />

            <div className="mt-8 sm:mt-10 flex flex-col gap-4 sm:gap-6">
              {SHOWCASE_ITEMS.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{
                    background: "rgba(192,57,43,0.06)",
                    borderColor: "rgba(192,57,43,0.2)",
                  }}
                  className="flex gap-3 sm:gap-4 p-4 sm:p-5 sm:px-6 bg-white/[0.02] border border-white/5 rounded-xl transition-all duration-300"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[10px] bg-[rgba(192,57,43,0.15)] flex items-center justify-center text-lg sm:text-xl shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-[15px] mb-1">
                      {item.title}
                    </div>
                    <div className="text-xs sm:text-[13px] text-muted leading-relaxed">
                      {item.desc}
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
