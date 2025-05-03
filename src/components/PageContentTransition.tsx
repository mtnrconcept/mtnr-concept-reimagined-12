
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

    // Utiliser les timings originaux
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      
      // Afficher le contenu après un délai
      setTimeout(() => {
        setContentVisible(true);
        
        // S'assurer que le scroll est possible
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
        
        // Débloquer tous les conteneurs potentiels
        const scrollableElements = document.querySelectorAll('.content-container, #main-content, .page-content-wrapper');
        scrollableElements.forEach(el => {
          (el as HTMLElement).style.overflowY = 'auto';
          (el as HTMLElement).style.height = 'auto';
        });
      }, 0);
      
    }, 3000); // Conserver la durée originale de 3000ms

    return () => clearTimeout(timer);
  }, [children, location]);

  // Configuration des variantes pour l'effet d'accélération et de flou
  const contentVariants = {
    initial: {
      opacity: 0,
      y: "10vh", 
      filter: "blur(8px)"
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        opacity: { duration: 3.0, ease: [0.05, 0.2, 0.2, 1.0] },
        y: { duration: 3.5, ease: [0.05, 0.2, 0.2, 1.0] },
        filter: { duration: 3.0, ease: [0.1, 0.4, 0.2, 1.0] }
      }
    },
    exit: {
      opacity: 0,
      y: "-10vh",
      filter: "blur(8px)",
      transition: {
        opacity: { duration: 3.0, ease: [0.33, 1, 0.68, 1] },
        y: { 
          duration: 3.5,
          ease: [0.05, 0.1, 0.9, 1.0]
        },
        filter: { duration: 3.0, ease: [0.33, 1, 0.68, 1] }
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
        className="scrollable-section w-full" 
        style={{
          // Forcer le comportement de défilement correct
          overflowY: 'auto',
          minHeight: '100vh',
          height: 'auto',
          paddingTop: "64px", // Hauteur de la navbar
          position: "relative",
          zIndex: 10,
          display: "block"
        }}
      >
        {displayChildren}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageContentTransition;
