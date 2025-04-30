
import React, { ReactNode, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import ElevatorTransition from "@/components/effects/ElevatorTransition";
import PageContentTransition from "@/components/PageContentTransition";

interface PageTransitionProps {
  children: ReactNode;
  keyId: string;
}

export default function PageTransition({
  children,
  keyId,
}: PageTransitionProps) {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Utilisation du composant de transition d'ascenseur */}
      <ElevatorTransition 
        isActive={false}
        onAnimationComplete={() => {}}
      >
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center">
          <div className="text-white text-4xl font-bold">
            Transition en cours...
          </div>
        </div>
      </ElevatorTransition>

      {/* Utilisation du composant de transition de contenu */}
      <PageContentTransition>
        <motion.div
          ref={contentRef}
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
    </>
  );
}
