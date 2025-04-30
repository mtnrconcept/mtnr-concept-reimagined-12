
import React, { ReactNode, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { createSmokeEffect } from "@/lib/transitions";
import { OptimizedDisperseLogo } from "@/components/effects/OptimizedDisperseLogo";
import { ElevatorTransition } from "@/components/effects/elevator";
import { useVideoStore } from "@/components/effects/BackgroundVideoManager";

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
  const contentRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fromPath, setFromPath] = useState(location.pathname);
  
  // Access video store to trigger video on page change
  const videoStore = useVideoStore();

  useEffect(() => {
    // Ignore first render
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevPathRef.current = location.pathname;
      return;
    }

    // Detect route changes and enable transition
    if (location.pathname !== prevPathRef.current) {
      console.log(`Page change detected: ${prevPathRef.current} -> ${location.pathname}`);
      setIsTransitioning(true);
      setFromPath(prevPathRef.current);
      
      // Play video on page change
      videoStore.play();
    }
  }, [location.pathname, videoStore]);

  const handleDisperseComplete = () => {
    console.log('Dispersion complete, applying smoke effect');
    if (contentRef.current) {
      createSmokeEffect(contentRef.current);
    }
  };

  const handleTransitionComplete = () => {
    console.log('Elevator transition complete');
    setIsTransitioning(false);
    prevPathRef.current = location.pathname;
  };

  return (
    <>
      <OptimizedDisperseLogo onTransitionComplete={handleDisperseComplete} />

      <ElevatorTransition 
        isActive={isTransitioning}
        onAnimationComplete={handleTransitionComplete}
      >
        <motion.div
          key={keyId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="page-content-wrapper"
          style={{
            perspective: "1400px",
            willChange: "transform, opacity",
            position: "relative",
            zIndex: 10,
            transition: "opacity 0.5s ease",
            width: "100%",
            height: "100%"
          }}
        >
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="smoke-container"
          >
            {children}
            <div className="absolute inset-0 pointer-events-none smoke-enter-layer" />
          </motion.div>
        </motion.div>
      </ElevatorTransition>
    </>
  );
}
