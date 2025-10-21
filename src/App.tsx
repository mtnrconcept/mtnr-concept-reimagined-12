import { Suspense, useEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TorchProvider, useTorch } from "./components/effects/TorchContext"
import { UVModeProvider, useUVMode } from "./components/effects/UVModeContext"
import { TorchToggle, recordArtistsVisit } from "./components/effects/TorchToggle"
import TorchIndicator from "./components/effects/TorchIndicator"
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
import UVPageSecrets from "./components/effects/UVPageSecrets"
import { NavigationEventsProvider } from "./providers/NavigationEvents"
import VideoSplash from "./components/VideoSplash"
import { useParallax } from "./hooks/useParallax"
import { ParticleEffect } from "./components/effects/ParticleEffect"

const queryClient = new QueryClient()

const routeSubscribers = new Set<(path: string) => void>()
const subscribeToRoute = (cb: (path: string) => void) => {
  routeSubscribers.add(cb)
  return () => routeSubscribers.delete(cb)
}
const notifyRouteChange = (path: string) => {
  routeSubscribers.forEach((listener) => listener(path))
}

const pickVideoSrc = (path: string) =>
  path.startsWith("/artists") ? "/lovable-uploads/videouv.mp4" : "/lovable-uploads/videonormale.mp4"

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

const RouteChangeBridge = () => {
  const location = useLocation()

  useEffect(() => {
    notifyRouteChange(location.pathname)
  }, [location.pathname])

  return null
}

function AppShell() {
  const location = useLocation()

  useEffect(() => {
    checkFeatureSupport("vr")
    checkFeatureSupport("ambient-light-sensor")
    checkFeatureSupport("battery")
  }, [])

  useParallax({ strength: 0.25, selector: "[data-parallax]" })

  return (
    <>
      <VideoSplash />
      <RouteChangeBridge />
      <RouteTracker />
      <div className="app-container">
        <Navbar />

        <div className="content-container">
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UVModeProvider>
        <TorchProvider>
          <NavigationEventsProvider
            pickVideoSrc={pickVideoSrc}
            subscribeToRoute={subscribeToRoute}
          >
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={null}>
                <AppShell />
              </Suspense>
            </BrowserRouter>
            <TorchToggle />
            <TorchIndicator />
            <ParticleEffect />
          </NavigationEventsProvider>
        </TorchProvider>
      </UVModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
