
import { useState, useRef, useEffect, useCallback } from "react";
import { useTorch } from "./TorchContext";
import { useUVMode } from "./UVModeContext";

export function useElementIllumination() {
  const [elementsToIlluminate, setElementsToIlluminate] = useState<HTMLElement[]>([]);
  const { mousePosition, isTorchActive } = useTorch();
  const { uvMode } = useUVMode();
  const lastProcessTimeRef = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  const registerElementForIllumination = useCallback((element: HTMLElement) => {
    setElementsToIlluminate((prev) => {
      if (prev.includes(element)) return prev;
      return [...prev, element];
    });
  }, []);

  const unregisterElementForIllumination = useCallback((element: HTMLElement) => {
    setElementsToIlluminate((prev) => prev.filter((el) => el !== element));
  }, []);

  useEffect(() => {
    if (!isTorchActive) {
      // Réinitialiser tous les éléments si la torche est désactivée
      elementsToIlluminate.forEach((el) => {
        el.style.boxShadow = "";
        el.style.opacity = "";
        el.style.transform = "";
      });
      return;
    }

    const processElements = () => {
      // Limiter la fréquence de traitement pour améliorer les performances
      const now = performance.now();
      if (now - lastProcessTimeRef.current < 50) {
        animationFrameId.current = requestAnimationFrame(processElements);
        return;
      }
      lastProcessTimeRef.current = now;

      // Traiter les éléments par lots pour éviter le blocage du thread principal
      const visibleElements = elementsToIlluminate.filter(el => {
        const rect = el.getBoundingClientRect();
        return !(rect.bottom < 0 || rect.top > window.innerHeight ||
                rect.right < 0 || rect.left > window.innerWidth);
      });

      // Si trop d'éléments sont visibles, limiter le nombre pour éviter les problèmes de performance
      const maxElementsToProcess = 20;
      const elementsToProcess = visibleElements.length <= maxElementsToProcess ? 
                               visibleElements : 
                               visibleElements.slice(0, maxElementsToProcess);

      elementsToProcess.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elCenterX = rect.left + rect.width / 2;
        const elCenterY = rect.top + rect.height / 2;

        // Distance du centre de l'élément au curseur
        const dx = elCenterX - mousePosition.x;
        const dy = elCenterY - mousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const norm = Math.max(distance, 1);

        // Distance maximum pour l'effet d'illumination
        const maxDistance = 300; // Réduit pour améliorer les performances
        const distanceFactor = Math.max(0, 1 - (distance / maxDistance));

        if (distance < maxDistance) {
          // Calculer des propriétés simplifiées basées sur la distance
          const shadowLength = Math.min(distance, 50);
          const offsetX = (dx / norm) * shadowLength;
          const offsetY = (dy / norm) * shadowLength;
          const blurRadius = 10 + (distance / 20);

          // Simplifier le calcul de position relative
          const relX = (mousePosition.x - rect.left) / rect.width;
          const relY = (mousePosition.y - rect.top) / rect.height;
          const isNearEdge = relX < 0.2 || relX > 0.8 || relY < 0.2 || relY > 0.8;

          el.style.transition = "box-shadow 0.3s ease-out, opacity 0.3s ease-out";

          if (uvMode) {
            // En mode UV, utiliser un effet plus simple mais toujours visible
            el.style.boxShadow = `
              ${isNearEdge ? `inset ${offsetX/2}px ${offsetY/2}px ${blurRadius/2}px rgba(0, 170, 255, 0.5),` : ''}
              ${offsetX}px ${offsetY}px ${blurRadius}px rgba(0, 170, 255, 0.4)
            `;
            
            el.style.opacity = "1";
            
            // Animation simplifiée
            const scale = 1 + Math.sin(now / 1000) * 0.01 * distanceFactor;
            el.style.transform = `scale(${scale})`;
          } else {
            // Mode torche normale simplifié
            el.style.boxShadow = `${offsetX}px ${offsetY}px ${blurRadius}px rgba(0, 0, 0, 0.3)`;
            el.style.opacity = (0.7 + distanceFactor * 0.3).toString();
            el.style.transform = '';
          }
        } else {
          // Hors de portée
          el.style.boxShadow = "";
          el.style.opacity = "";
          el.style.transform = "";
        }
      });

      // Pour les éléments non traités (hors écran ou au-delà de la limite),
      // réinitialiser leurs styles
      if (visibleElements.length > maxElementsToProcess) {
        visibleElements.slice(maxElementsToProcess).forEach(el => {
          el.style.boxShadow = "";
          el.style.opacity = "";
          el.style.transform = "";
        });
      }

      // Continuer l'animation
      animationFrameId.current = requestAnimationFrame(processElements);
    };

    // Démarrer le traitement
    animationFrameId.current = requestAnimationFrame(processElements);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      // Réinitialiser tous les éléments
      elementsToIlluminate.forEach((el) => {
        el.style.boxShadow = "";
        el.style.opacity = "";
        el.style.transform = "";
      });
    };
  }, [isTorchActive, elementsToIlluminate, uvMode]);

  // Position de la souris traitée séparément avec une fréquence plus faible
  useEffect(() => {
    // Ne rien faire si la torche est inactive
    if (!isTorchActive || elementsToIlluminate.length === 0) return;
    
    // Les mises à jour de la position de la souris sont déjà traitées
    // dans la boucle d'animation principale
  }, [mousePosition, isTorchActive, elementsToIlluminate.length]);

  return {
    registerElementForIllumination,
    unregisterElementForIllumination,
  };
}

export const useIlluminated = () => {
  const { registerElementForIllumination, unregisterElementForIllumination } =
    useElementIllumination();
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      registerElementForIllumination(ref.current);
      return () => {
        if (ref.current) {
          unregisterElementForIllumination(ref.current);
        }
      };
    }
  }, [registerElementForIllumination, unregisterElementForIllumination]);

  return { ref };
};
