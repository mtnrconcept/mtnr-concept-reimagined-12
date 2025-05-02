
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import PageContentTransition from "@/components/PageContentTransition";

interface PageTransitionProps {
  children: ReactNode;
  keyId: string;
}

export default function PageTransition({
  children,
  keyId,
}: PageTransitionProps) {
  // Variants for the 3D animation
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
        delay: 3.5, // Wait for half the video (7s) before animating the new content
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
