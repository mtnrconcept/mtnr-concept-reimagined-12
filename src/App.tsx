
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense } from "react";
import { ParticleEffect } from "./components/effects/ParticleEffect";
import { TorchProvider } from "./components/effects/TorchContext";
import { TorchToggle } from "./components/effects/TorchToggle";
import { Torch3DProvider } from "./components/effects/Torch3DContext";
import Home from "./pages/Home";
import Artists from "./pages/Artists";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import WhatWeDo from "./pages/WhatWeDo";
import Book from "./pages/Book";
import PageTransition from "./components/PageTransition";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  return (
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
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
