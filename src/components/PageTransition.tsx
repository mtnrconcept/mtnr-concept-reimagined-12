
import { motion, AnimatePresence } from "framer-motion";
import {
  ReactNode,
  useRef,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { createSmokeEffect } from "@/lib/transitions";
import { pageTransitionPreset } from "@/components/effects/smoke-presets";
import { OptimizedDisperseLogo } from "@/components/effects/OptimizedDisperseLogo";

interface PageTransitionProps {
  children: ReactNode;
  keyId: string;
}

export default function PageTransition({
  children,
  keyId,
}: PageTransitionProps) {
  const location = useLocation();
  const prevPathRef = useRef<string>(location.pathname);
  const isInitialMountRef = useRef<boolean>(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // On stocke la route précédente
  const [fromPath, setFromPath] = useState(location.pathname);

  useEffect(() => {
    // Ignorer le tout premier rendu
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevPathRef.current = location.pathname;
      return;
    }

    const prevPath = prevPathRef.current;
    setFromPath(prevPath);
    setIsLoading(true);

    // On démarre la transition
    window.pageTransitionInProgress = true;

    // Finir la transition après la durée du preset plus le délai
    const timeout = setTimeout(() => {
      window.pageTransitionInProgress = false;
    }, pageTransitionPreset.duration + 500); // Ajouté 500ms de délai

    // Mettre à jour pour le prochain changement de route
    prevPathRef.current = location.pathname;
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  const handleDisperseComplete = () => {
    // Attendre 500ms après la dispersion du logo avant d'effectuer l'effet de fumée
    setTimeout(() => {
      if (contentRef.current) {
        createSmokeEffect(contentRef.current);
      }
      
      // On désactive l'état de chargement
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      {/* Logo avec dispersion et callback de fin */}
      <OptimizedDisperseLogo onTransitionComplete={handleDisperseComplete} />

      <AnimatePresence mode="wait">
        <motion.div
          key={keyId}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="page-content-wrapper"
          style={{
            perspective: "1400px",
            willChange: "transform, opacity",
            position: "relative",
            zIndex: 10,
            transition: "opacity 0.5s ease"
          }}
        >
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 10 : 0 }}
            exit={{
              opacity: 0,
              y: -10,
              transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] },
            }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: isLoading ? 0.5 : 0 }}
            className="smoke-container"
          >
            {children}
            <div className="absolute inset-0 pointer-events-none smoke-enter-layer" />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
