
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
  
  // Déclenche la transition vidéo lors du montage du composant (changement de page)
  useEffect(() => {
    // Déclencher la transition vidéo avec un petit délai pour éviter les problèmes de timing
    const timer = setTimeout(() => {
      navigation.triggerVideoTransition();
      console.log("Transition vidéo déclenchée lors du changement de page");
    }, 100);
    
    return () => clearTimeout(timer);
  }, [keyId, navigation]);

  return (
    <PageContentTransition>
      <motion.div
        className="page-content-wrapper"
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
