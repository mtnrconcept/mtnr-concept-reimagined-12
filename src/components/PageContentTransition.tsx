
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
    // Pour que l'animation se termine au même moment que la vidéo (7000ms),
    // et commence à apparaître 3 secondes plus tôt, à 4000ms
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      
      // Afficher le contenu 3 secondes avant la fin de la vidéo
      setTimeout(() => {
        setContentVisible(true);
      }, 0); // Pas d'attente supplémentaire
      
    }, 4000); // Démarrer à 4000ms (7000ms - 3000ms de durée d'animation)

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
        opacity: { duration: 3.5, ease: [0.05, 0.2, 0.2, 1.0] }, // Rallongée à 3.5s pour la fondue d'entrée
        y: { duration: 3.0, ease: [0.05, 0.2, 0.2, 1.0] }, // Même courbe pour y
        filter: { duration: 2.8, ease: [0.1, 0.4, 0.2, 1.0] } // Légèrement plus rapide pour le blur
      }
    },
    exit: {
      opacity: 0,
      y: "-100vh", // Disparaît complètement vers le haut de l'écran
      filter: "blur(12px)",
      transition: {
        opacity: { duration: 4.6, ease: [0.33, 1, 0.68, 1] }, // Rallongée à 4.6s (+1s)
        y: { 
          duration: 4.0, // Rallongée à 4.0 secondes (+1s)
          ease: [0.05, 0.1, 0.9, 1.0] // Courbe cubique modifiée pour un départ TRÈS lent et une accélération très rapide à la fin
        },
        filter: { duration: 3.4, ease: [0.33, 1, 0.68, 1] } // Rallongée à 3.4 secondes (+1s)
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
