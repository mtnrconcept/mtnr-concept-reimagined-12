
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useRef, useEffect } from "react";

// Optimized transition inspired by David Langarica with improved performance
export default function PageTransition({ children, keyId }: { children: ReactNode; keyId: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Indiquer aux autres composants que nous sommes en train de faire une transition
  useEffect(() => {
    // Définir la variable globale au montage
    window.pageTransitionInProgress = true;
    
    // Réinitialiser après un court délai pour permettre aux animations de démarrer
    const timeout = setTimeout(() => {
      window.pageTransitionInProgress = false;
    }, 1500); // Assez long pour couvrir la durée des animations
    
    return () => {
      clearTimeout(timeout);
      window.pageTransitionInProgress = false;
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
          transition: { duration: 0.4 } // Reduced duration for better performance
        }}
        className="page-content-wrapper"
        style={{ 
          perspective: "1400px", 
          willChange: "transform, opacity",
          position: "relative",
          zIndex: 10
        }}
      >
        {/* Container for page content with particle/smoke effect */}
        <motion.div
          ref={contentRef}
          initial={{ 
            opacity: 0,
            y: 10,
          }}
          animate={{ 
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -10,
            transition: {
              duration: 0.3, // Fast exit for better perceived performance
              ease: [0.25, 1, 0.5, 1],
            }
          }}
          transition={{
            duration: 0.8, // Shorter entry animation
            ease: [0.25, 1, 0.5, 1],
          }}
          className="particles-container"
        >
          {children}
          
          {/* Layer for particle exit effect */}
          <div className="absolute inset-0 pointer-events-none particles-exit-layer" />
          
          {/* Layer for smoke enter effect */}
          <div className="absolute inset-0 pointer-events-none smoke-enter-layer" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
