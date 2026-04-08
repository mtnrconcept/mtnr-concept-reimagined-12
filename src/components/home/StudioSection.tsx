import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { studioImages } from "./data";
import { ConcentricCircles, AudioWaveform, FrequencyMeter } from "./SectionTitleDecorations";

export default function StudioSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section ref={ref} className="container mx-auto px-4 sm:px-6 py-[67px] my-[34px] relative">
      {/* Giant background number — outlined, glowing, highly visible */}
      <motion.div
        style={{
          y: yBg,
        }}
        data-number="01"
        className="neon-electric-number neon-electric-number--1 pointer-events-none absolute -top-10 -left-6 sm:left-10 text-[14rem] sm:text-[22rem] font-display font-black select-none leading-none tracking-tighter"
      >
        01
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="relative mb-14 text-center"
      >
        {/* Decorative concentric circles behind title */}
        <ConcentricCircles className="w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-60" />

        {/* Audio waveform — right side */}
        <AudioWaveform className="hidden sm:flex right-0 sm:-right-8 top-1/2 -translate-y-1/2 z-0 opacity-50" barCount={50} />

        {/* Audio waveform — left side (reversed) */}
        <AudioWaveform className="hidden sm:flex left-0 sm:-left-8 top-1/2 -translate-y-1/2 z-0 opacity-50 scale-x-[-1]" barCount={40} />

        {/* Frequency meter accents */}
        <FrequencyMeter className="hidden md:flex -right-16 top-4 z-0" />
        <FrequencyMeter className="hidden md:flex -left-16 bottom-4 z-0" />

        <div className="flex items-center justify-center gap-4 mb-3 text-xs font-mono tracking-[0.3em] text-yellow-400/70 uppercase relative z-10">
          <span className="h-px w-12 bg-yellow-400/50" />
          <span>Chapitre 01</span>
          <span className="h-px w-12 bg-yellow-400/50" />
        </div>

        {/* Paint splash behind the title */}
        <div className="relative inline-block">
          <img
            src="/lovable-uploads/paint-splatter-hi.png"
            alt=""
            aria-hidden
            className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] max-w-none opacity-60 mix-blend-screen"
            style={{
              filter:
                "brightness(0.9) sepia(1) saturate(6) hue-rotate(-8deg) drop-shadow(0 0 25px rgba(255,215,0,0.3))",
            }}
          />
          <h2 className="section-title relative text-center font-extrabold text-5xl sm:text-6xl md:text-7xl my-[17px] py-0 z-10">
            Notre Studio
          </h2>
        </div>

        <p className="neon-subtitle mt-4 max-w-xl mx-auto text-sm sm:text-base italic relative z-10">
          Un terrain de jeu analogique où la matière sonore prend vie.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 relative">
        {studioImages.map((image, index) => (
          <motion.div
            key={image.title}
            initial={{ opacity: 0, y: 80, rotateX: -10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.8,
              delay: (index % 2) * 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-black/80 via-black/70 to-black/80 rounded-2xl border border-yellow-400/30 group transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,215,0,0.2)] hover:border-yellow-400/60 ${
              index % 2 === 1 ? "md:translate-y-10" : ""
            }`}
          >
            {/* Corner accents */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-yellow-400/60 rounded-tl pointer-events-none z-20" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-yellow-400/60 rounded-br pointer-events-none z-20" />

            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

            <div className="h-72 sm:h-80 overflow-hidden relative">
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.2s] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute top-4 right-4 px-3 py-1 bg-black/80 backdrop-blur border border-yellow-400/50 text-yellow-400 text-[0.65rem] font-mono tracking-[0.2em] uppercase rounded-full z-20">
                0{index + 1}
              </div>
            </div>

            <div className="relative z-10 p-6 sm:p-7">
              <div className="h-px w-10 bg-yellow-400 mb-3 group-hover:w-20 transition-all duration-500" />
              <h3 className="text-yellow-400 text-2xl font-display uppercase tracking-wide mb-2 group-hover:text-yellow-300 transition-colors drop-shadow-[0_0_5px_rgba(255,215,0,0.4)]">
                {image.title}
              </h3>
              <p className="text-gray-300 text-sm font-medium leading-relaxed">
                {image.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
