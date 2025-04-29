import { motion, AnimatePresence } from "framer-motion";
import {
  ReactNode,
  useRef,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { createSmokeEffect } from "@/lib/transitions";
import { pageTransitionPreset } from "@/components/effects/smoke-presets";
import { DispersingLogo } from "@/components/home/DispersingLogo";

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

  // On stocke la route précédente et le trigger pour DispersingLogo
  const [fromPath, setFromPath] = useState(location.pathname);
  const [triggerLogoDispersion, setTriggerLogoDispersion] = useState(false);

  useEffect(() => {
    // Ignorer le tout premier rendu
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevPathRef.current = location.pathname;
      return;
    }

    const prevPath = prevPathRef.current;
    setFromPath(prevPath);

    // On démarre la transition
    window.pageTransitionInProgress = true;

    // Déclenche la dispersion uniquement si on quitte vraiment "/"
    const isLeavingHome = prevPath === "/" && location.pathname !== "/";
    setTriggerLogoDispersion(isLeavingHome);

    // Effet fumée
    if (contentRef.current) {
      requestAnimationFrame(() => {
        createSmokeEffect(contentRef.current!, pageTransitionPreset);
      });
    }

    // Finir la transition après la durée du preset
    const timeout = setTimeout(() => {
      window.pageTransitionInProgress = false;
      setTriggerLogoDispersion(false);
    }, pageTransitionPreset.duration || 1200);

    // Mettre à jour pour le prochain changement de route
    prevPathRef.current = location.pathname;
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      <DispersingLogo
        triggerDispersion={triggerLogoDispersion}
        fromPath={fromPath}
        toPath={location.pathname}
        imageSrc="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png"
        onDispersionComplete={() => {
          /* callback si besoin */
        }}
        className="fixed inset-0 pointer-events-none"
      />

      <AnimatePresence mode="wait">
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
          }}
        >
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: -10,
              transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] },
            }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="smoke-container"
          >
            {children}
            <div className="absolute inset-0 pointer-events-none smoke-enter-layer" />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
