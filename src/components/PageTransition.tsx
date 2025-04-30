
import React, { ReactNode, useEffect } from "react";
import { motion } from "framer-motion";
import PageContentTransition from "@/components/PageContentTransition";
import { useNavigation } from "./effects/NavigationContext";
import { useVideoPlayabilityCheck } from "@/hooks/useVideoPlayabilityCheck";

interface PageTransitionProps {
  children: ReactNode;
  keyId: string;
}

export default function PageTransition({
  children,
  keyId,
}: PageTransitionProps) {
  const navigation = useNavigation();
  const { verifyVideoPlayability } = useVideoPlayabilityCheck();
  
  // Déclencher la transition lors du changement de page
  useEffect(() => {
    console.log("Changement de page détecté, keyId:", keyId);
    
    // S'assurer que le DOM est prêt avant de tenter la transition vidéo
    const timer = setTimeout(async () => {
      try {
        // Vérifier si on a des éléments vidéo disponibles avant de déclencher
        const normalVideoAvailable = navigation.normalVideoRef.current && 
          document.body.contains(navigation.normalVideoRef.current);
        const uvVideoAvailable = navigation.uvVideoRef.current &&
          document.body.contains(navigation.uvVideoRef.current);
        
        if (normalVideoAvailable || uvVideoAvailable) {
          // Vérifier rapidement si les vidéos sont jouables avant de déclencher
          const normalVideoSrc = navigation.normalVideoRef.current?.querySelector('source')?.src;
          const uvVideoSrc = navigation.uvVideoRef.current?.querySelector('source')?.src;
          
          // Si au moins une vidéo est disponible, on peut déclencher la transition
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
  }, [keyId, navigation, verifyVideoPlayability]);

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
