
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

    // Utiliser des timings plus courts pour réduire la sensation de lag/retard
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      
      // Afficher le contenu plus rapidement - 1500ms au lieu de 3000ms
      setTimeout(() => {
        setContentVisible(true);
      }, 0);
      
    }, 1500); // 1500ms au lieu de 3000ms

    return () => clearTimeout(timer);
  }, [children, location]);

  // Configuration des variantes pour l'effet d'accélération et de flou
  const contentVariants = {
    initial: {
      opacity: 0,
      y: "5vh", // Déplacement plus subtil
      filter: "blur(8px)"
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        opacity: { duration: 1.5, ease: [0.05, 0.2, 0.2, 1.0] }, // Animations plus rapides
        y: { duration: 1.8, ease: [0.05, 0.2, 0.2, 1.0] },
        filter: { duration: 1.5, ease: [0.1, 0.4, 0.2, 1.0] }
      }
    },
    exit: {
      opacity: 0,
      y: "-5vh", // Déplacement plus subtil
      filter: "blur(8px)",
      transition: {
        opacity: { duration: 1.5, ease: [0.33, 1, 0.68, 1] },
        y: { 
          duration: 1.8,
          ease: [0.05, 0.1, 0.9, 1.0]
        },
        filter: { duration: 1.5, ease: [0.33, 1, 0.68, 1] }
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
        className="relative w-full overflow-auto" // Ajout de overflow-auto pour permettre le défilement
        style={{
          // Ajouter un padding-top pour le contenu afin qu'il ne soit pas sous la navbar
          paddingTop: "64px", // Hauteur de la navbar
          minHeight: "100vh",
          height: "auto", // Permettre au contenu de s'étendre
          // Garantir que l'animation reste sous la navbar
          zIndex: 10,
        }}
      >
        {displayChildren}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageContentTransition;
