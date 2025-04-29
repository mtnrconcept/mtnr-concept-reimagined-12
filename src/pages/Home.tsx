
import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Parallax3DScene from "@/components/Parallax3DScene";
import HeroSection from "@/components/home/HeroSection";
import StudioSection from "@/components/home/StudioSection";
import ServicesSection from "@/components/home/ServicesSection";
import ArtistsSection from "@/components/home/ArtistsSection";
import UVHiddenMessage from "@/components/effects/UVHiddenMessage";

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const observerRef = useRef<IntersectionObserver | null>(null);
  
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

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black">
      <Parallax3DScene />
      
      <div className="relative z-20 flex flex-col min-h-screen w-full">
        <Navbar />
        
        <main id="main-content" className="flex-grow w-full">
          <HeroSection />
          <StudioSection />
          <ServicesSection />
          <ArtistsSection />

          <footer className="container mx-auto py-10 text-center text-sm text-yellow-400/80 uppercase tracking-widest relative">
            © 2024 - MTNR Cave Studio. Fait maison, sert la vibe underground — Geneva/France.
            
            {/* Messages cachés UV */}
            <UVHiddenMessage 
              message="CODES SECRETS: STUDIO 451 • CAVE 872 • MIXAGE 339"
              color="#9b87f5"
              className="top-2 left-1/2 transform -translate-x-1/2"
            />
            
            <UVHiddenMessage 
              message="RENDEZ-VOUS LE 13 TOUS LES MOIS • MINUIT • CODE VESTIMENTAIRE: NOIR"
              color="#D946EF"
              className="bottom-1 left-1/2 transform -translate-x-1/2"
              fontSize="0.8rem"
            />
          </footer>
        </main>
      </div>
    </div>
  );
}
