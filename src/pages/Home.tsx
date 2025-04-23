
import ParallaxBg from "@/components/ParallaxBg";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

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
      <Navbar />
      <div className="relative min-h-screen w-full flex flex-col items-center font-grunge z-10 selection:bg-primary selection:text-black">
        <section className="w-full flex flex-col items-center justify-center pt-40 pb-20 px-5 text-center">
          <div className="inline-block px-7 py-12 grunge-border shadow-2xl bg-black/70 max-w-2xl backdrop-blur-lg" style={{ animation: "wiggle 1.4s infinite both" }}>
            <h1 className="font-grunge text-6xl md:text-7xl uppercase drop-shadow-lg text-primary mb-3" style={{ letterSpacing: "0.12em" }}>
              Bienvenue
            </h1>
            <div className="uppercase text-white tracking-widest text-2xl md:text-4xl mb-6 font-extrabold" style={{ textShadow: "0 2px 10px #ffe,0 6px 30px #444" }}>
              Dans la cave du <span className="text-yellow-400 animate-wiggle">son underground</span>
            </div>
            <div className="text-lg md:text-xl mt-6 text-gray-200/95 font-bold leading-relaxed max-w-xl mx-auto font-grunge">
              Ici y’a pas de pose, pas de paillettes : juste le vrai son. Studio DIY, sueur sur la console, murs recouverts de rêves graffés.<br />
              Ramène ton flow, laisse une empreinte. La famille MTNR c’est : beatmakers mutants, MC brut, groove crasseux, et vision d’auteur.
              <span className="block mt-4 text-yellow-300/90 font-black">Underground ou rien.</span>
            </div>
          </div>
        </section>
        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-5 max-w-5xl mt-10">
          <div className="rounded-3xl grunge-border px-7 py-9 shadow-2xl flex flex-col items-center hover-scale bg-black/80">
            <div className="text-xl md:text-2xl font-black text-yellow-400 tracking-widest mb-3 uppercase drop-shadow-lg font-grunge">Studio</div>
            <div className="text-gray-100 text-base md:text-lg font-medium text-center mb-2">Prise de voix, mélo ou freestyle, matériel old-school & ambiance sombre. Tape direct dans la matière.</div>
            <Link to="/book" className="mt-5 px-6 py-2 bg-yellow-400/90 text-black font-black uppercase tracking-widest rounded-full border border-yellow-900/80 shadow drop-shadow-md hover:bg-yellow-300 hover-scale">
              Book ta session
            </Link>
          </div>
          <div className="rounded-3xl grunge-border px-7 py-9 shadow-2xl flex flex-col items-center hover-scale bg-black/80">
            <div className="text-xl md:text-2xl font-black text-yellow-400 tracking-widest mb-3 uppercase drop-shadow-lg font-grunge">Mix</div>
            <div className="text-gray-100 text-base md:text-lg font-medium text-center mb-2">Fais rugir ta prod : mix analogique, pas de triche. Chaud ou sale ? On module, t’assumes.</div>
            <Link to="/book" className="mt-5 px-6 py-2 bg-yellow-400/90 text-black font-black uppercase tracking-widest rounded-full border border-yellow-900/80 shadow drop-shadow-md hover:bg-yellow-300 hover-scale">
              Réserve
            </Link>
          </div>
          <div className="rounded-3xl grunge-border px-7 py-9 shadow-2xl flex flex-col items-center hover-scale bg-black/80">
            <div className="text-xl md:text-2xl font-black text-yellow-400 tracking-widest mb-3 uppercase drop-shadow-lg font-grunge">Mastering</div>
            <div className="text-gray-100 text-base md:text-lg font-medium text-center mb-2">On appuie, on sur-sature, on fait éclater le millième découpage. Le track ressort plus vrai que nature.</div>
            <Link to="/book" className="mt-5 px-6 py-2 bg-yellow-400/90 text-black font-black uppercase tracking-widest rounded-full border border-yellow-900/80 shadow drop-shadow-md hover:bg-yellow-300 hover-scale">
              Masterise
            </Link>
          </div>
        </section>
        <section className="w-full mt-20 z-20">
          <h2 className="font-grunge font-black text-yellow-400 text-3xl md:text-4xl uppercase tracking-wider mb-6 text-center drop-shadow" style={{ letterSpacing: "0.08em" }}>Artistes de la cave</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-7 mt-4">
            {artistImages.map((artist) => (
              <div key={artist.name} className="rounded-xl overflow-hidden bg-black/85 border border-yellow-400/35 shadow-2xl flex flex-col items-center pb-3 hover-scale transition">
                <img src={artist.src} alt={artist.name} className="w-full object-cover aspect-square grayscale-[65%] hover:grayscale-0 duration-300 shadow-xl" />
                <div className="pt-2 text-lg font-black text-yellow-400 uppercase tracking-wider truncate max-w-[92%] mx-auto text-center font-grunge">{artist.name}</div>
              </div>
            ))}
          </div>
        </section>
        <footer className="w-full flex justify-center items-center py-12 mt-28 text-sm text-yellow-300/60 font-grunge uppercase tracking-widest">
          © 2024 - MTNR Cave Studio. Fait maison, sert la vibe underground — Geneva/France.
        </footer>
      </div>
    </ParallaxBg>
  );
}
