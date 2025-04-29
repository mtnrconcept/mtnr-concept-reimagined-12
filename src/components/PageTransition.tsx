
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useRef, useEffect } from "react";

// Transition inspirée par David Langarica avec des particules et de la fumée
export default function PageTransition({ children, keyId }: { children: ReactNode; keyId: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Effet pour initialiser les particules lors du changement de page
  useEffect(() => {
    if (!contentRef.current) return;
    
    // Ajout de classe pour l'animation d'apparition
    contentRef.current.classList.add('animate-smoke-in');
    
    return () => {
      if (contentRef.current) {
        contentRef.current.classList.remove('animate-smoke-in');
      }
    };
  }, [keyId]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ 
          opacity: 0,
          filter: "blur(8px)",
          transition: { duration: 3.5 } // Durée plus longue pour correspondre à l'animation des particules
        }}
        className="page-content-wrapper"
        style={{ 
          perspective: "1400px", 
          willChange: "transform, opacity",
          position: "relative",
          zIndex: 10
        }}
        onAnimationComplete={() => {
          // Animation terminée
          if (contentRef.current) {
            contentRef.current.classList.add('animation-completed');
          }
        }}
      >
        {/* Conteneur pour le contenu de la page avec effet de particules/fumée */}
        <motion.div
          ref={contentRef}
          initial={{ 
            opacity: 0,
            y: 20,
          }}
          animate={{ 
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            filter: "blur(10px)",
            y: -20,
            transition: {
              duration: 3.0, // Animation de sortie de 3 secondes
              ease: [0.25, 1, 0.5, 1],
            }
          }}
          transition={{
            duration: 3.5, // Animation d'entrée de 3.5 secondes
            ease: [0.25, 1, 0.5, 1],
          }}
          className="particles-container"
        >
          {children}
          
          {/* Couche d'effet de particules pour la sortie */}
          <div className="absolute inset-0 pointer-events-none particles-exit-layer" />
          
          {/* Couche d'effet de fumée pour l'entrée */}
          <div className="absolute inset-0 pointer-events-none smoke-enter-layer" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
