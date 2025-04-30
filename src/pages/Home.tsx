
import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import StudioSection from "@/components/home/StudioSection";
import ServicesSection from "@/components/home/ServicesSection";
import ArtistsSection from "@/components/home/ArtistsSection";
import UVHiddenMessage from "@/components/effects/UVHiddenMessage";
import { useUVMode } from "@/components/effects/UVModeContext";
import UVText from "@/components/effects/UVText";

export default function Home() {
  const { uvMode } = useUVMode();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="relative z-20 flex flex-col min-h-screen w-full">
        <Navbar />
        
        <main id="main-content" className="flex-grow w-full">
          <HeroSection />
          <StudioSection />
          <ServicesSection />
          <ArtistsSection />

          <footer className="container mx-auto py-10 text-center text-sm text-yellow-400/80 uppercase tracking-widest relative">
            © 2024 - MTNR Cave Studio. Fait maison, sert la vibe underground — Geneva/France.
            
            {/* UV-only text that appears when UV mode is active */}
            <UVText 
              text="Powered by raw underground energy"
              hiddenText="ACCESS CODE: MTNR-2024"
              className="mt-4 block"
              uvColor="#D2FF3F"
            />
            
            {/* Hidden UV messages */}
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
            
            {uvMode && (
              <div className="absolute -bottom-8 right-4 text-[0.65rem] text-blue-400/70 font-mono tracking-widest animate-pulse">
                UV_MODE_ACTIVE::SECRET_DISPLAY::ENABLED
              </div>
            )}
          </footer>
        </main>
      </div>
    </div>
  );
}
