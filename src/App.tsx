
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { ParticleEffect } from "./components/effects/ParticleEffect";
import { TorchProvider, useTorch } from "./components/effects/TorchContext";
import { UVModeProvider, useUVMode } from "./components/effects/UVModeContext";
import { TorchToggle } from "./components/effects/TorchToggle";
import Home from "./pages/Home";
import Artists from "./pages/Artists";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import WhatWeDo from "./pages/WhatWeDo";
import Book from "./pages/Book";
import PageTransition from "./components/PageTransition";
import PageTransitionEffect from "./components/PageTransitionEffect";
import { checkFeatureSupport } from "@/lib/feature-detection";

// Component to display UV label
const UVCornerLabel = () => {
  const { uvMode } = useUVMode();
  
  if (!uvMode) return null;
  
  return (
    <div className="uv-corner-label">UV</div>
  );
};

function AnimatedRoutes() {
  const location = useLocation();
  
  // Run feature detection once on component mount
  useEffect(() => {
    // Pre-check common features to avoid console errors
    checkFeatureSupport('vr');
    checkFeatureSupport('ambient-light-sensor');
    checkFeatureSupport('battery');
  }, []);
  
  return (
    <>
      <PageTransitionEffect />
      <PageTransition keyId={location.pathname}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/what-we-do" element={<WhatWeDo />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/book" element={<Book />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
      <UVCornerLabel />
    </>
  );
}

// Suiveur de curseur pour mettre à jour les variables CSS utilisées par le masque UV
const MouseTracker = () => {
  const { mousePosition, isTorchActive } = useTorch();
  const { uvMode } = useUVMode();

  useEffect(() => {
    if (isTorchActive || uvMode) {
      const updatePosition = () => {
        document.documentElement.style.setProperty('--mx', `${mousePosition.x}px`);
        document.documentElement.style.setProperty('--my', `${mousePosition.y}px`);
        document.documentElement.style.setProperty('--x', `${mousePosition.x}px`);
        document.documentElement.style.setProperty('--y', `${mousePosition.y}px`);
        document.documentElement.style.setProperty('--cursor-x', `${mousePosition.x}px`);
        document.documentElement.style.setProperty('--cursor-y', `${mousePosition.y}px`);
      };
      
      updatePosition();
      
      // Pour un suivi plus fluide
      window.addEventListener('mousemove', updatePosition);
      return () => window.removeEventListener('mousemove', updatePosition);
    }
  }, [mousePosition, isTorchActive, uvMode]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UVModeProvider>
        <TorchProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={null}>
              <AnimatedRoutes />
            </Suspense>
          </BrowserRouter>
          <ParticleEffect />
          <TorchToggle />
          <MouseTracker />
        </TorchProvider>
      </UVModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

// Initialize query client outside of component for stability
const queryClient = new QueryClient();

export default App;
