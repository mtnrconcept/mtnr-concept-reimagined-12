import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, Users, FlaskConical, Flag } from "lucide-react";
import NeonText from "@/components/effects/NeonText";
import ElectricParticles from "@/components/effects/ElectricParticles";
import UVText from "@/components/effects/UVText";
import { PageSplashes } from "@/components/effects/PageSplashes";
import { ConcentricCircles, AudioWaveform } from "@/components/home/SectionTitleDecorations";
import Footer from "@/components/Footer";

/* ─── Data ─── */
const services = [
  {
    icon: "/icons/recording.png",
    title: "Enregistrement",
    tag: "Recording",
    desc: "Notre cabine traitée acoustiquement capture chaque nuance de ta voix ou instrument. Micro Neumann TLM 103, préamp Neve, monitoring précis.",
    features: [
      "Prise de son méticuleuse adaptée à ton style",
      "Support technique discret, on te laisse dans ta zone",
      "Sessions flexibles, pas de pression sur l'horloge",
      "Exports multiples pour travailler tes stems",
    ],
    uvHidden: "ENREGISTREMENT CRYPTÉ",
    uvColor: "#4FA9FF",
  },
  {
    icon: "/icons/mixing.png",
    title: "Mixage",
    tag: "Analog",
    desc: "Ton son prend vie entre nos mains. On sculpte l'équilibre parfait, on creuse la stéréo, on injecte la chaleur analogique.",
    features: [
      "Balance précise de chaque élément",
      "Traitement dynamique pour un impact maximum",
      "Spatialisation immersive",
      "Coloration vintage ou clarté hyper-moderne",
    ],
    uvHidden: "MIXAGE SUBLIMINALE",
    uvColor: "#D2FF3F",
  },
  {
    icon: "/icons/mastering.png",
    title: "Mastering",
    tag: "Finition",
    desc: "L'étape finale qui transcende ton mix. On optimise, on équilibre, on donne le volume et l'énergie nécessaires.",
    features: [
      "Loudness optimisé pour les plateformes de streaming",
      "Cohérence spectrale parfaite",
      "Équilibre tonal ciselé",
      "Conversion haute résolution",
    ],
    uvHidden: "NIVEAU ULTIME",
    uvColor: "#00FFBB",
  },
  {
    icon: "/icons/production.png",
    title: "Production musicale",
    tag: "Beatmaking",
    desc: "On part de ton concept pour créer l'univers sonore qui t'appartient vraiment. Composition, arrangement, sound design.",
    features: [
      "Création d'instrumentales sur mesure",
      "Co-écriture de morceaux",
      "Direction artistique complète",
      "Développement de ton identité sonore",
    ],
    uvHidden: "CODES SOURCES",
    uvColor: "#D946EF",
  },
];

const values = [
  {
    title: "Authenticité",
    desc: "On défend l'honnêteté artistique avant tout. Pas de formules préfabriquées, chaque projet évolue selon sa propre nature.",
    icon: <Zap className="text-yellow-400 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" size={32} strokeWidth={1.5} />,
  },
  {
    title: "Communauté",
    desc: "Le studio est un hub créatif où les artistes se rencontrent, échangent et évoluent ensemble. On crée des ponts, pas des murs.",
    icon: <Users className="text-yellow-400 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" size={32} strokeWidth={1.5} />,
  },
  {
    title: "Expérimentation",
    desc: "Parfois faut casser les règles. On pousse les limites de la technique pour trouver des sonorités uniques.",
    icon: <FlaskConical className="text-yellow-400 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" size={32} strokeWidth={1.5} />,
  },
  {
    title: "Indépendance",
    desc: "Auto-produit, auto-géré. On garde le contrôle total sur notre processus pour garantir l'intégrité artistique.",
    icon: <Flag className="text-yellow-400 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" size={32} strokeWidth={1.5} />,
  },
];

