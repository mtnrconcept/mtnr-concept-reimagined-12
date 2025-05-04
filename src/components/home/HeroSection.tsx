
import { Link } from "react-router-dom";
import { NeonLogo } from "./NeonLogo";
export default function HeroSection() {
  return <section id="hero-section" className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      {/* Logo avec taille réduite */}
      <div className="w-full max-w-xs mx-auto">
        <NeonLogo />
      </div>
      
      {/* Bloc rapproché du logo avec margin-top réduite */}
      <div className="relative overflow-hidden mt-2 w-full max-w-2xl mx-auto backdrop-blur-xl bg-black/70 border border-yellow-400/30 shadow-[0_0_25px_rgba(255,215,0,0.15)] rounded-2xl p-6 sm:p-8" data-animate>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-purple-500/5 pointer-events-none opacity-50" />
        
        <h1 className="font-display text-3xl sm:text-4xl md:text-6xl text-yellow-400 mb-4 neon-text uppercase tracking-tighter drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
          <span className="block text-center font-light">Bienvenue à</span>
          <span className="block mt-2 font-normal text-center">MTNR Studio</span>
        </h1>
        
        <div className="text-white text-lg sm:text-xl mb-6 font-medium tracking-wide">
          Dans la cave du <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent bg-[size:200%_auto] animate-text-shimmer font-bold">son underground</span>
        </div>
        
        <div className="text-gray-200 leading-relaxed max-w-2xl mx-auto backdrop-blur font-medium text-sm sm:text-base">
          <p className="mb-3">
            Ici y'a pas de pose, pas de paillettes : juste le vrai son. Studio DIY, sueur sur la console, murs recouverts de rêves graffés.
          </p>
          <p>
            Ramène ton flow, laisse une empreinte. La famille MTNR c'est : beatmakers mutants, MC brut, groove crasseux, et vision d'auteur.
          </p>
          <p className="mt-4 text-yellow-300 font-display text-lg uppercase tracking-wider">
            Underground ou rien.
          </p>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link to="/book" className="relative px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg overflow-hidden group hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all duration-300">
            <span className="relative z-10">Book ta session</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <Link to="/what-we-do" className="px-6 py-2 bg-black/60 border border-yellow-400/50 text-white font-bold rounded-lg shadow-lg hover:shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:bg-black/80 hover:border-yellow-400 transition-all duration-300">
            En savoir plus
          </Link>
        </div>
      </div>
    </section>;
}
