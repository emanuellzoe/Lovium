"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import RarityBadge from "@/components/ui/RarityBadge";
import TraitTag from "@/components/ui/TraitTag";
import Button from "@/components/ui/Button";
import { MARKET_AGENTS } from "@/lib/constants";

export default function Marketplace() {
  return (
    <div
      id="marketplace"
      className="py-[120px] bg-gradient-to-b from-transparent via-[rgba(139,0,0,0.05)] to-transparent"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-[60px]">
        <SectionHeader
          eyebrow="Child Agent Marketplace"
          title={
            <>
              Koleksi, Jual, Beli
              <br />
              <em className="text-crimson-glow">Agent Paling Langka</em>
            </>
          }
          subtitle="Nilai anak agent ditentukan oleh rarity traits, generasi, dan reputasi parent mereka."
          center
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-[60px]">
          {MARKET_AGENTS.map((agent, i) => (
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
              whileHover={{
                y: -6,
                borderColor: "rgba(192,57,43,0.3)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              }}
              className="bg-dark-card border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300"
            >
              {/* Visual */}
              <div
                className={`h-[140px] flex items-center justify-center text-[56px] relative bg-gradient-to-br ${agent.gradient}`}
              >
                {agent.emoji}
                <span className="absolute top-3 right-3">
                  <RarityBadge rarity={agent.rarity} />
                </span>
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="text-[11px] text-muted mb-2">
                  {agent.parents}
                </div>
                <div className="font-serif text-[22px] font-bold mb-2">
                  {agent.name}
                </div>
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {agent.traits.map((t, j) => (
                    <TraitTag key={j}>{t}</TraitTag>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <div className="text-lg font-bold">
                      <span className="text-crimson-glow">💎</span>{" "}
                      {agent.price}
                    </div>
                    <div className="text-[11px] text-muted">{agent.gen}</div>
                  </div>
                  <motion.button
                    whileHover={{ backgroundColor: "#E74C3C" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-crimson text-white border-none px-4 py-2 rounded-md text-[13px] font-semibold cursor-pointer transition-all duration-200"
                  >
                    Beli
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Button variant="secondary">
            Lihat Semua Agent di Marketplace →
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
