
import { useEffect, useRef } from 'react';
import { useIsMobile } from './use-mobile';

interface UseTorchScrollProps {
  isTorchActive: boolean;
  mousePosition: { x: number; y: number };
  isFingerDown?: boolean; // Nouvelle prop pour détecter si le doigt est en contact avec l'écran
}

export function useTorchScroll({ isTorchActive, mousePosition, isFingerDown = true }: UseTorchScrollProps) {
  const scrollAnimationRef = useRef<number | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Fonction pour calculer la vitesse de défilement en fonction de la position Y
    const calculateScrollSpeed = (posY: number): number => {
      const windowHeight = window.innerHeight;
      const centerY = windowHeight / 2;
      
      // Zone morte au centre (20% de la hauteur de l'écran) où aucun défilement ne se produit
      const deadZone = windowHeight * 0.2;
      const topDeadZoneLimit = centerY - deadZone / 2;
      const bottomDeadZoneLimit = centerY + deadZone / 2;
      
      if (posY < topDeadZoneLimit) {
        // Défilement vers le haut, vitesse variable selon la distance au centre
        // Plus le curseur est haut, plus on défile rapidement vers le haut
        const distanceFromTop = topDeadZoneLimit - posY;
        const maxTopDistance = topDeadZoneLimit;
        const percentage = Math.min(distanceFromTop / maxTopDistance, 1);
        return -(percentage * 20); // Jusqu'à -20px par frame
      } else if (posY > bottomDeadZoneLimit) {
        // Défilement vers le bas, vitesse variable selon la distance au centre
        // Plus le curseur est bas, plus on défile rapidement vers le bas
        const distanceFromBottom = posY - bottomDeadZoneLimit;
        const maxBottomDistance = windowHeight - bottomDeadZoneLimit;
        const percentage = Math.min(distanceFromBottom / maxBottomDistance, 1);
        return percentage * 20; // Jusqu'à 20px par frame
      }
      
      // Dans la zone morte, pas de défilement
      return 0;
    };
    
    // Fonction d'animation pour le défilement
    const scrollAnimation = () => {
      if (isTorchActive && isFingerDown) {
        const speed = calculateScrollSpeed(mousePosition.y);
        if (speed !== 0) {
          window.scrollBy(0, speed);
        }
        scrollAnimationRef.current = requestAnimationFrame(scrollAnimation);
      }
    };
    
    // Démarrer l'animation si la torche est active ET que le doigt est sur l'écran
    if (isTorchActive && isFingerDown) {
      scrollAnimationRef.current = requestAnimationFrame(scrollAnimation);
    } else {
      // Arrêter l'animation si le doigt n'est plus sur l'écran
      if (scrollAnimationRef.current !== null) {
        cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }
    }
    
    // Nettoyer l'animation lors de la désactivation de la torche ou lorsque le doigt est retiré
    return () => {
      if (scrollAnimationRef.current !== null) {
        cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }
    };
  }, [isTorchActive, mousePosition.y, isFingerDown]);
  
  return { scrollAnimationRef };
}
