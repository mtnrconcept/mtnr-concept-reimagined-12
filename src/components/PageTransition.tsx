
import React, { ReactNode, useEffect, useState } from "react";
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
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  
  // Déclencher la transition lors du changement de page
  useEffect(() => {
    // Signaler le début de la transition
    setIsExiting(true);
    
    // Déclencher la transition vidéo
    navigation.triggerVideoTransition();
    console.log("Transition vidéo déclenchée lors du changement de page");
    
    // Simuler la sortie de l'ancien contenu
    const exitTimer = setTimeout(() => {
      setIsExiting(false);
      setIsEntering(true);
      
      // Simuler l'entrée du nouveau contenu
      const enterTimer = setTimeout(() => {
        setIsEntering(false);
      }, 500); // Durée de l'animation d'entrée
      
      return () => clearTimeout(enterTimer);
    }, 500); // Durée de l'animation de sortie
    
    return () => clearTimeout(exitTimer);
  }, [keyId, navigation]);

  return (
    <PageContentTransition>
      <motion.div
        className="page-content-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isExiting ? 0 : 1,
          y: isExiting ? -20 : isEntering ? 20 : 0,
          transition: {
            duration: 0.5,
            ease: "easeInOut"
          }
        }}
        exit={{ opacity: 0, y: -20 }}
        style={{
          perspective: "1400px",
          willChange: "transform, opacity",
          position: "relative",
          zIndex: 10
        }}
      >
        {children}
      </motion.div>
    </PageContentTransition>
  );
}
