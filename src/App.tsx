
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { TorchProvider, useTorch } from "./components/effects/TorchContext";
import { UVModeProvider, useUVMode } from "./components/effects/UVModeContext";
import { TorchToggle } from "./components/effects/TorchToggle";
import { Torch3DProvider } from "./components/effects/Torch3DContext";
import { NavigationProvider } from "./components/effects/NavigationContext";
import Home from "./pages/Home";
import Artists from "./pages/Artists";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import WhatWeDo from "./pages/WhatWeDo";
import PageTransition from "@/components/PageTransition";
import { checkFeatureSupport } from "@/lib/feature-detection";
import { BackgroundVideo } from "./components/effects/BackgroundVideo";
import { useVideoPreloader } from "./hooks/useVideoPreloader";

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

// Preloader for videos with visual feedback
const VideoPreloader = () => {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  
  // Utiliser des noms de fichiers normalisés
  const { isLoading, progress } = useVideoPreloader({
    videoUrls: [
      "/lovable-uploads/video-fond-normale.mp4",
      "/lovable-uploads/video-fond-UV.mp4"
    ],
    onPreloaded: (loadedUrls) => {
      console.log("Vidéos préchargées:", loadedUrls);
      setIsPreloaded(true);
      setTimeout(() => setShowMessage(false), 1000);
    },
    showToast: true
  });
  
  if (isPreloaded && !showMessage) return null;
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 ${isPreloaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="text-center">
        <div className="mb-4 text-xl font-bold">Chargement des ressources médias...</div>
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-yellow-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-300">{Math.round(progress)}%</div>
      </div>
    </div>
  );
};

// This component needs to be inside BrowserRouter
function AnimatedRoutes() {
  const location = useLocation();
  
  // Run feature detection once on component mount
  useEffect(() => {
    checkFeatureSupport('vr');
    checkFeatureSupport('ambient-light-sensor');
    checkFeatureSupport('battery');
  }, []);
  
  return (
    <>
      {/* Unique instance of BackgroundVideo */}
      <BackgroundVideo />
      
      <PageTransition keyId={location.pathname}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/what-we-do" element={<WhatWeDo />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
      <UVCornerLabel />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UVModeProvider>
        <TorchProvider>
          <Torch3DProvider>
            <Toaster />
            <Sonner />
            <VideoPreloader />
            <BrowserRouter>
              <NavigationProvider>
                <Suspense fallback={null}>
                  <AnimatedRoutes />
                </Suspense>
              </NavigationProvider>
            </BrowserRouter>
            <TorchToggle />
          </Torch3DProvider>
        </TorchProvider>
      </UVModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
