"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function CTA() {
  return (
    <section className="py-[160px] px-6 md:px-[60px] text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(139,0,0,0.4)_0%,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="relative z-2 text-[11px] font-semibold text-crimson-glow tracking-[3px] uppercase mb-4"
      >
        ✦ Mulai Sekarang
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-2 font-serif text-[clamp(40px,6vw,80px)] font-bold leading-[1.1]"
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
        className="relative z-2 text-base text-muted max-w-[480px] leading-[1.7] font-light mx-auto mb-12"
      >
        Gratis untuk mulai. Agent pertama gratis. Tidak perlu kartu kredit,
        tidak perlu crypto.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-2 flex items-center justify-center gap-4 flex-wrap"
      >
        <Button variant="primary">🎮 Buat Agent Pertamamu</Button>
        <Button variant="secondary">Lihat Marketplace →</Button>
      </motion.div>
    </section>
  );
}
