
import { useEffect, useRef, useCallback } from 'react';
import { useIsMobile } from './use-mobile';

interface UseTorchScrollProps {
  isTorchActive: boolean;
  mousePosition: { x: number; y: number };
  isFingerDown?: boolean;
}

export function useTorchScroll({ isTorchActive, mousePosition, isFingerDown = true }: UseTorchScrollProps) {
  const scrollAnimationRef = useRef<number | null>(null);
  const isMobile = useIsMobile();
  
  // Optimisation : mémoisation du calcul de vitesse de défilement
  const calculateScrollSpeed = useCallback((posY: number): number => {
    const windowHeight = window.innerHeight;
    const centerY = windowHeight / 2;
    
    // Zone morte au centre (30% de la hauteur de l'écran pour plus de confort)
    const deadZonePercentage = isMobile ? 0.3 : 0.25;
    const deadZone = windowHeight * deadZonePercentage;
    const topDeadZoneLimit = centerY - deadZone / 2;
    const bottomDeadZoneLimit = centerY + deadZone / 2;
    
    // Vitesse maximale réduite pour un défilement plus doux
    const maxSpeed = isMobile ? 12 : 15;
    
    if (posY < topDeadZoneLimit) {
      // Défilement vers le haut
      const distanceFromTop = topDeadZoneLimit - posY;
      const maxTopDistance = topDeadZoneLimit;
      const percentage = Math.min(distanceFromTop / maxTopDistance, 1);
      return -(percentage * maxSpeed); // Jusqu'à -maxSpeed px par frame
    } else if (posY > bottomDeadZoneLimit) {
      // Défilement vers le bas
      const distanceFromBottom = posY - bottomDeadZoneLimit;
      const maxBottomDistance = windowHeight - bottomDeadZoneLimit;
      const percentage = Math.min(distanceFromBottom / maxBottomDistance, 1);
      return percentage * maxSpeed; // Jusqu'à maxSpeed px par frame
    }
    
    // Dans la zone morte, pas de défilement
    return 0;
  }, [isMobile]);
  
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
    
    // Pour éviter des conflits avec le scroll natif sur mobile
    if (isMobile && !isFingerDown) {
      return;
    }
    
    // Fonction d'animation pour le défilement avec écrêtage de la vitesse
    const scrollAnimation = () => {
      const speed = calculateScrollSpeed(mousePosition.y);
      
      // N'appliquer le défilement que si la vitesse est significative (éviter les micro-déplacements)
      if (Math.abs(speed) > 0.5) {
        window.scrollBy({
          top: speed,
          behavior: 'auto'  // 'auto' au lieu de 'smooth' pour éviter l'accumulation d'inertie
        });
      }
      
      scrollAnimationRef.current = requestAnimationFrame(scrollAnimation);
    };
    
    // Démarrer l'animation avec un délai pour éviter les déclenchements accidentels
    const timeoutId = setTimeout(() => {
      scrollAnimationRef.current = requestAnimationFrame(scrollAnimation);
    }, 100);
    
    // Nettoyer l'animation et le timeout lors du démontage ou des changements de dépendances
    return () => {
      clearTimeout(timeoutId);
      if (scrollAnimationRef.current !== null) {
        cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }
    };
  }, [isTorchActive, mousePosition.y, isFingerDown, calculateScrollSpeed, isMobile]);
  
  return { scrollAnimationRef };
}
