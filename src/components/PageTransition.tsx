
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
    const timer = setTimeout(() => {
      // Déclencher la transition vidéo avec un léger délai pour éviter les conflits
      navigation.triggerVideoTransition();
      console.log("Transition vidéo déclenchée lors du changement de page");
    }, 150);
    
    return () => clearTimeout(timer);
  }, [keyId, navigation]);

  return (
    <PageContentTransition>
      <motion.div
        className="page-content-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            delay: 1.2, // Attendre la vidéo avant d'animer le contenu
            ease: "easeOut"
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
