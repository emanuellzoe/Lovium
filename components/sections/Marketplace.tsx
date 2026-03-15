"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import TraitTag from "@/components/ui/TraitTag";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import type { Rarity } from "@/types/agent";

const ITEMS_PER_PAGE = 3;

interface ListingAgent {
  id: string;
  name: string;
  traits: string[];
  avatar_emoji: string;
  rarity: Rarity;
  generation: number;
}

interface ListingSeller {
  id: string;
  username: string | null;
}

interface MarketplaceListing {
  id: string;
  price_diamond: number;
  status: string;
  agent: ListingAgent;
  seller: ListingSeller | null;
}

const CARD_GRADIENT: Record<Rarity, string> = {
  common: "from-neutral-700/60 to-neutral-800/60",
  rare: "from-red-700/60 to-red-900/50",
  epic: "from-fuchsia-700/50 to-purple-900/50",
  legendary: "from-yellow-500/40 to-amber-700/40",
};

const RARITY_BADGE_STYLE: Record<Rarity, string> = {
  common: "bg-white/10 text-white/80 border border-white/20",
  rare: "bg-red-500/20 text-red-300 border border-red-400/30",
  epic: "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/30",
  legendary: "bg-yellow-500/20 text-yellow-200 border border-yellow-400/30",
};

function normalizeListings(raw: unknown): MarketplaceListing[] {
  if (!Array.isArray(raw)) return [];

  const normalized: Array<MarketplaceListing | null> = raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const listing = item as Partial<MarketplaceListing> & {
        agent?: Partial<ListingAgent> | null;
        seller?: Partial<ListingSeller> | null;
      };

      if (typeof listing.id !== "string") return null;
      if (listing.status !== "active") return null;
      if (!listing.agent || typeof listing.agent !== "object") return null;

      const rarityValue = listing.agent.rarity;
      const rarity: Rarity =
        rarityValue === "legendary" ||
        rarityValue === "epic" ||
        rarityValue === "rare" ||
        rarityValue === "common"
          ? rarityValue
          : "common";

      return {
        id: listing.id,
        status: "active",
        price_diamond:
          typeof listing.price_diamond === "number" ? listing.price_diamond : 0,
        agent: {
          id: typeof listing.agent.id === "string" ? listing.agent.id : "",
          name:
            typeof listing.agent.name === "string"
              ? listing.agent.name
              : "Unknown Agent",
          traits: Array.isArray(listing.agent.traits)
            ? listing.agent.traits.filter(
                (trait): trait is string => typeof trait === "string",
              )
            : [],
          avatar_emoji:
            typeof listing.agent.avatar_emoji === "string"
              ? listing.agent.avatar_emoji
              : "??",
          rarity,
          generation:
            typeof listing.agent.generation === "number"
              ? listing.agent.generation
              : 1,
        },
        seller:
          listing.seller && typeof listing.seller === "object"
            ? {
                id: typeof listing.seller.id === "string" ? listing.seller.id : "",
                username:
                  typeof listing.seller.username === "string"
                    ? listing.seller.username
                    : null,
              }
            : null,
      };
    });

  return normalized.filter(
    (listing): listing is MarketplaceListing =>
      listing !== null && listing.price_diamond > 0 && listing.agent.id.length > 0,
  );
}

export default function Marketplace() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadMarketplace() {
      try {
        const supabase = createClient();
        const [{ data: { user } }, res] = await Promise.all([
          supabase.auth.getUser(),
          fetch("/api/marketplace", { cache: "no-store" }),
        ]);

        if (!active) return;
        setIsLoggedIn(Boolean(user));

        if (!res.ok) {
          setListings([]);
          return;
        }

        const payload: { listings?: unknown } = await res.json();
        if (!active) return;
        setListings(normalizeListings(payload.listings));
      } catch {
        if (active) setListings([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMarketplace();
    return () => {
      active = false;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(listings.length / ITEMS_PER_PAGE));
  const buyHref = isLoggedIn ? "/marketplace" : "/login?next=/marketplace";

  const currentAgents = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return listings.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, listings, totalPages]);

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
            {loading ? (
              Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="market-card bg-dark-card border border-white/[0.06] rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="h-[120px] sm:h-[140px] bg-white/5" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                    <div className="h-6 bg-white/10 rounded w-2/3" />
                    <div className="h-3 bg-white/10 rounded w-full" />
                    <div className="h-3 bg-white/10 rounded w-5/6" />
                  </div>
                </div>
              ))
            ) : currentAgents.length === 0 ? (
              <div className="col-span-full text-center py-14 text-muted text-sm border border-white/10 rounded-2xl bg-dark-card/60">
                Belum ada agent yang sedang dilisting di marketplace.
              </div>
            ) : (
              currentAgents.map((listing, i) => (
                <motion.div
                  key={listing.id}
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
                    className={`h-[120px] sm:h-[140px] flex items-center justify-center text-[44px] sm:text-[56px] relative bg-gradient-to-br ${CARD_GRADIENT[listing.agent.rarity]}`}
                  >
                    {listing.agent.avatar_emoji}
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase ${RARITY_BADGE_STYLE[listing.agent.rarity]}`}
                    >
                      {listing.agent.rarity}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="text-[11px] text-muted mb-2">
                      Listed by @{listing.seller?.username ?? "unknown"}
                    </div>
                    <div className="font-serif text-[22px] font-bold mb-2">
                      {listing.agent.name}
                    </div>
                    <div className="flex gap-1.5 flex-wrap mb-5">
                      {listing.agent.traits.slice(0, 3).map((trait) => (
                        <TraitTag key={trait}>{trait}</TraitTag>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-5 border-t border-white/5">
                      <div>
                        <div className="text-lg font-bold">
                          <span className="text-crimson-glow">??</span>{" "}
                          {listing.price_diamond.toLocaleString("id-ID")}
                        </div>
                        <div className="text-[11px] text-muted">
                          Gen {listing.agent.generation}
                        </div>
                      </div>
                      <motion.a
                        href={buyHref}
                        whileHover={{ backgroundColor: "#E74C3C" }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-crimson text-white no-underline px-4 py-2 rounded-md text-[13px] font-semibold cursor-pointer transition-all duration-200"
                      >
                        {isLoggedIn ? "Beli" : "Login dulu"}
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {!loading && listings.length > ITEMS_PER_PAGE && (
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
          <Button variant="secondary" href="/marketplace">
            Lihat Semua Agent di Marketplace -&gt;
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
