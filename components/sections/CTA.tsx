"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function CTA() {
  return (
    <section className="py-24 sm:py-[132px] md:py-[176px] text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(139,0,0,0.4)_0%,transparent_70%)]" />

      <div className="section-inner relative z-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] font-semibold text-crimson-glow tracking-[3px] uppercase mb-5"
        >
          ✦ Mulai Sekarang
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[clamp(40px,6vw,80px)] font-bold leading-[1.1] mb-6 sm:mb-7"
        >
          Agentmu menunggu
          <br />
          <em className="text-crimson-glow">untuk jatuh cinta</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm sm:text-base text-muted max-w-[480px] leading-[1.7] font-light mx-auto mb-10 sm:mb-14"
        >
          Gratis untuk mulai. Agent pertama gratis. Tidak perlu kartu kredit,
          tidak perlu crypto.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto"
        >
          <Button variant="primary" className="w-full sm:w-auto">
            🎮 Buat Agent Pertamamu
          </Button>
          <Button variant="secondary" className="w-full sm:w-auto">
            Lihat Marketplace →
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
