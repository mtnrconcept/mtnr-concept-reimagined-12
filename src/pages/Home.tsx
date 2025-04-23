
import ParallaxBg from "@/components/ParallaxBg";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { useEffect } from "react";

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
  // Force scroll to top on page load and fix z-index issues
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex flex-col items-center font-grunge z-20 selection:bg-primary selection:text-black pt-20 xs:pt-24 md:pt-32 px-3 xs:px-6">
        <section className="w-full flex flex-col items-center justify-center pb-14 px-1 sm:px-3 section-content z-20">
          <div className="inline-block px-4 sm:px-7 py-9 sm:py-12 grunge-border shadow-2xl bg-black/80 max-w-2xl backdrop-blur-lg mt-5" >
            <h1 className="section-title text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-primary mb-4">Bienvenue</h1>
            <div className="uppercase text-white tracking-widest text-xl sm:text-2xl md:text-3xl mb-5 font-extrabold" style={{ textShadow: "0 2px 10px #ffe,0 6px 30px #444" }}>
              Dans la cave du <span className="text-yellow-400">son underground</span>
            </div>
            <div className="text-base sm:text-lg md:text-xl mt-6 text-gray-200/95 font-bold leading-relaxed max-w-xl mx-auto font-grunge">
              Ici y'a pas de pose, pas de paillettes : juste le vrai son. Studio DIY, sueur sur la console, murs recouverts de rêves graffés.<br />
              Ramène ton flow, laisse une empreinte. La famille MTNR c'est : beatmakers mutants, MC brut, groove crasseux, et vision d'auteur.
              <span className="block mt-4 text-yellow-300/90 font-black">Underground ou rien.</span>
            </div>
          </div>
        </section>
        <section className="section-content grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-10 mt-7 md:mt-11 z-20">
          <div className="rounded-3xl grunge-border px-5 xs:px-7 py-8 shadow-2xl flex flex-col items-center hover:scale-105 transition-transform bg-black/85 mb-4 md:mb-0">
            <div className="text-lg xs:text-xl md:text-2xl font-black text-yellow-400 tracking-widest mb-2 uppercase drop-shadow-lg font-grunge">Studio</div>
            <div className="text-gray-100 text-sm xs:text-base md:text-lg font-medium text-center mb-2">Prise de voix, mélo, freestyle, matos old-school tweaké. Tape direct dans la matière.</div>
            <Link to="/book" className="mt-4 px-6 py-2 bg-yellow-400/90 text-black font-black uppercase tracking-widest rounded-full border border-yellow-900/80 shadow drop-shadow-md hover:bg-yellow-300 hover:scale-105 transition-transform">
              Book ta session
            </Link>
          </div>
          <div className="rounded-3xl grunge-border px-5 xs:px-7 py-8 shadow-2xl flex flex-col items-center hover:scale-105 transition-transform bg-black/85 mb-4 md:mb-0">
            <div className="text-lg xs:text-xl md:text-2xl font-black text-yellow-400 tracking-widest mb-2 uppercase drop-shadow-lg font-grunge">Mix</div>
            <div className="text-gray-100 text-sm xs:text-base md:text-lg font-medium text-center mb-2">Fais rugir ta prod : mix analogique, pas de triche. On module, t'assumes.</div>
            <Link to="/book" className="mt-4 px-6 py-2 bg-yellow-400/90 text-black font-black uppercase tracking-widest rounded-full border border-yellow-900/80 shadow drop-shadow-md hover:bg-yellow-300 hover:scale-105 transition-transform">
              Réserve
            </Link>
          </div>
          <div className="rounded-3xl grunge-border px-5 xs:px-7 py-8 shadow-2xl flex flex-col items-center hover:scale-105 transition-transform bg-black/85">
            <div className="text-lg xs:text-xl md:text-2xl font-black text-yellow-400 tracking-widest mb-2 uppercase drop-shadow-lg font-grunge">Mastering</div>
            <div className="text-gray-100 text-sm xs:text-base md:text-lg font-medium text-center mb-2">On appuie, on sur-sature, on découpe. Le track ressort plus vrai que nature.</div>
            <Link to="/book" className="mt-4 px-6 py-2 bg-yellow-400/90 text-black font-black uppercase tracking-widest rounded-full border border-yellow-900/80 shadow drop-shadow-md hover:bg-yellow-300 hover:scale-105 transition-transform">
              Masterise
            </Link>
          </div>
        </section>
        <section className="w-full mt-14 xs:mt-16 z-20 section-content">
          <h2 className="section-title text-yellow-400 text-2xl md:text-4xl mb-5">Artistes de la cave</h2>
          <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 gap-5 xs:gap-7">
            {artistImages.map((artist) => (
              <div key={artist.name} className="rounded-xl overflow-hidden bg-black/90 border border-yellow-400/40 shadow-2xl flex flex-col items-center pb-2 hover:scale-105 transition-transform">
                <img src={artist.src} alt={artist.name} className="w-full object-cover aspect-square grayscale-[65%] hover:grayscale-0 duration-300 shadow-xl" />
                <div className="pt-2 text-md sm:text-lg font-black text-yellow-400 uppercase tracking-wider truncate max-w-[95%] mx-auto text-center font-grunge">{artist.name}</div>
              </div>
            ))}
          </div>
        </section>
        <footer className="w-full flex justify-center items-center py-7 mt-16 xs:mt-24 text-xs xs:text-sm text-yellow-300/60 font-grunge uppercase tracking-widest z-20">
          © 2024 - MTNR Cave Studio. Fait maison, sert la vibe underground — Geneva/France.
        </footer>
      </div>
      <ParallaxBg />
    </>
  );
}
