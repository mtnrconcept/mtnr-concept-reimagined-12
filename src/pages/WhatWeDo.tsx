
import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import ParallaxBackground from "@/components/ParallaxBackground";
import NeonText from "@/components/effects/NeonText";
import ElectricParticles from "@/components/effects/ElectricParticles";
import NeonBorder from "@/components/effects/NeonBorder";

export default function WhatWeDo() {
  // Force scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <ParallaxBackground>
      <div className="relative z-10 min-h-screen">
        <Navbar />
        <main className="min-h-screen w-full flex flex-col items-center pt-20 xs:pt-24 md:pt-32 pb-16 px-3 xs:px-6 font-grunge">
          <div className="w-full max-w-4xl">
            <div className="relative">
              <NeonText 
                text="Notre Vibe"
                className="text-3xl xs:text-4xl md:text-6xl mb-6 xs:mb-10 text-center"
                color="yellow"
                flicker={true}
              />
              <ElectricParticles 
                targetSelector=".neon-text" 
                color="#ffdd00"
                quantity={12}
              />
            </div>
            
            <NeonBorder 
              color="yellow" 
              speed={10}
              glowIntensity="medium"
            >
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
            </NeonBorder>
          </div>
        </main>
      </div>
    </ParallaxBackground>
  );
}
