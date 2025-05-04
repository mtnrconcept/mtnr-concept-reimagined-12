
import { useState, useRef, useEffect, useCallback } from "react";
import { useTorch } from "./TorchContext";
import { useUVMode } from "./UVModeContext";
import { useIsMobile } from "@/hooks/use-mobile";

export function useElementIllumination() {
  const [elementsToIlluminate, setElementsToIlluminate] = useState<HTMLElement[]>([]);
  const { mousePosition, isTorchActive } = useTorch();
  const { uvMode } = useUVMode();
  const isMobile = useIsMobile();

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
    if (!isTorchActive) return;

    // Pour les appareils mobiles, reduire la fréquence des calculs
    const throttleTime = isMobile ? 50 : 0; // ms
    let lastUpdate = 0;

    const updateElements = () => {
      const now = Date.now();
      if (now - lastUpdate < throttleTime) return;
      lastUpdate = now;

      elementsToIlluminate.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elCenterX = rect.left + rect.width / 2;
        const elCenterY = rect.top + rect.height / 2;

        // Ignorer si l'élément est hors écran
        if (
          rect.bottom < 0 || rect.top > window.innerHeight ||
          rect.right < 0 || rect.left > window.innerWidth
        ) {
          el.style.boxShadow = "";
          el.style.opacity = "";
          return;
        }

        // Distance du centre de l'élément au curseur
        const dx = elCenterX - mousePosition.x;
        const dy = elCenterY - mousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const norm = Math.max(distance, 1);

        // Distance maximum pour l'effet d'illumination
        const maxDistance = isMobile ? 300 : 400;
        const distanceFactor = Math.max(0, 1 - (distance / maxDistance));

        if (distance < maxDistance) {
          // Calculer les propriétés basées sur la distance
          const shadowLength = isMobile ? 35 + Math.min(distance, 150) : 50 + Math.min(distance, 200);
          const offsetX = (dx / norm) * shadowLength;
          const offsetY = (dy / norm) * shadowLength;
          const blurRadius = isMobile ? 15 + (distance / 15) : 20 + (distance / 10);

          // Effet directionnel - plus lumineux du côté du curseur
          // Calculer la position relative du curseur par rapport à l'élément
          const relX = (mousePosition.x - rect.left) / rect.width;
          const relY = (mousePosition.y - rect.top) / rect.height;
          const isNearLeft = relX < 0.3;
          const isNearRight = relX > 0.7;
          const isNearTop = relY < 0.3;
          const isNearBottom = relY > 0.7;

          // Ajustement de l'opacité selon la distance
          const distanceRatio = Math.min(distance / maxDistance, 1); // 0 (proche) → 1 (loin)
          const adjustedOpacity = 1 - distanceRatio * 0.5; // 1 → 0.5

          // Sur mobile, réduire les transitions pour de meilleures performances
          el.style.transition = isMobile ? 
            "opacity 0.2s ease-out" : 
            "box-shadow 0.3s ease-out, opacity 0.3s ease-out";

          if (uvMode) {
            // En mode UV, l'illumination est plus spectaculaire
            let shadowColor = 'rgba(0, 170, 255, 0.6)';
            
            // Effet directionnel - côté plus lumineux selon la position du curseur
            if (isNearLeft) {
              el.style.boxShadow = `
                inset ${blurRadius}px 0 ${blurRadius}px rgba(0, 170, 255, 0.7),
                ${offsetX}px ${offsetY}px ${blurRadius}px ${shadowColor},
                0 0 15px rgba(0, 170, 255, 0.4),
                0 0 30px rgba(0, 170, 255, 0.2)
              `;
            } else if (isNearRight) {
              el.style.boxShadow = `
                inset -${blurRadius}px 0 ${blurRadius}px rgba(0, 170, 255, 0.7),
                ${offsetX}px ${offsetY}px ${blurRadius}px ${shadowColor},
                0 0 15px rgba(0, 170, 255, 0.4),
                0 0 30px rgba(0, 170, 255, 0.2)
              `;
            } else if (isNearTop) {
              el.style.boxShadow = `
                inset 0 ${blurRadius}px ${blurRadius}px rgba(0, 170, 255, 0.7),
                ${offsetX}px ${offsetY}px ${blurRadius}px ${shadowColor},
                0 0 15px rgba(0, 170, 255, 0.4),
                0 0 30px rgba(0, 170, 255, 0.2)
              `;
            } else if (isNearBottom) {
              el.style.boxShadow = `
                inset 0 -${blurRadius}px ${blurRadius}px rgba(0, 170, 255, 0.7),
                ${offsetX}px ${offsetY}px ${blurRadius}px ${shadowColor},
                0 0 15px rgba(0, 170, 255, 0.4),
                0 0 30px rgba(0, 170, 255, 0.2)
              `;
            } else {
              // Position centrale
              el.style.boxShadow = `
                ${offsetX}px ${offsetY}px ${blurRadius}px ${shadowColor},
                0 0 15px rgba(0, 170, 255, 0.4),
                0 0 30px rgba(0, 170, 255, 0.2)
              `;
            }
            
            el.style.opacity = "1";
            
            // Ajouter un effet de vibration subtil - désactivé sur mobile
            if (!isMobile) {
              const time = Date.now() / 1000;
              const vibrationX = Math.sin(time * 2) * 0.5 * distanceFactor;
              const vibrationY = Math.cos(time * 2.3) * 0.5 * distanceFactor;
              el.style.transform = `translate(${vibrationX}px, ${vibrationY}px)`;
            }
          } else {
            // Mode torche normale
            el.style.boxShadow = `${offsetX}px ${offsetY}px ${blurRadius}px rgba(0, 0, 0, 0.5)`;
            el.style.opacity = adjustedOpacity.toString();
            el.style.transform = '';
          }
        } else {
          // Hors de portée
          el.style.boxShadow = "";
          el.style.opacity = "";
          el.style.transform = "";
        }
      });
    };

    // Exécuter la mise à jour initiale
    updateElements();

    // Pour mobile, utiliser requestAnimationFrame pour optimiser les performances
    if (isMobile) {
      let frameId: number;
      
      const animate = () => {
        updateElements();
        frameId = requestAnimationFrame(animate);
      };
      
      frameId = requestAnimationFrame(animate);
      
      return () => {
        cancelAnimationFrame(frameId);
        elementsToIlluminate.forEach((el) => {
          el.style.boxShadow = "";
          el.style.opacity = "";
          el.style.transform = "";
        });
      };
    } else {
      // Pour desktop, utiliser un écouteur d'événements pour les mises à jour
      const updateHandler = () => updateElements();
      window.addEventListener('mousemove', updateHandler);
      
      return () => {
        window.removeEventListener('mousemove', updateHandler);
        elementsToIlluminate.forEach((el) => {
          el.style.boxShadow = "";
          el.style.opacity = "";
          el.style.transform = "";
        });
      };
    }
  }, [mousePosition, elementsToIlluminate, isTorchActive, uvMode, isMobile]);

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
