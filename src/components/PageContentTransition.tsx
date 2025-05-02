
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useNavigation } from "./effects/NavigationContext";

interface PageContentTransitionProps {
  children: React.ReactNode;
}

const PageContentTransition: React.FC<PageContentTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const { isTransitioning, triggerVideoTransition } = useNavigation();
  const [transitioning, setTransitioning] = useState(false);
  
  // Constantes pour les délais de transition
  const VIDEO_DURATION = 7000; // 7 secondes
  const CONTENT_SWITCH_DELAY = VIDEO_DURATION / 2; // 3.5 secondes
  const CONTENT_FADE_IN_DELAY = 3.5; // 3.5 secondes
  const CONTENT_FADE_DURATION = 1.2; // 1.2 secondes

  // Effet qui gère la transition lors d'un changement de route
  useEffect(() => {
    console.log("Changement de route détecté dans PageContentTransition");
    setTransitioning(true);
    
    // Déclencher la transition vidéo
    triggerVideoTransition();
    
    // Planifier le changement de contenu après la moitié de la transition vidéo
    const contentSwitchTimer = setTimeout(() => {
      setDisplayChildren(children);
      console.log("Nouveau contenu préparé pour affichage");
    }, CONTENT_SWITCH_DELAY);
    
    // Marquer la fin de la transition après la durée complète
    const transitionEndTimer = setTimeout(() => {
      setTransitioning(false);
      console.log("Transition de contenu terminée");
    }, VIDEO_DURATION);
    
    return () => {
      clearTimeout(contentSwitchTimer);
      clearTimeout(transitionEndTimer);
    };
  }, [children, location.pathname, triggerVideoTransition]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { 
            delay: CONTENT_FADE_IN_DELAY, 
            duration: CONTENT_FADE_DURATION
          }
        }}
        exit={{ 
          opacity: 0,
          transition: { 
            duration: 1.0
          }
        }}
        className="relative z-10 min-h-screen w-full pointer-events-auto"
        style={{
          willChange: "opacity, transform",
          zIndex: 10,
          perspective: "1200px"
        }}
      >
        <motion.div
          initial={{ y: 50, opacity: 0, rotateX: 5 }}
          animate={{ 
            y: 0, 
            opacity: 1, 
            rotateX: 0,
            transition: { 
              delay: transitioning ? CONTENT_FADE_IN_DELAY : 0, 
              duration: CONTENT_FADE_DURATION, 
              ease: "easeOut"
            }
          }}
          exit={{ 
            y: -50, 
            opacity: 0,
            transition: { duration: 1.0 }
          }}
          className="h-full w-full"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "center center"
          }}
        >
          {displayChildren}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PageContentTransition;
