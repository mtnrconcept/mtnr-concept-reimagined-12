
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

  // Effet qui gère la transition lors d'un changement de route
  useEffect(() => {
    console.log("Changement de route détecté dans PageContentTransition");
    setTransitioning(true);
    
    // Déclencher la transition vidéo
    triggerVideoTransition();
    
    // Durée de la transition vidéo (7 secondes)
    const videoDuration = 7000;
    
    // Attendre la moitié de la durée vidéo avant de commencer à afficher le nouveau contenu
    // Cela donne une transition fluide entre l'ancien et le nouveau contenu
    const contentSwitchTimer = setTimeout(() => {
      setDisplayChildren(children);
      console.log("Nouveau contenu préparé pour affichage");
    }, videoDuration / 2);
    
    // Marquer la fin de la transition après la durée complète
    const transitionEndTimer = setTimeout(() => {
      setTransitioning(false);
      console.log("Transition de contenu terminée");
    }, videoDuration);
    
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
            delay: 3.5, // Attendre la moitié de la vidéo avant de faire apparaître le contenu
            duration: 1.2
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
              delay: transitioning ? 3.5 : 0, // Attendre la moitié de la vidéo avant d'animer
              duration: 1.2, 
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
