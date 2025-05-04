
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

  // Ajouter une classe permettant le scroll à l'élément body
  useEffect(() => {
    document.body.classList.add('allow-scroll');
    return () => {
      document.body.classList.remove('allow-scroll');
    };
  }, []);

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
      
      // Attendre 1 seconde avant de commencer l'animation du contenu
      setTimeout(() => {
        setContentVisible(true);
        
        setTimeout(() => {
          // Ne pas remonter en haut pour les transitions entre pages
          // sauf si c'est explicitement demandé
          if (!window.scrollToTopRequested) {
            window.scrollTo(0, 0); // Toujours remonter en haut lors des changements de page
          } else {
            // Réinitialiser le flag après utilisation
            window.scrollToTopRequested = false;
          }
        }, 300); // Temps d'attente augmenté pour une transition plus progressive
      }, 1000); // Délai d'une seconde avant de démarrer l'animation
      
    }, 600); // Transition plus longue pour laisser le temps aux animations visuelles

    return () => clearTimeout(timer);
  }, [children, location, isInitialPageLoad]);

  // Variantes d'animation différentes selon le type de chargement
  const contentVariants = {
    // Initial est soit un fondu simple, soit un effet plus complexe selon le contexte
    initial: (isInitial: boolean) => ({
      opacity: 0,
      y: isInitial ? 0 : "100vh", // Départ depuis le bas de l'écran (100vh)
      filter: isInitial ? "blur(0px)" : "blur(5px)" // Effet de flou conservé
    }),
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        opacity: { 
          duration: isInitialPageLoad ? 0.8 : 1.4, // Durée ajustée
          ease: "easeOut" 
        },
        y: { 
          duration: isInitialPageLoad ? 0 : 6.0, // Durée de 6 secondes pour que l'animation se termine exactement à la fin de la vidéo (7s - 1s de délai)
          ease: [0.16, 0.42, 0.05, 1.0] // Courbe d'accélération modifiée: rapide au début, très lente à la fin
        },
        filter: { 
          duration: isInitialPageLoad ? 0 : 5.5, // Durée réduite pour l'effet de flou
          ease: [0.1, 0.4, 0.2, 1.0] 
        }
      }
    },
    exit: {
      opacity: 0,
      y: "-50vh", // Mouvement vertical conservé
      filter: "blur(5px)", // Effet de flou conservé
      transition: {
        opacity: { duration: 2.2, ease: [0.33, 1, 0.68, 1] }, // Exit plus lent
        y: { 
          duration: 2.5, // Exit plus lent
          ease: [0.05, 0.1, 0.9, 1.0]
        },
        filter: { duration: 2.4, ease: [0.33, 1, 0.68, 1] } // Exit plus lent
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
        className="relative min-h-screen w-full overflow-visible"
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
