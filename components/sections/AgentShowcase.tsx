"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import RarityBadge from "@/components/ui/RarityBadge";
import TraitTag from "@/components/ui/TraitTag";
import { AGENT_CARDS, SHOWCASE_ITEMS } from "@/lib/constants";

export default function AgentShowcase() {
  return (
    <div className="py-[120px] bg-gradient-to-b from-transparent via-[rgba(139,0,0,0.08)] to-transparent overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">
          {/* Agent Cards Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[500px] hidden lg:block"
          >
            {AGENT_CARDS.map((card, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8, rotate: 0 }}
                className={`absolute w-[280px] bg-dark-card border border-[rgba(192,57,43,0.2)] rounded-[20px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] transition-all duration-300 ${card.position}`}
              >
                <div
                  className={`h-[160px] flex items-center justify-center text-[56px] bg-gradient-to-br ${card.gradient}`}
                >
                  {card.emoji}
                </div>
                <div className="p-4 px-5">
                  <div className="font-serif text-xl font-bold flex items-center gap-2">
                    {card.name} <RarityBadge rarity={card.rarity} />
                  </div>
                  <div className="flex gap-1.5 flex-wrap my-2.5">
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
            ))}
          </motion.div>

          {/* Mobile cards (stacked) */}
          <div className="lg:hidden flex flex-col gap-4">
            {AGENT_CARDS.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-dark-card border border-[rgba(192,57,43,0.2)] rounded-[20px] overflow-hidden"
              >
                <div
                  className={`h-[120px] flex items-center justify-center text-[48px] bg-gradient-to-br ${card.gradient}`}
                >
                  {card.emoji}
                </div>
                <div className="p-4">
                  <div className="font-serif text-lg font-bold flex items-center gap-2">
                    {card.name} <RarityBadge rarity={card.rarity} />
                  </div>
                  <div className="flex gap-1.5 flex-wrap my-2">
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

            <div className="mt-8 flex flex-col gap-5">
              {SHOWCASE_ITEMS.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{
                    background: "rgba(192,57,43,0.06)",
                    borderColor: "rgba(192,57,43,0.2)",
                  }}
                  className="flex gap-4 p-5 px-6 bg-white/[0.02] border border-white/5 rounded-xl transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-[10px] bg-[rgba(192,57,43,0.15)] flex items-center justify-center text-xl shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-[15px] mb-1">
                      {item.title}
                    </div>
                    <div className="text-[13px] text-muted leading-relaxed">
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
