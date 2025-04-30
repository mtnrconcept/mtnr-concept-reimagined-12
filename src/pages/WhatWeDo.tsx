
import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import NeonText from "@/components/effects/NeonText";
import ElectricParticles from "@/components/effects/ElectricParticles";
import UVText from "@/components/effects/UVText";
import BackgroundVideo from "@/components/effects/BackgroundVideo";

export default function WhatWeDo() {
  // Force scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Vidéo de fond d'escalier */}
      <BackgroundVideo />
      
      <div className="relative z-10 min-h-screen">
        <Navbar />
        <main className="min-h-screen w-full flex flex-col items-center pt-20 xs:pt-24 md:pt-32 pb-16 px-3 xs:px-6 font-grunge">
          <div className="w-full max-w-4xl">
            <div className="relative px-[103px]">
              <NeonText text="Notre Vibe" className="text-3xl xs:text-4xl md:text-6xl mb-6 xs:mb-10 text-center" color="yellow" flicker={true} />
              <ElectricParticles targetSelector=".neon-text" color="#ffdd00" quantity={12} />
            </div>
            
            <div className="bg-black/80 grunge-border paper-texture px-5 xs:px-7 py-7 xs:py-8 md:py-10 mx-auto font-grunge text-gray-200 text-base xs:text-lg md:text-xl leading-relaxed shadow-xl">
              <UVText 
                text={<b className="text-yellow-400 font-extrabold">MTNR Studio</b>}
                hiddenText="MTNR - CODE SECRET"
                uvColor="#7E69AB"
              />
              , c'est le choix de la marge.<br />
              On crée sans limite, on enregistre dans la sueur, on partage la ride.<br /><br />
              
              <ul className="list-disc ml-6 space-y-3 font-bold text-yellow-400">
                <li>
                  <UVText 
                    text="Studio accessible à tous, on casse les codes : no bling, que du vrai."
                    hiddenText="ACCESS CODE 3472 - MEMBRES UNIQUEMENT"
                    uvColor="#9b87f5"
                  />
                </li>
                <li>Ambiance home-made : murs rough, lampes chaudes, matos old-school tweaké à l'os.</li>
                <li>
                  <UVText 
                    text="Crew fraternel : chacun amène sa folie et repart avec une vibe unique."
                    hiddenText="LA FRATERNITÉ EST NOTRE ARME SECRÈTE"
                    uvColor="#D946EF"
                  />
                </li>
                <li>On valorise le process : l'art, c'est la trace qu'on laisse. Les erreurs font le style.</li>
              </ul>
              
              <span className="block font-black text-white mt-7 text-xl xs:text-2xl">
                <UVText 
                  text="Rejoignez la ride. Le son prend vie dans la cave."
                  hiddenText="REJOINS-NOUS DANS L'OMBRE - 23H30 - SOUS-SOL - CODE: MTNR"
                  uvColor="#F97316"
                  textSize="text-xl xs:text-2xl"
                />
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
