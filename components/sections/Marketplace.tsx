"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import RarityBadge from "@/components/ui/RarityBadge";
import TraitTag from "@/components/ui/TraitTag";
import Button from "@/components/ui/Button";
import { MARKET_AGENTS } from "@/lib/constants";

const ITEMS_PER_PAGE = 3;

export default function Marketplace() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(MARKET_AGENTS.length / ITEMS_PER_PAGE);

  const currentAgents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return MARKET_AGENTS.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage]);

  const goToPage = (nextPage: number) => {
    const safePage = Math.max(1, Math.min(totalPages, nextPage));
    setCurrentPage(safePage);
  };

  return (
    <div
      id="marketplace"
      className="market-section py-24 sm:py-[128px] bg-gradient-to-b from-transparent via-[rgba(139,0,0,0.05)] to-transparent"
    >
      <div className="section-inner">
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

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="market-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 sm:mt-[68px]"
          >
            {currentAgents.map((agent, i) => (
              <motion.div
                key={`${agent.name}-${i}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{
                  y: -6,
                  borderColor: "rgba(192,57,43,0.3)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                }}
                className="market-card bg-dark-card border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300"
              >
                <div
                  className={`h-[120px] sm:h-[140px] flex items-center justify-center text-[44px] sm:text-[56px] relative bg-gradient-to-br ${agent.gradient}`}
                >
                  {agent.emoji}
                  <span className="absolute top-3 right-3">
                    <RarityBadge rarity={agent.rarity} />
                  </span>
                </div>

                <div className="p-6">
                  <div className="text-[11px] text-muted mb-2">{agent.parents}</div>
                  <div className="font-serif text-[22px] font-bold mb-2">{agent.name}</div>
                  <div className="flex gap-1.5 flex-wrap mb-5">
                    {agent.traits.map((trait, j) => (
                      <TraitTag key={j}>{trait}</TraitTag>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-white/5">
                    <div>
                      <div className="text-lg font-bold">
                        <span className="text-crimson-glow">💎</span> {agent.price}
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
          </motion.div>
        </AnimatePresence>

        {totalPages > 1 && (
          <div className="mt-10 sm:mt-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2.5 flex-wrap justify-center">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md text-sm border border-white/10 text-muted enabled:hover:text-white enabled:hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>

              {Array.from({ length: totalPages }, (_, idx) => {
                const page = idx + 1;
                const active = page === currentPage;

                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`min-w-9 h-9 px-3 rounded-md text-sm font-semibold border transition-colors ${
                      active
                        ? "bg-crimson text-white border-crimson"
                        : "text-muted border-white/10 hover:text-white hover:border-white/30"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md text-sm border border-white/10 text-muted enabled:hover:text-white enabled:hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Berikutnya
              </button>
            </div>

            <p className="text-xs text-muted">
              Halaman {currentPage} dari {totalPages}
            </p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mt-10 sm:mt-12"
        >
          <Button variant="secondary">Lihat Semua Agent di Marketplace -&gt;</Button>
        </motion.div>
      </div>
    </div>
  );
}
