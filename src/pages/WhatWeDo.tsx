
import { useEffect } from "react";
import NeonText from "@/components/effects/NeonText";
import ElectricParticles from "@/components/effects/ElectricParticles";
import UVText from "@/components/effects/UVText";
import { PageSplashes } from "@/components/effects/PageSplashes";

export default function WhatWeDo() {
  // S'assurer que le défilement fonctionne correctement
  useEffect(() => {
    // Débloquer le défilement sur toute la page
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    // Débloquer tous les conteneurs potentiels
    setTimeout(() => {
      const containers = document.querySelectorAll('.content-container, #main-content, .page-content-wrapper');
      containers.forEach(container => {
        (container as HTMLElement).style.overflowY = 'auto';
        (container as HTMLElement).style.height = 'auto';
      });
    }, 500);
  }, []);

  return (
    <div className="scrollable-section w-full pb-20">
      {/* Splash spécifiques à la page "What We Do" */}
      <PageSplashes pageVariant="whatwedo" />
      
      <div className="relative z-10 min-h-screen">
        <main className="min-h-screen w-full flex flex-col items-center pt-20 xs:pt-24 md:pt-32 pb-16 px-3 xs:px-6 font-grunge overflow-y-auto">
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
            
            {/* Ajout de contenu supplémentaire pour tester le défilement */}
            <div className="mt-10 bg-black/60 p-6 border border-yellow-500/20">
              <h3 className="text-2xl text-yellow-400 mb-4">Notre histoire</h3>
              <p className="text-white/80 mb-6">
                MTNR Studio est né dans les sous-sols de la ville, loin des regards,
                là où l'authenticité peut exister sans compromis. Notre histoire est celle
                d'une passion brute pour le son et l'image, cultivée dans l'ombre
                et maintenant prête à irradier au-delà des cercles underground.
              </p>
              <p className="text-white/80 mb-6">
                Chaque projet qui traverse nos murs devient une signature unique,
                une empreinte que nous laissons collectivement dans le paysage créatif.
              </p>
              <h3 className="text-2xl text-yellow-400 mt-8 mb-4">Ce qui nous anime</h3>
              <p className="text-white/80">
                La recherche constante de cette vibration parfaite, ce moment où 
                la technique rencontre l'émotion et génère quelque chose qui transcende
                les deux. C'est ce que nous poursuivons, jour après jour, session après session.
              </p>
            </div>
            
            {/* Contenu de test supplémentaire pour assurer que le défilement fonctionne */}
            <div className="mt-10 mb-20 p-6 bg-yellow-900/20 border border-yellow-500/30">
              <h3 className="text-2xl text-yellow-400 mb-4">Notre équipement</h3>
              <p className="text-white/80 mb-6">
                Un mélange soigneusement sélectionné d'équipement vintage et moderne.
                Des préamplis à lampes aux convertisseurs numériques dernière génération,
                nous cherchons toujours le meilleur son, pas le plus cher.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="bg-black/60 p-4 rounded-lg">
                  <h4 className="text-yellow-300 mb-2">Préamplis</h4>
                  <ul className="text-gray-300 list-disc pl-5 space-y-1">
                    <li>Neve 1073 (modifié)</li>
                    <li>API 512c</li>
                    <li>Universal Audio 610</li>
                    <li>Préamplis DIY signature MTNR</li>
                  </ul>
                </div>
                
                <div className="bg-black/60 p-4 rounded-lg">
                  <h4 className="text-yellow-300 mb-2">Micros</h4>
                  <ul className="text-gray-300 list-disc pl-5 space-y-1">
                    <li>Neumann U87</li>
                    <li>Shure SM7B</li>
                    <li>AKG C414</li>
                    <li>Collection de micros soviétiques rares</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <p className="text-white/70 italic">
                  "C'est pas l'équipement qui fait le son, c'est les oreilles et l'âme"
                </p>
                <p className="text-yellow-400 mt-1">— Fondateur de MTNR</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
