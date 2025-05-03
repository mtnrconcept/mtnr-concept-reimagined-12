
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
    // Pour que l'animation se termine exactement à 7000ms (durée de la vidéo),
    // et commence à apparaître à 3000ms
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      
      // Afficher le contenu 4 secondes avant la fin de la vidéo
      setTimeout(() => {
        setContentVisible(true);
      }, 0); // Pas d'attente supplémentaire
      
    }, 3000); // Démarrer exactement à 3000ms

    return () => clearTimeout(timer);
  }, [children, location]);

  // Configuration des variantes pour l'effet d'accélération et de flou
  const contentVariants = {
    initial: {
      opacity: 0,
      y: "100vh", // Commence complètement en dehors de l'écran (bas)
      filter: "blur(12px)"
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        opacity: { duration: 3.5, ease: [0.05, 0.2, 0.2, 1.0] }, // 3.5s pour la fondue d'entrée
        y: { duration: 4.0, ease: [0.05, 0.2, 0.2, 1.0] }, // Exactement 4.0s pour finir à 7000ms
        filter: { duration: 3.5, ease: [0.1, 0.4, 0.2, 1.0] } // Synchronisé avec l'opacité
      }
    },
    exit: {
      opacity: 0,
      y: "-100vh", // Disparaît complètement vers le haut de l'écran
      filter: "blur(12px)",
      transition: {
        opacity: { duration: 4.6, ease: [0.33, 1, 0.68, 1] },
        y: { 
          duration: 4.0,
          ease: [0.05, 0.1, 0.9, 1.0]
        },
        filter: { duration: 3.4, ease: [0.33, 1, 0.68, 1] }
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
        className="relative min-h-screen w-full"
        style={{
          // Ajouter un padding-top pour le contenu afin qu'il ne soit pas sous la navbar
          paddingTop: "64px", // Hauteur de la navbar
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
