
import React, { ReactNode, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { createSmokeEffect } from "@/lib/transitions";
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
  }, [location.pathname]);

  const handleDisperseComplete = () => {
    console.log('Dispersion terminée, application de l\'effet de fumée');
    // OptimizedDisperseLogo a terminé la dispersion et attendu 500ms
    // Nous pouvons maintenant appliquer l'effet de fumée à la page
    if (contentRef.current) {
      createSmokeEffect(contentRef.current);
    }
    
    // Réinitialiser l'état de chargement
    setIsLoading(false);
  };

  return (
    <>
      {/* Logo avec dispersion et callback de fin */}
      <OptimizedDisperseLogo onTransitionComplete={handleDisperseComplete} />

      <AnimatePresence mode="wait">
        <motion.div
          key={keyId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: -10,
              transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] },
            }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
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
