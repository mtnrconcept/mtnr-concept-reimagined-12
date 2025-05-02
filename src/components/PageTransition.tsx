
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
    let mounted = true;
    
    // Petit délai pour éviter les déclenchements multiples
    const timer = setTimeout(() => {
      if (mounted) {
        console.log("Changement de page détecté, déclenchement transition vidéo");
        navigation.triggerVideoTransition();
      }
    }, 100);
    
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
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
        duration: 1.2,
        delay: 3.5, // Attendre la moitié de la vidéo (7s) avant d'animer le nouveau contenu
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      rotateX: -5,
      y: -30,
      transition: {
        duration: 1.0
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
