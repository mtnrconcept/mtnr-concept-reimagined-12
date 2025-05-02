
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
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
import PageTransition from "./components/PageTransition";
import { checkFeatureSupport } from "@/lib/feature-detection";
import BackgroundVideoController from "./components/effects/BackgroundVideoController";
import BackgroundVideo from "./components/effects/BackgroundVideo";

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
    checkFeatureSupport('vr');
    checkFeatureSupport('ambient-light-sensor');
    checkFeatureSupport('battery');
  }, []);
  
  return (
    <>
      {/* Vidéo de fond qui est maintenant en arrière-plan de toutes les pages */}
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
            <NavigationProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={null}>
                  <BackgroundVideoController />
                  <AnimatedRoutes />
                </Suspense>
              </BrowserRouter>
              <TorchToggle />
            </NavigationProvider>
          </Torch3DProvider>
        </TorchProvider>
      </UVModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
