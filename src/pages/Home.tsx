
import ParallaxBg from "@/components/ParallaxBg";
import { Link } from "react-router-dom";

// Images artistes, logo
const artistImages = [
  {
    name: "U.D Sensei",
    src: "/lovable-uploads/211284ce-8851-4248-8f65-0ea7e3c0c8ff.png"
  },
  {
    name: "Mairo",
    src: "/lovable-uploads/5688334d-9fa2-4439-9453-5a5b9cde0c81.png"
  },
  {
    name: "Aray",
    src: "/lovable-uploads/62a9a9d9-c7b1-4cce-b401-180c42e9a514.png"
  },
  {
    name: "Neverzed",
    src: "/lovable-uploads/07c10d93-651e-4ab2-a2d1-66268cbb231b.png"
  }
];

export default function Home() {
  return (
    <ParallaxBg>
      <div className="relative min-h-screen w-full flex flex-col items-center font-rocksalt z-10 selection:bg-primary selection:text-black">
        {/* NAV + LOGO */}
        <nav className="w-full px-0 pt-8 flex flex-col items-center gap-5 z-20">
          <div className="flex flex-col items-center justify-center gap-1">
            <img
              src="/lovable-uploads/51d0caf2-88c4-425d-8751-e697fb315c42.png"
              alt="MTNR Logo"
              className="h-32 w-auto drop-shadow-[0_6px_38px_rgba(255,221,46,0.38)] brightness-125 saturate-150 animate-[fade-in_0.7s_ease]"
              style={{ filter: "drop-shadow(0 0 60px #FFEA00CC)" }}
              draggable={false}
            />
            <h1 className="font-marker text-white text-6xl md:text-8xl uppercase tracking-wider leading-tight animate-[fade-in_1s_ease]" style={{ letterSpacing: "0.13em", textShadow: "0 0 18px #fdec209b, 0 4px 40px #000" }}>
              MTNR Concept
            </h1>
          </div>
          <div className="flex flex-wrap justify-center gap-3 md:gap-10 mt-4 font-rocksalt text-lg text-white drop-shadow-lg z-10 bg-black/20 backdrop-blur-lg px-7 py-4 rounded-2xl border border-yellow-400/25 border-dashed glass-morphism">
            <Link to="/" className="hover:text-yellow-400 transition-colors">Accueil</Link>
            <Link to="/what-we-do" className="hover:text-yellow-400 transition-colors">What We Do</Link>
            <Link to="/artists" className="hover:text-yellow-400 transition-colors">Artistes</Link>
            <Link to="/book" className="hover:text-yellow-400 transition-colors">Book ta session</Link>
            <Link to="/contact" className="hover:text-yellow-400 transition-colors">Ecris-nous</Link>
            <Link to="/shop" className="hover:text-yellow-400 transition-colors">Boutique</Link>
            <Link to="/reservation" className="hover:text-yellow-400 transition-colors">Réservation</Link>
            <button className="ml-4 px-5 py-1 bg-yellow-400 text-black font-extrabold rounded-full border border-yellow-400/70 shadow animate-wiggle hover:bg-yellow-300/90 hover:scale-105 transition-all">
              Se connecter
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section className="relative z-20 mt-10 text-center w-full animate-[fade-in_0.8s_ease]">
          <div className="inline-block px-10 py-12 grunge-border shadow-2xl max-w-3xl bg-black/60">
            <h2 className="font-marker font-bold text-2xl sm:text-3xl md:text-4xl mb-4 uppercase text-primary tracking-[.17em] drop-shadow-lg">
              Bienvenue dans la <span className="block text-white text-5xl md:text-6xl tracking-tight leading-tight mt-2 mb-2 drop-shadow-2xl">Cave</span>
              <span className="mt-3 block text-yellow-400 text-4xl md:text-5xl animate-wiggle">underground</span>
            </h2>
            <p className="mt-10 text-xl font-bold text-gray-100 drop-shadow-md px-2 tracking-wide font-inter selection:bg-primary/80 selection:text-black">
              Ici, c'est plus que du son : c'est une <span className="text-yellow-300 font-extrabold">expérience brute</span>, construite sur le <span className="text-yellow-200/90">bitume, la sueur et la créativité</span>.<br />
              <span className="text-yellow-400/80">Viens poser ta vibe. Studio, enregistrement, mix, et tailleurs de rimes en famille.</span>
            </p>
          </div>
        </section>

        {/* SERVICES */}
        <main className="w-full max-w-5xl z-20 flex flex-col gap-16 items-center px-2 mt-16">
          <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 animate-[fade-in_1.1s_ease]">
            {/* Enregistrement Studio, Mixing, Mastering */}
            <div className="rounded-3xl grunge-border px-7 py-9 shadow-2xl flex flex-col items-center hover-scale bg-black/70">
              <div className="text-xl md:text-2xl font-black text-primary tracking-widest mb-3 uppercase drop-shadow-lg font-marker">Enregistrement</div>
              <div className="text-gray-100 text-base md:text-lg font-medium text-center mb-2 font-inter">Pose ta voix dans une vibe authentique. Equipé pour chaque style, chaque rime, chaque attaque.</div>
              <span className="text-lg font-extrabold text-yellow-400 mt-1 font-marker">50 CHF</span>
              <Link to="/reservation" className="mt-5 px-6 py-2 bg-primary text-black font-black uppercase tracking-widest rounded-full border border-yellow-900/80 shadow drop-shadow-md hover:bg-yellow-300 hover-scale">
                Réserver
              </Link>
            </div>
            <div className="rounded-3xl grunge-border px-7 py-9 shadow-2xl flex flex-col items-center hover-scale bg-black/70">
              <div className="text-xl md:text-2xl font-black text-primary tracking-widest mb-3 uppercase drop-shadow-lg font-marker">Mixing</div>
              <div className="text-gray-100 text-base md:text-lg font-medium text-center mb-2 font-inter">Affûte chaque détail, sublime ton flow. Repars avec ce son qui déchire, prêt à secouer les murs.</div>
              <span className="text-lg font-extrabold text-yellow-400 mt-1 font-marker">100 CHF</span>
              <Link to="/reservation" className="mt-5 px-6 py-2 bg-primary text-black font-black uppercase tracking-widest rounded-full border border-yellow-900/80 shadow drop-shadow-md hover:bg-yellow-300 hover-scale">
                Réserver
              </Link>
            </div>
            <div className="rounded-3xl grunge-border px-7 py-9 shadow-2xl flex flex-col items-center hover-scale bg-black/70">
              <div className="text-xl md:text-2xl font-black text-primary tracking-widest mb-3 uppercase drop-shadow-lg font-marker">Mastering</div>
              <div className="text-gray-100 text-base md:text-lg font-medium text-center mb-2 font-inter">Un son calibré pour la nuit, la scène, la rue. Que t’éclaires la foule ou la lune, ton track va brûler les ondes.</div>
              <span className="text-lg font-extrabold text-yellow-400 mt-1 font-marker">50 CHF</span>
              <Link to="/reservation" className="mt-5 px-6 py-2 bg-primary text-black font-black uppercase tracking-widest rounded-full border border-yellow-900/80 shadow drop-shadow-md hover:bg-yellow-300 hover-scale">
                Réserver
              </Link>
            </div>
          </section>

          {/* ARTISTES GALLERY */}
          <section className="w-full mt-2 z-20">
            <h2 className="font-marker font-black text-primary text-3xl md:text-4xl uppercase tracking-wider mb-6 text-center drop-shadow" style={{ letterSpacing: "0.10em" }}>Artistes phares</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-7 mt-4">
              {artistImages.map((artist) => (
                <div key={artist.name} className="rounded-xl overflow-hidden bg-black/80 border border-yellow-400/30 shadow-2xl flex flex-col items-center pb-3 hover-scale transition">
                  <img src={artist.src} alt={artist.name} className="w-full object-cover aspect-square grayscale-[55%] hover:grayscale-0 duration-300 shadow-xl" />
                  <div className="pt-2 text-lg font-black text-yellow-400 uppercase tracking-wide truncate max-w-[92%] mx-auto text-center font-marker">{artist.name}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ADRESSE & CONTACT */}
          <section className="w-full flex flex-col md:flex-row gap-12 items-center py-5 mt-10 z-30">
            <div className="flex-1 space-y-4 text-gray-100 font-bold text-lg max-w-md font-inter">
              <div className="font-marker font-black text-primary text-2xl mb-2">Nous contacter</div>
              <div>
                <span className="font-extrabold text-white">Adresse :</span>
                <p>Avenue de Pailly 15<br />1216 Châtelaine</p>
              </div>
              <div>
                <span className="font-extrabold text-white">Contact :</span>
                <p>+41 77 XXX XX XX<br />contact@mtnrconcept.fr</p>
              </div>
              <div>
                <span className="font-extrabold text-white">Heures :</span>
                <p>Lun. - Ven. : <b>Fermé</b><br />Samedi : <b>14h - minuit</b><br />Dimanche : <b>14h - minuit</b></p>
              </div>
            </div>
            {/* Réseaux sociaux */}
            <div className="flex-1 flex flex-col items-center gap-5">
              <div className="flex gap-5 text-3xl text-yellow-400 drop-shadow-xl">
                <a href="#" className="hover:text-yellow-300 opacity-90 transition" aria-label="Spotify"><svg width="32" height="32" fill="currentColor"><circle cx="16" cy="16" r="16" className="text-white" fill="white"/><rect x="12" y="18" width="8" height="2" rx="1" fill="black"/><rect x="10" y="14" width="12" height="2" rx="1" fill="black"/></svg></a>
                {/* ... autres icônes, même pattern ... */}
              </div>
              <div className="mt-8 text-primary text-xs text-center opacity-60">© 2024 by MTNR Concept Studio</div>
            </div>
          </section>
        </main>
      </div>
    </ParallaxBg>
  );
}
