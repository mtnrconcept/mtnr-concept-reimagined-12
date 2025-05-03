
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ParticleEffect } from "./components/effects/ParticleEffect";
import { TorchProvider, useTorch } from "./components/effects/TorchContext";
import { UVModeProvider, useUVMode } from "./components/effects/UVModeContext";
import { TorchToggle } from "./components/effects/TorchToggle";
import { NavigationProvider } from "./components/effects/NavigationContext";
import Home from "./pages/Home";
import Artists from "./pages/Artists";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import WhatWeDo from "./pages/WhatWeDo";
import Book from "./pages/Book";
import PageTransition from "./components/PageTransition";
import PageTransitionEffect from "./components/PageTransitionEffect";
import { checkFeatureSupport } from "@/lib/feature-detection";
import BackgroundVideoController from "./components/effects/BackgroundVideoController";
import BackgroundVideo from "./components/effects/BackgroundVideo";
import Navbar from "./components/Navbar";
import ParallaxScene from "./components/ParallaxScene";
import UVPageSecrets from "./components/effects/UVPageSecrets";
import LoadingScreen from "./components/LoadingScreen";
import { initializePreloader } from "./lib/preloader";
import { Progress } from "./components/ui/progress";

// Initialize query client outside of component for stability
const queryClient = new QueryClient();

// Component to display UV label
const UVCornerLabel = () => {
  const { uvMode } = useUVMode();
  const { isTorchActive } = useTorch();
  
  if (!isTorchActive || !uvMode) return null;
  
  return (
    <div className="uv-corner-label">UV</div>
  );
};

// Séparation de la structure pour isoler la Navbar des animations
function AppContent() {
  const location = useLocation();
  
  // Run feature detection once on component mount
  useEffect(() => {
    // Pre-check common features to avoid console errors
    checkFeatureSupport('vr');
    checkFeatureSupport('ambient-light-sensor');
    checkFeatureSupport('battery');
    
    // S'assurer que le document peut défiler
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    document.body.style.height = 'auto';
  }, []);
  
  return (
    <div className="app-container min-h-screen">
      {/* La navbar est maintenant à l'extérieur de toutes les transitions */}
      <Navbar />
      
      <div className="content-container">
        {/* Une seule vidéo de fond au niveau de l'application */}
        <BackgroundVideo 
          videoUrl="/lovable-uploads/videonormale.mp4"
          videoUrlUV="/lovable-uploads/videouv.mp4"
        />
        
        {/* Ajout du ParallaxScene au niveau de l'App pour qu'il soit disponible sur toutes les pages */}
        <ParallaxScene />
        
        <PageTransitionEffect />
        <PageTransition keyId={location.pathname}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/what-we-do" element={<WhatWeDo />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book" element={<Book />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Le conteneur des secrets UV est maintenant dans le flux de la page */}
          <div id="uv-page-secrets-container" className="relative">
            <UVPageSecrets />
          </div>
        </PageTransition>
        <UVCornerLabel />
      </div>
    </div>
  );
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Effectuez le préchargement initial au chargement de l'application
  useEffect(() => {
    // S'assurer que le scroll est activé globalement
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    document.body.style.height = 'auto';
    
    // Fonction pour initialiser l'application
    const initialize = async () => {
      try {
        // Démarrer un timer pour simuler la progression
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 2;
          if (progress > 90) progress = 90;
          setLoadingProgress(Math.floor(progress));
        }, 100);
        
        // Démarrage du processus de préchargement
        await initializePreloader();
        clearInterval(interval);
        
        // Progression complète
        setLoadingProgress(100);
        setLoadingComplete(true);
        
        // Ajouter un délai minimum pour l'écran de chargement
        setTimeout(() => {
          setIsLoading(false);
        }, 2000); // Maintenir 2 secondes pour que l'utilisateur voie la progression à 100%
      } catch (error) {
        console.error("Erreur lors de l'initialisation:", error);
        // En cas d'erreur, on affiche quand même le site
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UVModeProvider>
          <TorchProvider>
            <NavigationProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={null}>
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <LoadingScreen 
                        key="loading-screen"
                        progress={loadingProgress}
                        onLoadingComplete={() => setIsLoading(false)} 
                      />
                    ) : (
                      <>
                        <BackgroundVideoController />
                        <AppContent />
                        <ParticleEffect />
                        <TorchToggle />
                      </>
                    )}
                  </AnimatePresence>
                </Suspense>
              </BrowserRouter>
            </NavigationProvider>
          </TorchProvider>
        </UVModeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
