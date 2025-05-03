
import { useEffect } from "react";
import NeonText from "@/components/effects/NeonText";
import ElectricParticles from "@/components/effects/ElectricParticles";
import UVText from "@/components/effects/UVText";
import { PageSplashes } from "@/components/effects/PageSplashes";

export default function WhatWeDo() {
  // Ne pas forcer le scroll au chargement pour permettre à l'utilisateur de contrôler
  useEffect(() => {
    // Débloquer le défilement explicitement
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    // Débloquer tous les conteneurs potentiels
    const scrollableElements = document.querySelectorAll('.content-container, #main-content, .page-content-wrapper');
    scrollableElements.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.overflowY = 'auto';
        el.style.height = 'auto';
      }
    });
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-auto pb-20">
      {/* Splash spécifiques à la page "What We Do" */}
      <PageSplashes pageVariant="whatwedo" />
      
      <div className="relative z-10 min-h-screen overflow-auto">
        <main className="min-h-screen w-full flex flex-col items-center pt-20 xs:pt-24 md:pt-32 pb-16 px-3 xs:px-6 font-grunge overflow-auto">
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
              
              {/* Contenu supplémentaire pour tester le défilement */}
              <div className="mt-20 p-8 bg-yellow-900/30 rounded-lg">
                <h3 className="text-3xl text-yellow-400 mb-6">Nos valeurs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-4 border border-yellow-500/30 rounded">
                    <h4 className="text-xl text-yellow-300 mb-3">Authenticité</h4>
                    <p className="text-white/70">
                      Nous privilégions toujours la vérité du son et de l'image,
                      sans artifices inutiles ni effets à la mode qui passeront.
                      La substance avant l'apparence, toujours.
                    </p>
                  </div>
                  <div className="p-4 border border-yellow-500/30 rounded">
                    <h4 className="text-xl text-yellow-300 mb-3">Communauté</h4>
                    <p className="text-white/70">
                      Le studio n'est pas qu'un lieu de travail, c'est un point de ralliement
                      pour les esprits créatifs qui partagent notre vision et notre éthique.
                      Ensemble, nous sommes plus forts.
                    </p>
                  </div>
                  <div className="p-4 border border-yellow-500/30 rounded">
                    <h4 className="text-xl text-yellow-300 mb-3">Innovation</h4>
                    <p className="text-white/70">
                      Nous n'avons pas peur d'expérimenter, de casser les règles et
                      de créer de nouvelles approches. C'est dans la rupture
                      que naissent les plus belles créations.
                    </p>
                  </div>
                  <div className="p-4 border border-yellow-500/30 rounded">
                    <h4 className="text-xl text-yellow-300 mb-3">Persévérance</h4>
                    <p className="text-white/70">
                      Les meilleurs projets demandent du temps et de l'effort.
                      Nous croyons en la valeur du travail acharné et de la patience
                      pour atteindre l'excellence.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-20 mb-20">
                <h3 className="text-2xl text-yellow-400 mb-6">Contactez-nous</h3>
                <p className="text-white/80 mb-10">
                  Vous souhaitez en savoir plus sur nos services ou discuter d'un projet ?
                  N'hésitez pas à nous contacter. Nous sommes toujours ouverts
                  aux nouvelles collaborations et aux idées fraîches.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
