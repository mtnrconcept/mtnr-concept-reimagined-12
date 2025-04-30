
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
import { Torch3DProvider } from "./components/effects/Torch3DContext";
import Home from "./pages/Home";
import Artists from "./pages/Artists";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import WhatWeDo from "./pages/WhatWeDo";
import Book from "./pages/Book";
import PageTransition from "./components/PageTransition";
import PageTransitionEffect from "./components/PageTransitionEffect";
import { checkFeatureSupport } from "@/lib/feature-detection";
import BackgroundVideoManager from "./components/effects/BackgroundVideoManager";

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
      <BackgroundVideoManager 
        normalVideoSrc="/lovable-uploads/Video fond normale.mp4" 
        uvVideoSrc="/lovable-uploads/Video fond UV.mp4" 
      />
      <PageTransition keyId={location.pathname}>
        <Routes location={location}>
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UVModeProvider>
        <TorchProvider>
          <Torch3DProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={null}>
                <AnimatedRoutes />
              </Suspense>
            </BrowserRouter>
            <ParticleEffect />
            <TorchToggle />
          </Torch3DProvider>
        </TorchProvider>
      </UVModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
