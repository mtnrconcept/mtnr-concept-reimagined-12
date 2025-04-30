
import React, { ReactNode, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { createSmokeEffect } from "@/lib/transitions";
import { OptimizedDisperseLogo } from "@/components/effects/OptimizedDisperseLogo";
import ElevatorTransition from "@/components/effects/ElevatorTransition";
import PageContentTransition from "@/components/PageContentTransition";

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Contenu pour la transition d'ascenseur
  const [currentContent, setCurrentContent] = useState<React.ReactNode>(children);
  const [nextContent, setNextContent] = useState<React.ReactNode>(children);

  // On stocke la route précédente
  const [fromPath, setFromPath] = useState(location.pathname);

  useEffect(() => {
    // Ignorer le tout premier rendu
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevPathRef.current = location.pathname;
      return;
    }

    // Détecter les changements de route et activer la transition
    if (location.pathname !== prevPathRef.current) {
      setIsTransitioning(true);
      setFromPath(prevPathRef.current);
      
      // Mettre à jour le contenu pour la transition
      setCurrentContent(children);
      setNextContent(children);
      
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname, children]);

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

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    console.log('Transition d\'ascenseur terminée');
  };

  return (
    <>
      {/* Logo avec dispersion et callback de fin */}
      <OptimizedDisperseLogo onTransitionComplete={handleDisperseComplete} />

      {/* Effet d'ascenseur */}
      <ElevatorTransition 
        current={currentContent}
        next={nextContent}
        isActive={isTransitioning}
        onAnimationComplete={handleTransitionComplete}
      />

      {/* Utilisation du nouveau composant de transition */}
      <PageContentTransition>
        <motion.div
          ref={contentRef}
          className="page-content-wrapper"
          style={{
            perspective: "1400px",
            willChange: "transform, opacity",
            position: "relative",
            zIndex: 10
          }}
        >
          {children}
        </motion.div>
      </PageContentTransition>
    </>
  );
}
