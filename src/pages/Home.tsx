
import { useEffect, useRef } from "react";
import HeroSection from "@/components/home/HeroSection";
import StudioSection from "@/components/home/StudioSection";
import ServicesSection from "@/components/home/ServicesSection";
import ArtistsSection from "@/components/home/ArtistsSection";
import UVHiddenMessage from "@/components/effects/UVHiddenMessage";
import { useUVMode } from "@/components/effects/UVModeContext";
import UVText from "@/components/effects/UVText";
import { PageSplashes } from "@/components/effects/PageSplashes";
import Footer from "@/components/Footer";
import { useScroll } from "@/hooks/useScroll";

export default function Home() {
  const { uvMode } = useUVMode();
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Utiliser notre hook de défilement
  const { scrollPositionRef } = useScroll();
  
  useEffect(() => {
    // Permettre le défilement sur cette page
    document.body.classList.add('allow-scroll');
    
    // Ne pas forcer le scroll vers le haut pour permettre de continuer à partir de la position actuelle
    if (scrollPositionRef.current === 0) {
      window.scrollTo(0, 0);
    }
  }, [scrollPositionRef]);
  
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
    <div className="relative min-h-screen w-full overflow-x-hidden overflow-y-visible">
      {/* Intégration des éclaboussures de peinture spécifiques à la page d'accueil */}
      <PageSplashes pageVariant="home" />
      
      <div className="relative z-20 flex flex-col min-h-screen w-full">
        <main id="main-content" className="flex-grow w-full">
          <HeroSection />
          <StudioSection />
          <ServicesSection />
          <ArtistsSection />

          <Footer />
        </main>
      </div>
    </div>
  );
}
