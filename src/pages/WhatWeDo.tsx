
import ParallaxBg from "@/components/ParallaxBg";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";

export default function WhatWeDo() {
  // Force scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <ParallaxBg>
      <Navbar />
      <div className="min-h-screen w-full flex flex-col items-center pt-20 xs:pt-24 md:pt-32 pb-16 px-3 xs:px-6 font-grunge">
        <div className="w-full max-w-4xl z-10">
          <h1 className="text-primary text-3xl xs:text-4xl md:text-6xl mb-6 xs:mb-10 uppercase text-center font-black drop-shadow-lg" style={{ letterSpacing: "0.16em" }}>
            Notre Vibe
          </h1>
          
          <div className="bg-black/80 grunge-border paper-texture px-5 xs:px-7 py-7 xs:py-8 md:py-10 mx-auto font-grunge text-gray-200 text-base xs:text-lg md:text-xl leading-relaxed shadow-xl">
            <b className="text-yellow-400 font-extrabold">MTNR Studio</b>, c'est le choix de la marge.<br />
            On crée sans limite, on enregistre dans la sueur, on partage la ride.<br /><br />
            
            <ul className="list-disc ml-6 space-y-3 font-bold text-yellow-400">
              <li>Studio accessible à tous, on casse les codes : no bling, que du vrai.</li>
              <li>Ambiance home-made : murs rough, lampes chaudes, matos old-school tweaké à l'os.</li>
              <li>Crew fraternel : chacun amène sa folie et repart avec une vibe unique.</li>
              <li>On valorise le process : l'art, c'est la trace qu'on laisse. Les erreurs font le style.</li>
            </ul>
            
            <span className="block font-black text-white mt-7 text-xl xs:text-2xl">Rejoignez la ride.<br />Le son prend vie dans la cave.</span>
          </div>
        </div>
      </div>
    </ParallaxBg>
  );
}
