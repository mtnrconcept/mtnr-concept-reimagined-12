
import { useEffect } from "react";
import NeonText from "@/components/effects/NeonText";
import ElectricParticles from "@/components/effects/ElectricParticles";
import UVText from "@/components/effects/UVText";
import { PageSplashes } from "@/components/effects/PageSplashes";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Footer from "@/components/Footer";

export default function WhatWeDo() {
  // Force scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Splash spécifiques à la page "What We Do" */}
      <PageSplashes pageVariant="whatwedo" />
      
      <div className="relative z-10 min-h-screen">
        <main className="min-h-screen w-full flex flex-col items-center pt-20 xs:pt-24 md:pt-32 pb-16 px-3 xs:px-6 font-grunge">
          <div className="w-full max-w-4xl">
            <div className="relative">
              <NeonText text="Notre Vibe" className="text-3xl xs:text-4xl md:text-6xl mb-6 xs:mb-10 text-center" color="yellow" flicker={true} />
              <ElectricParticles targetSelector=".neon-text" color="#ffdd00" quantity={12} />
            </div>
            
            <div className="bg-black/80 grunge-border paper-texture px-5 xs:px-7 py-7 xs:py-8 md:py-10 mx-auto font-grunge text-gray-200 text-base xs:text-lg md:text-xl leading-relaxed shadow-xl" style={{ isolation: 'isolate' }}>
              <UVText 
                text={<b className="text-yellow-400 font-extrabold">MTNR Studio</b>}
                hiddenText="MTNR - CODE SECRET"
                uvColor="#7E69AB"
              />
              , c'est le choix de la marge.<br />
              On crée sans limite, on enregistre dans la sueur, on partage la ride.<br /><br />
              
              <ul className="list-disc ml-6 space-y-3 font-bold text-yellow-400" style={{ position: 'relative', zIndex: 15 }}>
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
              
              {/* Nouvelles sections avec accordéons */}
              <div className="mt-12 space-y-8" style={{ position: 'relative', zIndex: 15 }}>
                <h2 className="text-2xl xs:text-3xl font-bold text-yellow-400 mb-4">Ce qu'on propose</h2>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="enregistrement" className="border-yellow-400/30">
                    <AccordionTrigger className="text-xl font-bold">
                      <UVText 
                        text="Enregistrement"
                        hiddenText="ENREGISTREMENT CRYPTÉ"
                        uvColor="#4FA9FF"
                      />
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p className="mb-3">Notre cabine traitée acoustiquement capture chaque nuance de ta voix ou instrument. Micro Neumann TLM 103, préamp Neve, monitoring précis.</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Prise de son méticuleuse adaptée à ton style</li>
                        <li>Support technique discret, on te laisse dans ta zone</li>
                        <li>Sessions flexibles, pas de pression sur l'horloge</li>
                        <li>Exports multiples pour travailler tes stems</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="mixage" className="border-yellow-400/30">
                    <AccordionTrigger className="text-xl font-bold">
                      <UVText 
                        text="Mixage"
                        hiddenText="MIXAGE SUBLIMINALE"
                        uvColor="#D2FF3F"
                      />
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p className="mb-3">Ton son prend vie entre nos mains. On sculpte l'équilibre parfait, on creuse la stéréo, on injecte la chaleur analogique qui va faire la différence.</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Balance précise de chaque élément</li>
                        <li>Traitement dynamique pour un impact maximum</li>
                        <li>Spatialisation immersive</li>
                        <li>Coloration vintage ou clarté hyper-moderne</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="mastering" className="border-yellow-400/30">
                    <AccordionTrigger className="text-xl font-bold">
                      <UVText 
                        text="Mastering"
                        hiddenText="NIVEAU ULTIME"
                        uvColor="#00FFBB"
                      />
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p className="mb-3">L'étape finale qui transcende ton mix. On optimise, on équilibre, on donne le volume et l'énergie nécessaires pour que ton track explose sur tous les systèmes.</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Loudness optimisé pour les plateformes de streaming</li>
                        <li>Cohérence spectrale parfaite</li>
                        <li>Équilibre tonal ciselé</li>
                        <li>Conversion haute résolution</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="prod" className="border-yellow-400/30">
                    <AccordionTrigger className="text-xl font-bold">
                      <UVText 
                        text="Production musicale"
                        hiddenText="CODES SOURCES"
                        uvColor="#D946EF"
                      />
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <p className="mb-3">On part de ton concept pour créer l'univers sonore qui t'appartient vraiment. Composition, arrangement, sound design - on plonge à fond dans ta vision.</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Création d'instrumentales sur mesure</li>
                        <li>Co-écriture de morceaux</li>
                        <li>Direction artistique complète</li>
                        <li>Développement de ton identité sonore</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Notre approche */}
                <div className="mt-12">
                  <h2 className="text-2xl xs:text-3xl font-bold text-yellow-400 mb-4">Notre approche</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="bg-black/60 p-4 rounded border border-yellow-400/25">
                      <h3 className="text-xl font-bold mb-2 text-white">Authenticité</h3>
                      <p>On défend l'honnêteté artistique avant tout. Pas de formules préfabriquées, chaque projet évolue selon sa propre nature.</p>
                    </div>
                    <div className="bg-black/60 p-4 rounded border border-yellow-400/25">
                      <h3 className="text-xl font-bold mb-2 text-white">Communauté</h3>
                      <p>Le studio est un hub créatif où les artistes se rencontrent, échangent et évoluent ensemble. On crée des ponts, pas des murs.</p>
                    </div>
                    <div className="bg-black/60 p-4 rounded border border-yellow-400/25">
                      <h3 className="text-xl font-bold mb-2 text-white">Expérimentation</h3>
                      <p>Parfois faut casser les règles. On pousse les limites de la technique pour trouver des sonorités uniques qui te démarqueront.</p>
                    </div>
                    <div className="bg-black/60 p-4 rounded border border-yellow-400/25">
                      <h3 className="text-xl font-bold mb-2 text-white">Indépendance</h3>
                      <p>Auto-produit, auto-géré. On garde le contrôle total sur notre processus pour garantir l'intégrité artistique de chaque projet.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <span className="block font-black text-white mt-10 text-xl xs:text-2xl" style={{ position: 'relative', zIndex: 15 }}>
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
        <Footer />
      </div>
    </div>
  );
}
