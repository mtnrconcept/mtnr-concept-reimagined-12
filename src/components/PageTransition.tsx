
import React, { ReactNode, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ElevatorTransition } from "@/components/effects/elevator";

interface PageTransitionProps {
  children: ReactNode;
  keyId: string;
}

export default function PageTransition({
  children,
  keyId,
}: PageTransitionProps) {
  const location = useLocation();
  const prevPathRef = useRef<string>(location.pathname);
  const isInitialMountRef = useRef<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Détecter les changements de routes
  useEffect(() => {
    // Ignorer le premier rendu
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevPathRef.current = location.pathname;
      return;
    }

    // Activer la transition lors d'un changement de route
    if (location.pathname !== prevPathRef.current) {
      console.log(`Changement de page: ${prevPathRef.current} -> ${location.pathname}`);
      setIsTransitioning(true);
    }
  }, [location.pathname]);

  // Gestionnaire de fin de transition
  const handleTransitionComplete = () => {
    console.log('Transition terminée');
    setIsTransitioning(false);
    prevPathRef.current = location.pathname;
  };

  return (
    <ElevatorTransition 
      isActive={isTransitioning}
      onAnimationComplete={handleTransitionComplete}
    >
      <motion.div
        key={keyId}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
        className="page-content-wrapper"
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        {children}
      </motion.div>
    </ElevatorTransition>
  );
}
