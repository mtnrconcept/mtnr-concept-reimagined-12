
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense } from "react";
import { Flashlight } from "./components/effects/Flashlight";
import { ParticleEffect } from "./components/effects/ParticleEffect";
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
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={null}>
          <AnimatedRoutes />
        </Suspense>
      </BrowserRouter>
      <ParticleEffect />
      <Flashlight />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
