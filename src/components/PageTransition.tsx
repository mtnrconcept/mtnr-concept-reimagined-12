
import React, { ReactNode, useEffect } from "react";
import { motion } from "framer-motion";
import PageContentTransition from "@/components/PageContentTransition";
import { useNavigation } from "./effects/NavigationContext";

interface PageTransitionProps {
  children: ReactNode;
  keyId: string;
}

export default function PageTransition({
  children,
  keyId,
}: PageTransitionProps) {
  const navigation = useNavigation();
  
  // Déclencher la transition lors du changement de page
  useEffect(() => {
    // Petit délai pour éviter les transitions multiples
    const timer = setTimeout(() => {
      console.log("Changement de page détecté, déclenchement transition vidéo");
      navigation.triggerVideoTransition();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [keyId, navigation]);

  // Variants pour l'animation 3D
  const pageVariants = {
    initial: {
      opacity: 0,
      rotateX: 5,
      y: 30
    },
    animate: {
      opacity: 1,
      rotateX: 0,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 1.2, // Attendre la vidéo avant d'animer
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      rotateX: -5,
      y: -30,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <PageContentTransition>
      <motion.div
        className="page-content-wrapper"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        style={{
          perspective: "1400px",
          willChange: "transform, opacity",
          position: "relative",
          zIndex: 10,
          transformStyle: "preserve-3d"
        }}
      >
        {children}
      </motion.div>
    </PageContentTransition>
  );
}
