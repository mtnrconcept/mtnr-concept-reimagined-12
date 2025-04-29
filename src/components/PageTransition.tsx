
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useRef, useEffect, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createSmokeEffect } from '@/lib/transitions';
import { pageTransitionPreset } from '@/components/effects/smoke-presets';
import { DispersingLogo } from '@/components/home/DispersingLogo';

interface PageTransitionProps {
  children: ReactNode;
  keyId: string;
}

export default function PageTransition({ children, keyId }: PageTransitionProps) {
  const location = useLocation();
  const prevPathRef = useRef<string>(location.pathname);
  const isInitialMountRef = useRef<boolean>(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // Pour stocker la route précédente à passer au DispersingLogo
  const [fromPath, setFromPath] = useState<string>(location.pathname);
  const [triggerLogoDispersion, setTriggerLogoDispersion] = useState<boolean>(false);

  // Gérer la transition de page (fumée + dispersion logo)
  useEffect(() => {
    // Ignorer le premier rendu
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevPathRef.current = location.pathname;
      return;
    }

    const prevPath = prevPathRef.current;
    // Mettre à jour fromPath pour le composant DispersingLogo
    setFromPath(prevPath);

    // Indiquer globalement qu'une transition est en cours
    window.pageTransitionInProgress = true;

    // Déterminer si on quitte la page d'accueil
    const isLeavingHome = prevPath === '/' && location.pathname !== '/';
    setTriggerLogoDispersion(isLeavingHome);

    // Appliquer l'effet fumée
    if (contentRef.current) {
      // Laisser le navigateur préparer le DOM
      requestAnimationFrame(() => {
        createSmokeEffect(contentRef.current!);
      });
    }

    // Réinitialiser après la durée de la transition
    const timeout = setTimeout(() => {
      window.pageTransitionInProgress = false;
      setTriggerLogoDispersion(false);
    }, pageTransitionPreset.duration || 1200);

    // Mettre à jour la route précédente
    prevPathRef.current = location.pathname;

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      {/* DispersingLogo se déclenche uniquement si on quitte '/' */}
      <DispersingLogo
        triggerDispersion={triggerLogoDispersion}
        fromPath={fromPath}
        toPath={location.pathname}
        imageSrc="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png"
        className="fixed inset-0 pointer-events-none"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={keyId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="page-content-wrapper"
          style={{ perspective: '1400px', willChange: 'transform, opacity', position: 'relative', zIndex: 10 }}
        >
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, y: 0 }} /* Modifié y: 10 -> y: 0 pour éviter le décalage */
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0, transition: { duration: 0.3, ease: [0.25,1,0.5,1] } }} /* Modifié y: -10 -> y: 0 */
            transition={{ duration: 0.8, ease: [0.25,1,0.5,1] }}
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
