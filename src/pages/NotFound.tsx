
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import ParallaxBackground from "@/components/ParallaxBackground";
import { PageSplashes } from "@/components/effects/PageSplashes";
import Footer from "@/components/Footer";
import NeonText from "@/components/effects/NeonText";
import ElectricParticles from "@/components/effects/ElectricParticles";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <ParallaxBackground>
      <PageSplashes pageVariant="notFound" />
      
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-black/70 backdrop-blur-sm p-10 rounded-xl shadow-xl">
            <div className="relative mb-6">
              <NeonText text="404" className="text-6xl font-bold mb-4" color="yellow" flicker={true} />
              <ElectricParticles targetSelector=".neon-text" color="#ffdd00" quantity={8} />
            </div>
            <p className="text-xl text-yellow-400 mb-6">Cette page n'existe pas dans notre dimension</p>
            <a href="/" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 px-6 rounded-full transition-colors">
              Retour à l'accueil
            </a>
          </div>
        </div>
        <Footer />
      </div>
    </ParallaxBackground>
  );
};

export default NotFound;
