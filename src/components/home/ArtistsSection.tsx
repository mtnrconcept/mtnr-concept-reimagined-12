import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { artistImages } from "./data";

export default function ArtistsSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={ref} className="container mx-auto px-4 sm:px-6 py-[4px] relative">
      <motion.div
        style={{
          y: yBg,
        }}
        data-number="03"
        className="neon-electric-number neon-electric-number--3 pointer-events-none absolute -top-4 -left-6 sm:left-10 text-[12rem] sm:text-[20rem] font-display font-black select-none leading-none tracking-tighter"
      >
        03
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="relative mb-14 text-center"
      >
        <div className="flex items-center justify-center gap-4 mb-3 text-xs font-mono tracking-[0.3em] text-yellow-400/70 uppercase">
          <span className="h-px w-12 bg-yellow-400/50" />
          <span>Chapitre 03</span>
          <span className="h-px w-12 bg-yellow-400/50" />
        </div>

        {/* Paint splash behind the title */}
        <div className="relative inline-block">
          <img
            src="/lovable-uploads/paint-splatter-hi.png"
            alt=""
            aria-hidden
            className="pointer-events-none select-none absolute left-1/2 top-1/2 w-[130%] max-w-none opacity-60 mix-blend-screen"
            style={{
              filter:
                "brightness(0.9) sepia(1) saturate(6) hue-rotate(-8deg) drop-shadow(0 0 25px rgba(255,215,0,0.3))",
              transform: "translate(-50%, -50%) rotate(-5deg)",
            }}
          />
          <h2 className="section-title relative text-5xl sm:text-6xl md:text-7xl text-center font-extrabold py-[2px] my-[29px]">
            Artistes de la cave
          </h2>
        </div>

        <p className="neon-subtitle mt-2 max-w-xl mx-auto text-sm sm:text-base italic">
          Ceux qui ont laissé leur empreinte sur la console.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 relative">
        {artistImages.map((artist, index) => (
          <motion.div
            key={artist.name}
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.7,
              delay: index * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ y: -6 }}
            className={`relative overflow-hidden backdrop-blur-xl bg-black/70 rounded-2xl border border-yellow-400/30 group transition-all duration-500 hover:shadow-[0_0_35px_rgba(255,215,0,0.25)] hover:border-yellow-400/70 ${
              index % 2 === 1 ? "sm:translate-y-8" : ""
            }`}
          >
            {/* Corner accents */}
            <div className="absolute top-2 left-2 w-5 h-5 border-t border-l border-yellow-400/60 rounded-tl pointer-events-none z-20" />
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-yellow-400/60 rounded-br pointer-events-none z-20" />

            {/* Number badge */}
            <div className="absolute top-3 right-3 z-20 px-2 py-0.5 bg-black/80 backdrop-blur border border-yellow-400/50 text-yellow-400 text-[0.6rem] font-mono tracking-[0.2em] uppercase rounded-full">
              0{index + 1}
            </div>

            <div className="aspect-square overflow-hidden relative">
              <img
                src={artist.src}
                alt={artist.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 via-transparent to-purple-500/0 group-hover:from-yellow-400/10 group-hover:to-purple-500/20 transition-all duration-500" />
            </div>

            <div className="relative z-10 p-4 text-center">
              <div className="h-px w-6 bg-yellow-400 mx-auto mb-2 group-hover:w-16 transition-all duration-500" />
              <h3 className="text-yellow-400 font-display uppercase tracking-wide group-hover:text-yellow-300 transition-colors drop-shadow-[0_0_5px_rgba(255,215,0,0.4)] text-base sm:text-lg">
                {artist.name}
              </h3>
              <div className="text-[0.6rem] font-mono text-yellow-400/50 tracking-[0.2em] uppercase mt-1">
                Cave Artist
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
