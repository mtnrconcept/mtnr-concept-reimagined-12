
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Marquer le premier rendu comme chargement initial
    if (isInitialLoad) {
      setContentVisible(true);
      // Attendre un peu pour s'assurer que le DOM est ready
      setTimeout(() => {
        setIsInitialLoad(false);
      }, 100);
    } else {
      // Pour les changements de route suivants, utiliser la transition complète
      setIsTransitioning(true);
      setContentVisible(false);

      const timer = setTimeout(() => {
        setDisplayChildren(children);
        
        setTimeout(() => {
          setContentVisible(true);
        }, 0);
        
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [children, location, isInitialLoad]);

  // Configuration des variantes avec condition pour le chargement initial
  const contentVariants = {
    initial: (isInitial: boolean) => ({
      opacity: 0,
      y: isInitial ? 0 : "100vh", // Pas de mouvement vertical au chargement initial
      filter: isInitial ? "blur(0px)" : "blur(12px)"
    }),
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        opacity: { duration: isInitialLoad ? 1.0 : 3.0, ease: [0.05, 0.2, 0.2, 1.0] },
        y: { duration: isInitialLoad ? 0 : 3.5, ease: [0.05, 0.2, 0.2, 1.0] },
        filter: { duration: isInitialLoad ? 1.0 : 3.0, ease: [0.1, 0.4, 0.2, 1.0] }
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
        custom={isInitialLoad}
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
