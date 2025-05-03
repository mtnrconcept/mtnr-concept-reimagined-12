
import { useEffect, useRef } from "react";
import HeroSection from "@/components/home/HeroSection";
import StudioSection from "@/components/home/StudioSection";
import ServicesSection from "@/components/home/ServicesSection";
import ArtistsSection from "@/components/home/ArtistsSection";
import UVHiddenMessage from "@/components/effects/UVHiddenMessage";
import { useUVMode } from "@/components/effects/UVModeContext";
import UVText from "@/components/effects/UVText";
import { PageSplashes } from "@/components/effects/PageSplashes";

export default function Home() {
  const {
    uvMode
  } = useUVMode();
  const observerRef = useRef<IntersectionObserver | null>(null);
  
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
  
  useEffect(() => {
    observerRef.current = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up', 'opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700');
      observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);
  
  return <div className="relative w-full min-h-screen overflow-auto">
      {/* Intégration des éclaboussures de peinture spécifiques à la page d'accueil */}
      <PageSplashes pageVariant="home" />
      
      <div className="relative z-20 flex flex-col w-full">
        <main id="main-content" className="flex-grow w-full overflow-auto">
          <HeroSection />
          <StudioSection />
          <ServicesSection />
          <ArtistsSection />

          {/* Section supplémentaire pour tester le défilement */}
          <div className="container mx-auto mt-16 px-4 py-10 bg-black/70">
            <h2 className="text-3xl md:text-4xl text-yellow-400 text-center mb-8">
              Nos dernières actualités
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[1, 2, 3].map(item => (
                <div key={item} className="p-5 bg-black/40 border border-yellow-500/20 rounded">
                  <h3 className="text-xl text-yellow-300 mb-3">Session live #{item}</h3>
                  <p className="text-white/80 mb-4">
                    Notre dernier événement a réuni des artistes incroyables qui ont partagé 
                    leur énergie et leur passion. Une soirée mémorable pour tous les participants.
                  </p>
                  <div className="h-40 bg-yellow-900/30 flex items-center justify-center mb-4">
                    [Photo de l'événement]
                  </div>
                  <div className="text-right">
                    <button className="px-4 py-2 border border-yellow-500 text-yellow-400 hover:bg-yellow-500/20">
                      En savoir plus
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center my-20">
              <h2 className="text-3xl md:text-4xl text-yellow-400 mb-8">
                Témoignages
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="p-6 bg-black/50 border-l-4 border-yellow-500">
                  <p className="italic text-white/90 mb-4">
                    "Travailler avec MTNR Studio a transformé notre projet. L'ambiance 
                    unique et l'expertise technique nous ont permis d'atteindre un niveau sonore 
                    que nous n'aurions jamais imaginé."
                  </p>
                  <p className="text-yellow-300 font-bold">— Alex B., Artiste</p>
                </div>
                
                <div className="p-6 bg-black/50 border-l-4 border-yellow-500">
                  <p className="italic text-white/90 mb-4">
                    "Ce qui rend MTNR spécial, c'est cette capacité à capturer l'énergie brute
                    et à la transformer en quelque chose de raffiné sans perdre son essence.
                    Un savant mélange de technique et de feeling."
                  </p>
                  <p className="text-yellow-300 font-bold">— Sarah K., Productrice</p>
                </div>
              </div>
            </div>
          </div>

          <footer className="container mx-auto py-10 text-center text-sm text-yellow-400/80 uppercase tracking-widest relative">
            © 2024 - MTNR Cave Studio. Fait maison, sert la vibe underground — Geneva/France.
            
            {/* UV-only text that appears when UV mode is active */}
            <UVText text="Powered by raw underground energy" hiddenText="ACCESS CODE: MTNR-2024" className="mt-4 block" uvColor="#D2FF3F" />
            
            {/* Hidden UV messages */}
            <UVHiddenMessage message="CODES SECRETS: STUDIO 451 • CAVE 872 • MIXAGE 339" color="#9b87f5" className="top-2 left-1/2 transform -translate-x-1/2" />
            
            <UVHiddenMessage message="RENDEZ-VOUS LE 13 TOUS LES MOIS • MINUIT • CODE VESTIMENTAIRE: NOIR" color="#D946EF" className="bottom-1 left-1/2 transform -translate-x-1/2" fontSize="0.8rem" />
            
            {uvMode && <div className="absolute -bottom-8 right-4 text-[0.65rem] text-blue-400/70 font-mono tracking-widest animate-pulse">
                UV_MODE_ACTIVE::SECRET_DISPLAY::ENABLED
              </div>}
          </footer>
        </main>
      </div>
    </div>;
}
