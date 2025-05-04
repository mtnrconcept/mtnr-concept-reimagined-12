
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { safeBlur } from "@/lib/animation-utils";

interface PageContentTransitionProps {
  children: React.ReactNode;
}

const PageContentTransition: React.FC<PageContentTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [isInitialPageLoad, setIsInitialPageLoad] = useState(true);

  useEffect(() => {
    // Pour le chargement initial ou rafraîchissement, utiliser une simple animation de fondu
    if (isInitialPageLoad) {
      // Rendre le contenu immédiatement visible avec une animation de fondu
      setContentVisible(true);
      setDisplayChildren(children);
      
      // Marquer que le premier chargement est terminé
      setTimeout(() => {
        setIsInitialPageLoad(false);
      }, 100);
      
      return;
    }
    
    // Pour les changements de route normaux, utiliser l'animation complète
    setIsTransitioning(true);
    setContentVisible(false);

    // Délai pour changer le contenu pendant la transition
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      
      setTimeout(() => {
        setContentVisible(true);
      }, 0);
      
    }, 3000);

    return () => clearTimeout(timer);
  }, [children, location, isInitialPageLoad]);

  // Variantes d'animation différentes selon le type de chargement
  const contentVariants = {
    initial: (isInitial: boolean) => ({
      opacity: isInitial ? 0 : 0,
      y: isInitial ? 0 : "100vh", // Pas de mouvement vertical au chargement initial
      filter: isInitial ? "blur(0px)" : "blur(12px)"
    }),
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        opacity: { 
          duration: isInitialPageLoad ? 1.0 : 3.0, 
          ease: "easeOut" 
        },
        y: { 
          duration: isInitialPageLoad ? 0 : 3.5, 
          ease: [0.05, 0.2, 0.2, 1.0] 
        },
        filter: { 
          duration: isInitialPageLoad ? 1.0 : 3.0, 
          ease: [0.1, 0.4, 0.2, 1.0] 
        }
      }
    },
    exit: {
      opacity: 0,
      y: "-100vh",
      filter: "blur(12px)",
      transition: {
        opacity: { duration: 4.1, ease: [0.33, 1, 0.68, 1] },
        y: { 
          duration: 3.5,
          ease: [0.05, 0.1, 0.9, 1.0]
        },
        filter: { duration: 2.9, ease: [0.33, 1, 0.68, 1] }
      }
    }
  };

  return (
    <AnimatePresence mode="wait" onExitComplete={() => setIsTransitioning(false)}>
      <motion.div
        key={location.pathname}
        custom={isInitialPageLoad}
        variants={contentVariants}
        initial="initial"
        animate={contentVisible ? "animate" : "initial"}
        exit="exit"
        className="relative min-h-screen w-full"
        style={{
          paddingTop: "64px",
          zIndex: 10,
        }}
      >
        {displayChildren}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageContentTransition;
