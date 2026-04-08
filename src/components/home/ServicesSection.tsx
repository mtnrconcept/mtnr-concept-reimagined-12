import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ConcentricCircles, AudioWaveform, FrequencyMeter } from "./SectionTitleDecorations";

const services = [
  {
    name: "Studio",
    tag: "Recording",
    desc: "Prise de voix, mélo, freestyle, matos old-school tweaké. Tape direct dans la matière.",
    cta: "Book ta session",
  },
  {
    name: "Mix",
    tag: "Analog",
    desc: "Fais rugir ta prod : mix analogique, pas de triche. On module, t'assumes.",
    cta: "Réserve",
  },
  {
    name: "Mastering",
    tag: "Finition",
    desc: "On appuie, on sur-sature, on découpe. Le track ressort plus vrai que nature.",
    cta: "Masterise",
  },
];

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      ref={ref}
      className="container mx-auto px-4 sm:px-6 backdrop-blur-sm rounded-3xl max-w-6xl my-[66px] py-[26px] relative"
    >
      <motion.div
        style={{
          y: yBg,
        }}
        data-number="02"
        className="neon-electric-number neon-electric-number--2 pointer-events-none absolute -top-10 right-0 text-[12rem] sm:text-[18rem] font-display font-black select-none leading-none tracking-tighter"
      >
        02
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="relative mb-14 text-center"
      >
        {/* Decorative concentric circles behind title */}
        <ConcentricCircles className="w-[260px] h-[260px] sm:w-[350px] sm:h-[350px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-50" />

        {/* Audio waveform — right side */}
        <AudioWaveform className="hidden sm:flex right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-0 opacity-40" barCount={45} />

        {/* Frequency meter accents */}
        <FrequencyMeter className="hidden md:flex -left-12 top-6 z-0" />

        <div className="flex items-center justify-center gap-4 mb-3 text-xs font-mono tracking-[0.3em] text-yellow-400/70 uppercase relative z-10">
          <span className="h-px w-12 bg-yellow-400/50" />
          <span>Chapitre 02</span>
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
              transform: "translate(-50%, -50%) rotate(8deg)",
            }}
          />
          <h2 className="section-title relative text-center text-5xl sm:text-6xl md:text-7xl font-extrabold my-[25px] py-[10px] z-10">
            Nos Services
          </h2>
        </div>

        <p className="neon-subtitle mt-2 max-w-xl mx-auto text-sm sm:text-base italic relative z-10">
          Trois portes d'entrée, un même culte du son brut.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {services.map((service, index) => (
          <motion.div
            key={service.name}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.7,
              delay: index * 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ y: -10 }}
            className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-black/80 via-black/70 to-black/80 rounded-2xl border border-yellow-400/30 p-7 sm:p-9 group hover:shadow-[0_0_40px_rgba(255,215,0,0.2)] hover:border-yellow-400/60 transition-all duration-500"
          >
            {/* Decorative gradient sweep */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Number badge */}
            <div className="absolute top-5 right-5 font-display text-5xl font-black text-yellow-400/15 group-hover:text-yellow-400/30 transition-colors duration-500 select-none">
              0{index + 1}
            </div>

            {/* Vertical accent line */}
            <div className="absolute left-0 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-yellow-400/60 to-transparent group-hover:via-yellow-400 transition-all duration-500" />

            <div className="relative z-10">
              <div className="text-[0.65rem] font-mono tracking-[0.3em] text-yellow-400/70 uppercase mb-3">
                // {service.tag}
              </div>
              <div className="text-yellow-400 text-3xl sm:text-4xl font-display uppercase mb-2 group-hover:text-yellow-300 transition-colors drop-shadow-[0_0_5px_rgba(255,215,0,0.4)] tracking-tight">
                {service.name}
              </div>
              <div className="h-px w-10 bg-yellow-400 my-4 group-hover:w-20 transition-all duration-500" />
              <div className="text-gray-300 mb-8 font-medium leading-relaxed text-sm sm:text-base">
                {service.desc}
              </div>
              <Link
                to="/book"
                className="relative inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold uppercase tracking-wider rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 text-sm overflow-hidden"
              >
                <span className="relative z-10">{service.cta}</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
