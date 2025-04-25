
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="container mx-auto pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div 
        className="glass-card p-8 sm:p-10 max-w-3xl mx-auto relative overflow-hidden"
        data-animate
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-primary mb-6 neon-text uppercase tracking-tighter">
          <span className="block">Bienvenue à</span>
          <span className="block mt-2">MTNR Studio</span>
        </h1>
        
        <div className="text-white text-xl sm:text-2xl mb-8 font-medium tracking-wide">
          Dans la cave du <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent bg-[size:200%_auto] animate-text-shimmer">son underground</span>
        </div>
        
        <div className="text-gray-200 leading-relaxed max-w-2xl mx-auto">
          <p className="mb-4">
            Ici y'a pas de pose, pas de paillettes : juste le vrai son. Studio DIY, sueur sur la console, murs recouverts de rêves graffés.
          </p>
          <p>
            Ramène ton flow, laisse une empreinte. La famille MTNR c'est : beatmakers mutants, MC brut, groove crasseux, et vision d'auteur.
          </p>
          <p className="mt-6 text-yellow-300 font-display text-xl uppercase tracking-wider">
            Underground ou rien.
          </p>
        </div>
        
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link 
            to="/book" 
            className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-lg shadow-lg hover:shadow-yellow-400/30 hover:bg-yellow-300 transition-all duration-300"
          >
            Book ta session
          </Link>
          <Link 
            to="/what-we-do" 
            className="px-8 py-3 bg-black/60 border border-yellow-400/50 text-white font-bold rounded-lg shadow-lg hover:shadow-yellow-400/20 hover:bg-black/80 transition-all duration-300"
          >
            En savoir plus
          </Link>
        </div>
      </div>
    </section>
  );
}
