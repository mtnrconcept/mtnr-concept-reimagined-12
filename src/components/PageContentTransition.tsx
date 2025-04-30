
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

  useEffect(() => {
    // Lorsque la route change, initialiser la transition
    console.log("Changement de route détecté dans PageContentTransition");
    
    // Attendre un peu avant de déclencher pour s'assurer que tout est prêt
    const timer = setTimeout(() => {
      triggerVideoTransition();
      console.log("Transition vidéo déclenchée par PageContentTransition");
    }, 50);
    
    // Définir la durée approximative de la vidéo en millisecondes
    const videoDuration = 2500;
    
    // Garder l'ancien contenu pendant la première moitié de la transition
    const exitTimer = setTimeout(() => {
      setDisplayChildren(children);
      console.log("Nouveau contenu préparé pour affichage");
    }, videoDuration / 2);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(exitTimer);
    };
  }, [children, location, triggerVideoTransition]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { 
            delay: 1.2, // Attendre que la vidéo soit bien avancée pour montrer le contenu
            duration: 0.8
          }
        }}
        exit={{ 
          opacity: 0,
          transition: { 
            duration: 0.5
          }
        }}
        className="relative z-10 min-h-screen w-full pointer-events-auto"
        style={{
          willChange: "opacity, transform",
          zIndex: 10
        }}
      >
        {displayChildren}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageContentTransition;
