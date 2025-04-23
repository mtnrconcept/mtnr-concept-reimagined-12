
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

export default function PageTransition({ children, keyId }: { children: ReactNode; keyId: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyId}
        initial={{ opacity: 0, rotateY: 60, scale: 0.95, filter: "blur(16px)" }}
        animate={{ opacity: 1, rotateY: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, rotateY: -50, scale: 0.9, filter: "blur(24px)" }}
        transition={{ type: "spring", duration: 0.92, bounce: 0.16 }}
        style={{ perspective: "1400px", willChange: "transform, filter, opacity" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
