
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
