import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { Suspense, useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { ParticleEffect } from "./components/effects/ParticleEffect"
import { TorchProvider, useTorch } from "./components/effects/TorchContext"
import { UVModeProvider, useUVMode } from "./components/effects/UVModeContext"
import { TorchToggle, recordArtistsVisit } from "./components/effects/TorchToggle"
import TorchIndicator from "./components/effects/TorchIndicator"
import { NavigationProvider } from "./components/effects/NavigationContext"
import Home from "./pages/Home"
import Artists from "./pages/Artists"
import Contact from "./pages/Contact"
import NotFound from "./pages/NotFound"
import WhatWeDo from "./pages/WhatWeDo"
import Book from "./pages/Book"
import PageTransition from "./components/PageTransition"
import PageTransitionEffect from "./components/PageTransitionEffect"
import { checkFeatureSupport } from "@/lib/feature-detection"
import Navbar from "./components/Navbar"
import ParallaxScene from "./components/ParallaxScene"
import UVPageSecrets from "./components/effects/UVPageSecrets"
import VideoSplash from "./components/VideoSplash"
import { NavigationEventsProvider } from "./providers/NavigationEvents"
import { CyberpunkLoader, LoaderScrim } from "./components/CyberpunkLoader"
import { useAssetPreloader } from "./hooks/useAssetPreloader"
import { cn } from "./lib/utils"

const queryClient = new QueryClient()

type RouteListener = (path: string) => void
const routeListeners = new Set<RouteListener>()

const subscribeToRouteChanges = (listener: RouteListener) => {
  routeListeners.add(listener)
  return () => routeListeners.delete(listener)
}

const emitRouteChange = (path: string) => {
  routeListeners.forEach((listener) => listener(path))
}

const UVCornerLabel = () => {
  const { uvMode } = useUVMode()
  const { isTorchActive } = useTorch()

  if (!isTorchActive || !uvMode) return null

  return <div className="uv-corner-label">UV</div>
}

const RouteTracker = () => {
  const location = useLocation()

  useEffect(() => {
    recordArtistsVisit(location.pathname)
  }, [location.pathname])

  return null
}

const RouteAnnouncer = () => {
  const location = useLocation()

  useEffect(() => {
    emitRouteChange(location.pathname)
  }, [location.pathname])

  return null
}

function AppContent() {
  const location = useLocation()
  const [showLoader, setShowLoader] = useState(true)

  const assetsToPreload = useMemo(
    () => [
      { type: "video" as const, src: "/lovable-uploads/videonormale.mp4" },
      { type: "video" as const, src: "/lovable-uploads/videouv.mp4" },
      { type: "image" as const, src: "/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png" },
      { type: "image" as const, src: "/lovable-uploads/paint-splatter-hi.png" },
      { type: "image" as const, src: "/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png" },
      { type: "image" as const, src: "/lovable-uploads/yellow-watercolor-splatter-3.png" },
      { type: "image" as const, src: "/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png" },
    ],
    [],
  )

  const { progress, isLoaded } = useAssetPreloader(assetsToPreload, {
    minimumDelay: 1400,
  })

  useEffect(() => {
    if (isLoaded) {
      const timeoutId = window.setTimeout(() => setShowLoader(false), 400)
      return () => window.clearTimeout(timeoutId)
    }
  }, [isLoaded])

  useEffect(() => {
    if (typeof document === "undefined") return
    const previousOverflow = document.body.style.overflow

    if (showLoader) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [showLoader])

  useEffect(() => {
    checkFeatureSupport('vr')
    checkFeatureSupport('ambient-light-sensor')
    checkFeatureSupport('battery')
  }, [])

  return (
    <>
      <LoaderScrim isVisible={showLoader} />
      <CyberpunkLoader progress={progress} isVisible={showLoader} />

      <div
        className={cn(
          "app-container transition-all duration-700 ease-out",
          showLoader ? "pointer-events-none opacity-0 blur-sm" : "opacity-100 blur-0",
        )}
      >
        <Navbar />

        <div className="content-container">
          <VideoSplash />
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

            <div id="uv-page-secrets-container" className="relative">
              <UVPageSecrets />
            </div>
          </PageTransition>
          <UVCornerLabel />
        </div>
      </div>
    </>
  )
}

function NavigationEventsBoundary({ children }: { children: ReactNode }) {
  const { uvMode } = useUVMode()

  const pickVideoSrc = useCallback(
    (pathname: string) => {
      if (uvMode) return "/lovable-uploads/videouv.mp4"
      return pathname.startsWith("/artists")
        ? "/lovable-uploads/videouv.mp4"
        : "/lovable-uploads/videonormale.mp4"
    },
    [uvMode]
  )

  const subscribe = useCallback((listener: RouteListener) => subscribeToRouteChanges(listener), [])

  return (
    <NavigationEventsProvider pickVideoSrc={pickVideoSrc} subscribeToRoute={subscribe}>
      {children}
    </NavigationEventsProvider>
  )
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UVModeProvider>
        <TorchProvider>
          <NavigationProvider>
            <NavigationEventsBoundary>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={null}>
                  <RouteTracker />
                  <RouteAnnouncer />
                  <AppContent />
                </Suspense>
                <TorchToggle />
                <TorchIndicator />
              </BrowserRouter>
              <ParticleEffect />
            </NavigationEventsBoundary>
          </NavigationProvider>
        </TorchProvider>
      </UVModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
