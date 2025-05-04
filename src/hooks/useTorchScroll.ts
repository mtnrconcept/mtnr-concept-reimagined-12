
import { useEffect, useRef, useCallback } from 'react';
import { useIsMobile } from './use-mobile';

interface UseTorchScrollProps {
  isTorchActive: boolean;
  mousePosition: { x: number; y: number };
  isFingerDown?: boolean;
}

export function useTorchScroll({ isTorchActive, mousePosition, isFingerDown = true }: UseTorchScrollProps) {
  const scrollAnimationRef = useRef<number | null>(null);
  
  // Memoize scroll speed calculation for better performance
  const calculateScrollSpeed = useCallback((posY: number): number => {
    const windowHeight = window.innerHeight;
    const centerY = windowHeight / 2;
    
    // Zone morte au centre (20% de la hauteur de l'écran)
    const deadZone = windowHeight * 0.2;
    const topDeadZoneLimit = centerY - deadZone / 2;
    const bottomDeadZoneLimit = centerY + deadZone / 2;
    
    if (posY < topDeadZoneLimit) {
      // Défilement vers le haut
      const distanceFromTop = topDeadZoneLimit - posY;
      const maxTopDistance = topDeadZoneLimit;
      const percentage = Math.min(distanceFromTop / maxTopDistance, 1);
      return -(percentage * 20); // Jusqu'à -20px par frame
    } else if (posY > bottomDeadZoneLimit) {
      // Défilement vers le bas
      const distanceFromBottom = posY - bottomDeadZoneLimit;
      const maxBottomDistance = windowHeight - bottomDeadZoneLimit;
      const percentage = Math.min(distanceFromBottom / maxBottomDistance, 1);
      return percentage * 20; // Jusqu'à 20px par frame
    }
    
    // Dans la zone morte, pas de défilement
    return 0;
  }, []);
  
  useEffect(() => {
    // Nettoyage de l'animation précédente
    if (scrollAnimationRef.current !== null) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }
    
    // Démarrer l'animation uniquement si les conditions sont remplies
    if (!isTorchActive || !isFingerDown) {
      return;
    }
    
    // Fonction d'animation pour le défilement
    const scrollAnimation = () => {
      const speed = calculateScrollSpeed(mousePosition.y);
      if (speed !== 0) {
        window.scrollBy(0, speed);
      }
      scrollAnimationRef.current = requestAnimationFrame(scrollAnimation);
    };
    
    // Démarrer l'animation
    scrollAnimationRef.current = requestAnimationFrame(scrollAnimation);
    
    // Nettoyer l'animation lors du démontage ou des changements de dépendances
    return () => {
      if (scrollAnimationRef.current !== null) {
        cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }
    };
  }, [isTorchActive, mousePosition.y, isFingerDown, calculateScrollSpeed]);
  
  return { scrollAnimationRef };
}
