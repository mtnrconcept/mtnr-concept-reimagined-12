
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Lorsque la route change, initialiser la transition
    setIsTransitioning(true);
    
    // Déclencher la transition vidéo
    navigation.triggerVideoTransition();
    console.log("Transition vidéo déclenchée par PageContentTransition");

    // Attendre la fin de la vidéo pour afficher le nouveau contenu
    // La durée doit correspondre à la durée de la vidéo
    const videoDuration = 2500; // Durée en millisecondes (ajuster selon votre vidéo)
    
    // Garder l'ancien contenu pendant la transition de sortie
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      
      // Terminer la transition après que le nouveau contenu soit affiché
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }, videoDuration / 2); // Afficher le nouveau contenu à mi-chemin de la vidéo

    return () => clearTimeout(timer);
  }, [children, location, navigation]);

  return (
    <AnimatePresence mode="wait" onExitComplete={() => setIsTransitioning(false)}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { 
            delay: 0.5, // Délai avant l'apparition du nouveau contenu
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
