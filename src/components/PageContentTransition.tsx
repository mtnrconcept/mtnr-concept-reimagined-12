
import React, { useEffect, useState, useRef } from "react";
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
  const lastScrollPositionRef = useRef(0);

  useEffect(() => {
    // Sauvegarder la position de défilement actuelle
    lastScrollPositionRef.current = window.scrollY;
    
    // Pour le rafraîchissement ou premier chargement
    if (isInitialPageLoad) {
      // Rendre le contenu immédiatement visible
      setDisplayChildren(children);
      setContentVisible(true);
      
      // Marquer que le premier chargement est terminé après un court délai
      setTimeout(() => {
        setIsInitialPageLoad(false);
      }, 100);
      
      return;
    }
    
    // Cette partie ne s'exécute que pour les navigations via liens
    // après le chargement initial
    setIsTransitioning(true);
    setContentVisible(false);

    // Délai pour changer le contenu pendant la transition
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      
      setTimeout(() => {
        setContentVisible(true);
        
        // Restaurer la position de défilement précédente après un bref délai
        // pour permettre au contenu de se rendre
        setTimeout(() => {
          // Ne pas remonter en haut pour les transitions entre pages
          // sauf si c'est explicitement demandé
          if (!window.scrollToTopRequested) {
            window.scrollTo(0, lastScrollPositionRef.current);
          } else {
            // Réinitialiser le flag après utilisation
            window.scrollToTopRequested = false;
          }
        }, 100);
      }, 0);
      
    }, 3000);

    return () => clearTimeout(timer);
  }, [children, location, isInitialPageLoad]);

  // Variantes d'animation différentes selon le type de chargement
  const contentVariants = {
    // Initial est soit un fondu simple, soit un effet plus complexe selon le contexte
    initial: (isInitial: boolean) => ({
      opacity: 0,
      y: isInitial ? 0 : "100vh", // Pas de mouvement vertical au chargement initial
      filter: isInitial ? "blur(0px)" : "blur(12px)" // Pas de flou au chargement initial
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
          duration: isInitialPageLoad ? 0 : 3.0, 
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
        initial={isInitialPageLoad ? { opacity: 0 } : "initial"}
        animate={contentVisible ? "animate" : "initial"}
        exit={isInitialPageLoad ? { opacity: 0 } : "exit"}
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
