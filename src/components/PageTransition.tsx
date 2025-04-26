
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

export default function PageTransition({ children, keyId }: { children: ReactNode; keyId: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyId}
        initial={{ opacity: 0, rotateY: 60, scale: 0.95 }}
        animate={{ opacity: 1, rotateY: 0, scale: 1 }}
        exit={{ opacity: 0, rotateY: -50, scale: 0.9 }}
        transition={{ type: "spring", duration: 0.92, bounce: 0.16 }}
        style={{ 
          perspective: "1400px", 
          willChange: "transform, opacity",
          filter: "blur(0px)" // Set initial filter to prevent negative blur values
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
