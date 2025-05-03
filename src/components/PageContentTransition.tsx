
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
      
      // Ajouter un délai pour l'apparition du contenu après le chargement de la vidéo
      // Ce délai permet à la vidéo de bien s'afficher avant le contenu
      setTimeout(() => {
        setContentVisible(true);
      }, 500); // Délai supplémentaire après la transition de la vidéo
      
    }, 2000); // 2 secondes de transition de sortie + pause

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
            delay: contentVisible ? 0 : 3, // Apparaît après la vidéo
            duration: 1.5 // Fondu entrant plus rapide
          }
        }}
        exit={{ 
          opacity: 0,
          transition: { 
            duration: 1 // Fondu sortant plus rapide
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
