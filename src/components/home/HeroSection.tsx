import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { NeonLogo } from "./NeonLogo";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const logoY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero-section"
      className="relative min-h-[100vh] w-full flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-16"
    >
      {/* ===== Atmospheric background layers ===== */}
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        {/* Giant radial glow */}
        <div
          className="absolute w-[900px] h-[900px] max-w-[140vw] max-h-[140vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.05) 30%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />

        {/* Concentric decorative rings */}
        <svg
          className="absolute w-[700px] h-[700px] max-w-[120vw] max-h-[120vw] opacity-20"
          viewBox="0 0 400 400"
        >
          {[180, 150, 120, 90].map((r, i) => (
            <circle
              key={r}
              cx="200"
              cy="200"
              r={r}
              fill="none"
              stroke="#FFD700"
              strokeOpacity={0.3 - i * 0.05}
              strokeWidth="0.5"
              strokeDasharray={i % 2 === 0 ? "1 8" : "2 4"}
            />
          ))}
        </svg>

        {/* Corner crosshairs */}
        <div className="absolute top-8 left-8 w-6 h-6">
          <div className="absolute top-0 left-0 w-full h-px bg-yellow-400/40" />
          <div className="absolute top-0 left-0 h-full w-px bg-yellow-400/40" />
        </div>
        <div className="absolute top-8 right-8 w-6 h-6">
          <div className="absolute top-0 right-0 w-full h-px bg-yellow-400/40" />
          <div className="absolute top-0 right-0 h-full w-px bg-yellow-400/40" />
        </div>
        <div className="absolute bottom-8 left-8 w-6 h-6">
          <div className="absolute bottom-0 left-0 w-full h-px bg-yellow-400/40" />
          <div className="absolute bottom-0 left-0 h-full w-px bg-yellow-400/40" />
        </div>
        <div className="absolute bottom-8 right-8 w-6 h-6">
          <div className="absolute bottom-0 right-0 w-full h-px bg-yellow-400/40" />
          <div className="absolute bottom-0 right-0 h-full w-px bg-yellow-400/40" />
        </div>
      </motion.div>

      {/* ===== Top metadata strip ===== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        style={{ opacity }}
        className="relative z-10 w-full max-w-5xl flex items-center justify-between text-[0.6rem] sm:text-xs font-mono tracking-[0.3em] text-yellow-400/70 uppercase mb-10"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span>REC • LIVE</span>
        </div>
        <div className="hidden sm:block">46.2044° N / 6.1432° E</div>
        <div>EST. 2024</div>
      </motion.div>

      {/* ===== LOGO CENTERPIECE ===== */}
      <motion.div
        style={{ y: logoY, scale: logoScale, opacity }}
        className="relative z-20 flex items-center justify-center"
      >
        {/* Side labels — left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="hidden lg:flex absolute right-full mr-10 flex-col items-end gap-2 text-right whitespace-nowrap"
        >
          <div className="text-[0.6rem] font-mono tracking-[0.3em] text-yellow-400/60 uppercase">
            // Chapter 00
          </div>
          <div className="text-yellow-400/90 font-display text-lg uppercase tracking-widest">
            Cave Studio
          </div>
          <div className="h-px w-20 bg-gradient-to-l from-yellow-400 to-transparent" />
          <div className="text-xs text-gray-400 italic">Analog / DIY</div>
        </motion.div>

        <NeonLogo size={360} />

        {/* Side labels — right */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="hidden lg:flex absolute left-full ml-10 flex-col items-start gap-2 whitespace-nowrap"
        >
          <div className="text-[0.6rem] font-mono tracking-[0.3em] text-yellow-400/60 uppercase">
            Underground //
          </div>
          <div className="text-yellow-400/90 font-display text-lg uppercase tracking-widest">
            Son brut
          </div>
          <div className="h-px w-20 bg-gradient-to-r from-yellow-400 to-transparent" />
          <div className="text-xs text-gray-400 italic">Mix / Master</div>
        </motion.div>
      </motion.div>

      {/* ===== Headline + tagline under logo ===== */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 flex flex-col items-center text-center mt-4 sm:mt-6 max-w-3xl"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.15 }}
          className="font-display text-5xl sm:text-6xl md:text-8xl text-yellow-400 neon-text uppercase tracking-tighter drop-shadow-[0_0_12px_rgba(255,215,0,0.4)] leading-[0.9]"
        >
          STUDIO
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.35 }}
          className="flex items-center gap-4 mt-6 text-[0.65rem] sm:text-xs font-mono tracking-[0.3em] text-yellow-400/80 uppercase"
        >
          <span className="h-px w-10 bg-yellow-400/50" />
          <span>Bienvenue dans la cave</span>
          <span className="h-px w-10 bg-yellow-400/50" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.35 }}
          className="text-white text-lg sm:text-xl md:text-2xl mt-8 font-medium tracking-wide"
        >
          Dans la cave du{" "}
          <span className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent bg-[size:200%_auto] animate-text-shimmer font-bold italic">
            son underground
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.55 }}
          className="mt-4 text-gray-300 text-sm sm:text-base max-w-xl leading-relaxed"
        >
          Pas de pose, pas de paillettes. Juste le vrai son — brut, crasseux, assumé.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.75 }}
          className="mt-10 flex flex-wrap gap-4 justify-center"
        >
          <Link
            to="/book"
            className="relative px-8 py-3 bg-yellow-400 text-black font-bold rounded-lg overflow-hidden group hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] transition-all duration-300 uppercase tracking-wider"
          >
            <span className="relative z-10">Book ta session</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -inset-1 bg-yellow-400/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <Link
            to="/what-we-do"
            className="relative px-8 py-3 bg-black/60 border border-yellow-400/50 text-white font-bold rounded-lg hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] hover:bg-black/80 hover:border-yellow-400 transition-all duration-300 uppercase tracking-wider overflow-hidden group"
          >
            <span className="relative z-10">En savoir plus</span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/15 to-yellow-400/0 transition-transform duration-500" />
          </Link>
        </motion.div>
      </motion.div>

      {/* ===== Scroll indicator ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{ opacity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-yellow-400/60"
      >
        <span className="text-[0.65rem] font-mono tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-yellow-400/80 to-transparent"
        />
      </motion.div>
    </section>
  );
}
