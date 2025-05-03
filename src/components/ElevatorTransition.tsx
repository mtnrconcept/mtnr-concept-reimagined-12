
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Définition de l'ordre des pages pour déterminer la direction
const pageOrder = ['/', '/what-we-do', '/artists', '/book', '/contact'];

interface ElevatorTransitionProps {
  children: React.ReactNode;
  isActive: boolean;
  onAnimationComplete: () => void;
}

const ElevatorTransition = ({ children, isActive, onAnimationComplete }: ElevatorTransitionProps) => {
  const location = useLocation();
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [prevPath, setPrevPath] = useState(location.pathname);
  const containerRef = useRef<HTMLDivElement>(null);

  // Détermine la direction de l'animation basée sur l'ordre des pages
  useEffect(() => {
    if (!isActive) return;

    const currentIndex = pageOrder.indexOf(location.pathname);
    const prevIndex = pageOrder.indexOf(prevPath);
    
    if (currentIndex > prevIndex) {
      setDirection('down');
    } else if (currentIndex < prevIndex) {
      setDirection('up');
    } else {
      setDirection(null);
    }

    setPrevPath(location.pathname);
  }, [isActive, location.pathname, prevPath]);

  // Créer les variantes pour l'animation d'ascenseur
  const elevatorVariants = {
    initial: (direction: 'up' | 'down' | null) => ({
      y: direction === 'down' ? '-100%' : direction === 'up' ? '100%' : 0,
    }),
    animate: {
      y: 0,
      transition: {
        duration: 5,
        ease: [0.16, 1, 0.3, 1], // Ease-out quint - un bon easing pour simulation d'ascenseur
      },
    },
    exit: (direction: 'up' | 'down' | null) => ({
      y: direction === 'down' ? '100%' : direction === 'up' ? '-100%' : 0,
      transition: {
        duration: 5,
        ease: [0.7, 0, 0.84, 0], // Ease-in quint - départ progressif
      },
    }),
  };

  // Composant pour la tuile d'arrière-plan qui se répète infiniment
  const InfiniteTileBackground = () => {
    // Référence à 3 éléments de tuile pour créer l'effet de défilement infini
    const tiles = Array.from({ length: 3 }, (_, i) => (
      <div 
        key={`tile-${i}`} 
        className="absolute inset-x-0 h-screen bg-black"
        style={{
          top: `${i * 100}vh`,
          backgroundImage: 'url("/lovable-uploads/5688334d-9fa2-4439-9453-5a5b9cde0c81.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
        }}
      />
    ));

    return (
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="relative h-[300vh]" // Trois fois la hauteur de l'écran
          initial={{ y: direction === 'up' ? '-100vh' : 0 }}
          animate={{
            y: direction === 'up' ? '-200vh' : '-100vh'
          }}
          transition={{
            duration: 5,
            ease: [0.16, 1, 0.3, 1],
            repeat: 0,
          }}
        >
          {tiles}
        </motion.div>
      </div>
    );
  };

  // Composant pour l'effet de flou de mouvement
  const BlurMotionEffect = ({ children }: { children: React.ReactNode }) => {
    return (
      <motion.div
        initial={{ filter: "blur(0px)" }}
        animate={{
          filter: [
            "blur(0px)",
            "blur(8px)",
            "blur(12px)",
            "blur(8px)",
            "blur(0px)"
          ]
        }}
        transition={{
          duration: 5,
          times: [0, 0.2, 0.5, 0.8, 1],
          ease: [0.16, 1, 0.3, 1]
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div 
      className="fixed inset-0 pointer-events-none" 
      ref={containerRef}
      style={{
        // Z-index absolument inférieur à la navbar
        zIndex: 50,
        // Respecter la hauteur de la navbar
        top: '64px',
        height: 'calc(100vh - 64px)',
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {isActive && (
        <>
          <InfiniteTileBackground />
          
          <motion.div
            custom={direction}
            variants={elevatorVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onAnimationComplete={onAnimationComplete}
            className="absolute inset-0 flex items-center justify-center"
          >
            <BlurMotionEffect>
              {children}
            </BlurMotionEffect>
          </motion.div>
        </>
      )}
    </div>
  );
}

export default ElevatorTransition;
