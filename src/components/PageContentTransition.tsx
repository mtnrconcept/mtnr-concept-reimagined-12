
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

  useEffect(() => {
    // Lorsque la route change, initialiser la transition
    setIsTransitioning(true);
    setContentVisible(false);

    // Garder l'ancien contenu pendant la transition de sortie
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      
      // Ajouter un délai plus long pour l'apparition du contenu après le chargement de la vidéo
      setTimeout(() => {
        setContentVisible(true);
      }, 1200);
      
    }, 2500);

    return () => clearTimeout(timer);
  }, [children, location]);

  // Configuration des variantes pour l'effet d'accélération et de flou
  const contentVariants = {
    initial: {
      opacity: 0,
      y: 100, // Commence depuis le bas de l'écran
      filter: "blur(8px)"
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        opacity: { duration: 2.2, ease: [0.16, 1, 0.3, 1] },
        y: { duration: 2.5, ease: [0.25, 0.1, 0.25, 1] }, // Cubic-bezier pour un effet d'entrée rapide puis douce
        filter: { duration: 1.8, ease: [0.33, 1, 0.68, 1] }
      }
    },
    exit: {
      opacity: 0,
      y: -100, // Disparaît vers le haut
      filter: "blur(8px)",
      transition: {
        opacity: { duration: 1.8, ease: [0.33, 1, 0.68, 1] },
        y: { duration: 1.5, ease: [0.33, 1, 0.68, 1] }, // Effet d'accélération
        filter: { duration: 1.2, ease: [0.33, 1, 0.68, 1] }
      }
    }
  };

  return (
    <AnimatePresence mode="wait" onExitComplete={() => setIsTransitioning(false)}>
      <motion.div
        key={location.pathname}
        variants={contentVariants}
        initial="initial"
        animate={contentVisible ? "animate" : "initial"}
        exit="exit"
        className="relative z-10 min-h-screen w-full"
      >
        {displayChildren}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageContentTransition;
