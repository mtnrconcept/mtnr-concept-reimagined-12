
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
    // Temps d'attente ajusté pour correspondre à la durée de la vidéo
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      
      // Afficher immédiatement le contenu lorsque la vidéo se termine
      // Normalement la vidéo se termine vers 4000ms
      setTimeout(() => {
        setContentVisible(true);
      }, 0); // Plus d'attente supplémentaire pour synchroniser avec la fin de la vidéo
      
    }, 4000); // Durée totale de la vidéo de transition

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
        opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }, // Réduit de 2.2s à 0.8s pour terminer avec la vidéo
        y: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }, // Réduit de 2.5s à 0.8s pour terminer avec la vidéo
        filter: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } // Réduit de 1.8s à 0.8s pour terminer avec la vidéo
      }
    },
    exit: {
      opacity: 0,
      y: "-100vh", // Disparaît complètement vers le haut de l'écran
      filter: "blur(12px)",
      transition: {
        opacity: { duration: 3.6, ease: [0.33, 1, 0.68, 1] },
        y: { 
          duration: 3.0, // Maintenu à 3.0 secondes comme demandé précédemment
          ease: [0.05, 0.1, 0.9, 1.0] // Courbe cubique modifiée pour un départ TRÈS lent et une accélération très rapide à la fin
        },
        filter: { duration: 2.4, ease: [0.33, 1, 0.68, 1] } // Maintenu à 2.4 secondes
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