/* ─── Component ─── */
export default function WhatWeDo() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <PageSplashes pageVariant="whatwedo" />

      <div className="relative z-10 min-h-screen">
        {/* ══════════════════════════════════════ */}
        {/*  HERO                                  */}
        {/* ══════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden"
        >
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 60%)",
                filter: "blur(40px)",
              }}
            />
          </div>

          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="relative z-10 flex flex-col items-center text-center max-w-4xl"
          >
            {/* Concentric circles behind title */}
            <ConcentricCircles className="w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-40" />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4 mb-6 text-[0.65rem] sm:text-xs font-mono tracking-[0.3em] text-yellow-400/70 uppercase"
            >
              <span className="h-px w-10 bg-yellow-400/50" />
              <span>Notre mission</span>
              <span className="h-px w-10 bg-yellow-400/50" />
            </motion.div>

            <div className="relative">
              <NeonText
                text="What We Do"
                className="text-4xl xs:text-5xl md:text-7xl lg:text-8xl mb-4 text-center"
                color="yellow"
                flicker={true}
              />
              <ElectricParticles
                targetSelector=".neon-text"
                color="#ffdd00"
                quantity={12}
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="neon-subtitle mt-6 max-w-2xl text-base sm:text-lg leading-relaxed"
            >
              <UVText
                text={
                  <>
                    <span className="text-yellow-400 font-bold">MTNR Studio</span>
                    , c'est le choix de la marge. On crée sans limite, on enregistre
                    dans la sueur, on partage la ride.
                  </>
                }
                hiddenText="MTNR - CODE SECRET"
                uvColor="#7E69AB"
              />
            </motion.p>

            {/* Waveform decoration */}
            <AudioWaveform
              className="hidden sm:flex absolute -right-20 top-1/2 -translate-y-1/2 z-0 opacity-30"
              barCount={35}
            />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            style={{ opacity: heroOpacity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-yellow-400/60"
          >
            <span className="text-[0.6rem] font-mono tracking-[0.3em] uppercase">
              Explore
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-px h-8 bg-gradient-to-b from-yellow-400/60 to-transparent"
            />
          </motion.div>
        </section>

        {/* ══════════════════════════════════════ */}
        {/*  MANIFESTO STRIP                       */}
        {/* ══════════════════════════════════════ */}
        <section className="relative py-16 sm:py-20 border-y border-yellow-400/15 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/[0.03] to-transparent" />
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <ul className="space-y-5">
                {[
                  {
                    text: "Studio accessible à tous, on casse les codes : no bling, que du vrai.",
                    hidden: "ACCESS CODE 3472",
                    color: "#9b87f5",
                  },
                  {
                    text: "Ambiance home-made : murs rough, lampes chaudes, matos old-school tweaké.",
                    hidden: null,
                    color: null,
                  },
                  {
                    text: "Crew fraternel : chacun amène sa folie et repart avec une vibe unique.",
                    hidden: "LA FRATERNITÉ EST NOTRE ARME SECRÈTE",
                    color: "#D946EF",
                  },
                  {
                    text: "On valorise le process : l'art, c'est la trace qu'on laisse. Les erreurs font le style.",
                    hidden: null,
                    color: null,
                  },
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.12 }}
                    className="flex items-start gap-4 group"
                  >
                    <span className="shrink-0 mt-1 w-2 h-2 rounded-full bg-yellow-400/60 group-hover:bg-yellow-400 group-hover:shadow-[0_0_10px_rgba(255,215,0,0.5)] transition-all duration-300" />
                    <span className="text-gray-300 text-sm sm:text-base font-medium leading-relaxed group-hover:text-yellow-400/90 transition-colors duration-300">
                      {item.hidden ? (
                        <UVText
                          text={item.text}
                          hiddenText={item.hidden}
                          uvColor={item.color!}
                        />
                      ) : (
                        item.text
                      )}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════ */}
        {/*  SERVICES CARDS                        */}
        {/* ══════════════════════════════════════ */}
        <section className="container mx-auto px-4 sm:px-6 py-20 sm:py-28 relative">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative mb-16 text-center"
          >
            <ConcentricCircles className="w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-35" />

            <div className="flex items-center justify-center gap-4 mb-3 text-xs font-mono tracking-[0.3em] text-yellow-400/70 uppercase relative z-10">
              <span className="h-px w-12 bg-yellow-400/50" />
              <span>Nos prestations</span>
              <span className="h-px w-12 bg-yellow-400/50" />
            </div>
            <h2 className="section-title relative text-center font-extrabold text-4xl sm:text-5xl md:text-6xl z-10">
              Ce qu'on propose
            </h2>
            <p className="neon-subtitle mt-4 max-w-xl mx-auto text-sm sm:text-base italic relative z-10">
              Quatre piliers pour sublimer ton son.
            </p>
          </motion.div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 60, rotateX: -8 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-black/80 via-black/70 to-black/80 rounded-2xl border border-yellow-400/25 group transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,215,0,0.15)] hover:border-yellow-400/60"
              >
                {/* Corner accents */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-yellow-400/50 rounded-tl pointer-events-none z-20" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-yellow-400/50 rounded-br pointer-events-none z-20" />

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-yellow-400/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Number badge */}
                <div className="absolute top-4 right-4 font-display text-4xl font-black text-yellow-400/10 group-hover:text-yellow-400/25 transition-colors duration-500 select-none z-10">
                  0{index + 1}
                </div>

                {/* Content */}
                <div className="relative z-10 p-7 sm:p-9">
                  {/* Icon + Tag */}
                  <div className="flex items-center gap-4 mb-6">
                    <img src={service.icon} alt={service.title} className="w-12 h-12 object-contain" style={{ filter: 'drop-shadow(0px 0px 8px rgba(255, 215, 0, 0.4))' }} />
                    <span className="text-[0.6rem] font-mono tracking-[0.3em] text-yellow-400/60 uppercase bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                      // {service.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-yellow-400 text-2xl sm:text-3xl font-display uppercase tracking-wide mb-3 group-hover:text-yellow-300 transition-colors drop-shadow-[0_0_5px_rgba(255,215,0,0.4)]">
                    <UVText
                      text={service.title}
                      hiddenText={service.uvHidden}
                      uvColor={service.uvColor}
                    />
                  </h3>

                  {/* Accent line */}
                  <div className="h-px w-10 bg-yellow-400 mb-4 group-hover:w-20 transition-all duration-500" />

                  {/* Description */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-5">
                    {service.desc}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {service.features.map((feature, fi) => (
                      <li
                        key={fi}
                        className="flex items-start gap-2.5 text-gray-400 text-sm"
                      >
                        <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-400/50" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Vertical accent line */}
                <div className="absolute left-0 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-yellow-400/50 to-transparent group-hover:via-yellow-400 transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════ */}
        {/*  VALUES / APPROACH                     */}
        {/* ══════════════════════════════════════ */}
        <section className="container mx-auto px-4 sm:px-6 py-20 sm:py-28 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative mb-16 text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-3 text-xs font-mono tracking-[0.3em] text-yellow-400/70 uppercase">
              <span className="h-px w-12 bg-yellow-400/50" />
              <span>Notre philosophie</span>
              <span className="h-px w-12 bg-yellow-400/50" />
            </div>
            <h2 className="section-title relative text-center font-extrabold text-4xl sm:text-5xl md:text-6xl">
              Notre approche
            </h2>
            <p className="neon-subtitle mt-4 max-w-xl mx-auto text-sm sm:text-base italic">
              Les piliers qui guident chacune de nos sessions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -8 }}
                className="relative overflow-hidden backdrop-blur-xl bg-black/70 rounded-2xl border border-yellow-400/25 p-6 sm:p-7 group hover:shadow-[0_0_35px_rgba(255,215,0,0.15)] hover:border-yellow-400/50 transition-all duration-500"
              >
                {/* Corner accents */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-yellow-400/40 rounded-tl pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-yellow-400/40 rounded-br pointer-events-none" />

                {/* Icon */}
                <div className="mb-5">{value.icon}</div>

                {/* Title */}
                <h3 className="text-yellow-400 text-lg font-display uppercase tracking-wide mb-2 group-hover:text-yellow-300 transition-colors drop-shadow-[0_0_5px_rgba(255,215,0,0.3)]">
                  {value.title}
                </h3>

                <div className="h-px w-8 bg-yellow-400/60 mb-3 group-hover:w-14 transition-all duration-500" />

                {/* Desc */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════ */}
        {/*  CTA                                   */}
        {/* ══════════════════════════════════════ */}
        <section className="relative py-20 sm:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-400/[0.03] to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto px-4"
          >
            <div className="text-5xl mb-6">🎧</div>
            <h2 className="text-yellow-400 font-display text-3xl sm:text-4xl md:text-5xl uppercase tracking-wider mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
              <UVText
                text="Rejoins la ride"
                hiddenText="REJOINS-NOUS DANS L'OMBRE - 23H30 - CODE: MTNR"
                uvColor="#F97316"
              />
            </h2>
            <p className="text-gray-400 text-base sm:text-lg mb-10 leading-relaxed">
              Le son prend vie dans la cave. Book ta session et viens poser ta
              marque.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/book"
                className="relative px-8 py-3.5 bg-yellow-400 text-black font-bold rounded-lg overflow-hidden group hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] transition-all duration-300 uppercase tracking-wider"
              >
                <span className="relative z-10">Book ta session</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                to="/contact"
                className="relative px-8 py-3.5 bg-black/60 border border-yellow-400/50 text-white font-bold rounded-lg hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] hover:bg-black/80 hover:border-yellow-400 transition-all duration-300 uppercase tracking-wider overflow-hidden group"
              >
                <span className="relative z-10">Contacte-nous</span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/15 to-yellow-400/0 transition-transform duration-500" />
              </Link>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </div>
  );
}