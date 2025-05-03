
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

interface PageContentTransitionProps {
  children: React.ReactNode;
}

const PageContentTransition: React.FC<PageContentTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // Lorsque la route change, initialiser la transition
    setIsTransitioning(true);
    setContentVisible(false);

    // Garder l'ancien contenu pendant la transition de sortie
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      
      // Ajouter un délai plus long pour l'apparition du contenu après le chargement de la vidéo
      // Ce délai permet à la vidéo de bien s'afficher avant le contenu
      setTimeout(() => {
        setContentVisible(true);
      }, 1200); // Augmenté de 500ms à 1200ms pour donner plus de temps à la vidéo
      
    }, 2500); // Augmenté de 2000ms à 2500ms pour une transition de sortie plus lente

    return () => clearTimeout(timer);
  }, [children, location]);

  return (
    <AnimatePresence mode="wait" onExitComplete={() => setIsTransitioning(false)}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: contentVisible ? 1 : 0,
          transition: { 
            delay: contentVisible ? 0.3 : 3.5, // Ajout d'un délai de 0.3s avant l'apparition et augmenté le délai d'attente
            duration: 2.5 // Augmenté de 1.5s à 2.5s pour un fondu entrant plus progressif
          }
        }}
        exit={{ 
          opacity: 0,
          transition: { 
            duration: 1.8 // Augmenté de 1s à 1.8s pour un fondu sortant plus lent
          }
        }}
        className="relative z-10 min-h-screen w-full"
      >
        {displayChildren}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageContentTransition;
