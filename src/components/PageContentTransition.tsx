
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
  const { isTransitioning } = useNavigation();
  const [transitioning, setTransitioning] = useState(false);

  // Effet qui gère la transition lors d'un changement de route
  useEffect(() => {
    console.log("Changement de route détecté dans PageContentTransition");
    setTransitioning(true);
    
    // Durée de la transition vidéo (en ms)
    const videoDuration = 2500;
    
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
  }, [children, location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { 
            delay: 1.2, // Attendre que la vidéo soit bien avancée
            duration: 0.8
          }
        }}
        exit={{ 
          opacity: 0,
          transition: { 
            duration: 0.4
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
              delay: transitioning ? 1.2 : 0, 
              duration: 0.8, 
              ease: "easeOut"
            }
          }}
          exit={{ 
            y: -50, 
            opacity: 0,
            transition: { duration: 0.5 }
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
