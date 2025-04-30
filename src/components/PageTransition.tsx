
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
    console.log("Changement de page détecté, keyId:", keyId);
    
    // S'assurer que le DOM est prêt avant de tenter la transition vidéo
    const timer = setTimeout(() => {
      try {
        // Vérifier si on a des éléments vidéo disponibles avant de déclencher
        if (navigation.normalVideoRef.current || navigation.uvVideoRef.current) {
          navigation.triggerVideoTransition();
          console.log("Transition vidéo déclenchée lors du changement de page");
        } else {
          console.warn("Aucune référence vidéo disponible, transition ignorée");
        }
      } catch (error) {
        console.error("Erreur lors du déclenchement de la transition vidéo:", error);
      }
    }, 200);
    
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
