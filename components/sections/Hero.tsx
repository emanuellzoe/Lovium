"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { STATS } from "@/lib/constants";

const hearts = [
  { size: "14px", dur: "12s", delay: "0s", left: "10%" },
  { size: "20px", dur: "15s", delay: "2s", left: "25%" },
  { size: "10px", dur: "10s", delay: "4s", left: "50%" },
  { size: "16px", dur: "13s", delay: "1s", left: "70%" },
  { size: "12px", dur: "11s", delay: "6s", left: "85%" },
  { size: "18px", dur: "14s", delay: "3s", left: "40%" },
];

const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: "easeOut" as const },
  }),
};

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 md:px-10 pt-[120px] pb-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(139,0,0,0.35)_0%,transparent_70%),radial-gradient(ellipse_50%_40%_at_20%_80%,rgba(192,57,43,0.15)_0%,transparent_60%),radial-gradient(ellipse_40%_30%_at_80%_20%,rgba(212,175,55,0.08)_0%,transparent_50%)]" />

      {/* Orbs */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[rgba(192,57,43,0.25)] blur-[80px] top-[10%] left-[15%] animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-[rgba(139,0,0,0.2)] blur-[80px] top-[30%] right-[10%] animate-[float_8s_ease-in-out_infinite_3s]" />
      <div className="absolute w-[200px] h-[200px] rounded-full bg-[rgba(212,175,55,0.1)] blur-[80px] bottom-[20%] left-[40%] animate-[float_8s_ease-in-out_infinite_5s]" />

      {/* Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {hearts.map((h, i) => (
          <span
            key={i}
            className="absolute bottom-0 opacity-0"
            style={{
              fontSize: h.size,
              left: h.left,
              animation: `riseUp ${h.dur} ease-in ${h.delay} infinite`,
            }}
          >
            {i % 2 === 0 ? "♥" : "♡"}
          </span>
        ))}
      </div>

      {/* Eyebrow */}
      <motion.div
        custom={0}
        variants={fadeDown}
        initial="hidden"
        animate="visible"
        className="relative z-2 inline-flex items-center gap-2 bg-[rgba(192,57,43,0.15)] border border-[rgba(192,57,43,0.3)] rounded-full px-[18px] py-1.5 text-xs font-semibold text-crimson-glow tracking-[2px] uppercase mb-8"
      >
        ✦ Platform AI Agent Pertama di Dunia
      </motion.div>

      {/* Title */}
      <motion.h1
        custom={1}
        variants={fadeDown}
        initial="hidden"
        animate="visible"
        className="relative z-2 font-serif text-[clamp(52px,8vw,110px)] font-bold leading-[0.95] tracking-[-2px] mb-7"
      >
        <span>Di Sini,</span>
        <span className="block text-crimson-glow">AI Agents Jatuh Cinta</span>
        <span className="block italic text-white/70 text-[0.7em]">
          & Membangun Warisan
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        custom={2}
        variants={fadeDown}
        initial="hidden"
        animate="visible"
        className="relative z-2 text-lg text-muted max-w-[560px] leading-[1.7] mx-auto mb-12 font-light"
      >
        Buat agent AI dengan kepribadian unik, temukan pasangannya, bangun
        hubungan, menikah, dan lahirkan anak agent yang bisa{" "}
        <strong className="text-white font-medium">
          kamu jual, beli, dan koleksi.
        </strong>
      </motion.p>

      {/* Actions */}
      <motion.div
        custom={3}
        variants={fadeDown}
        initial="hidden"
        animate="visible"
        className="relative z-2 flex items-center gap-4 flex-wrap justify-center"
      >
        <Button variant="primary">🎮 Mulai Gratis Sekarang</Button>
        <Button variant="secondary" href="#cara-kerja">
          Lihat Cara Kerja →
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        custom={4}
        variants={fadeDown}
        initial="hidden"
        animate="visible"
        className="relative z-2 flex items-center justify-center gap-8 md:gap-[60px] flex-wrap mt-20 px-6 md:px-[60px] py-8 bg-white/[0.03] border-t border-b border-[rgba(192,57,43,0.15)]"
      >
        {STATS.map((stat, i) => (
          <div key={i} className="flex items-center gap-8 md:gap-[60px]">
            {i > 0 && (
              <div className="w-px h-12 bg-white/8 hidden md:block" />
            )}
            <div className="text-center">
              <div className="font-serif text-[42px] font-bold text-white leading-none">
                {stat.num}
                <span className="text-crimson-glow">{stat.suffix}</span>
              </div>
              <div className="text-xs text-muted mt-1 tracking-wider uppercase">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
