
import { useEffect, useRef } from 'react';

interface Parallax3DOptions {
  strength?: number;
  perspective?: number;
  easing?: number;
}

export function use3DParallax(containerRef: React.RefObject<HTMLElement>, options: Parallax3DOptions = {}) {
  const {
    strength = 60, // Augmenté pour plus d'effet
    perspective = 1200, // Perspective plus courte pour amplifier l'effet
    easing = 0.05 // Légèrement plus fluide
  } = options;
  
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const lastPosition = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const scrollY = useRef(0);
  const lastScrollY = useRef(0);
  
  useEffect(() => {
    console.log("Initializing enhanced 3D parallax effect");
    
    const handleMouseMove = (e: MouseEvent) => {
      // Amplification du mouvement de la souris
      mouse.current.x = (e.clientX / window.innerWidth) * 2.5 - 1.25; // Amplifié
      mouse.current.y = (e.clientY / window.innerHeight) * 2.5 - 1.25; // Amplifié
      
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(animate);
      }
    };
    
    const handleScroll = () => {
      scrollY.current = window.scrollY;
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(animate);
      }
    };
    
    const animate = () => {
      // Animation plus fluide avec easing optimisé
      target.current.x += (mouse.current.x - target.current.x) * easing;
      target.current.y += (mouse.current.y - target.current.y) * easing;
      
      const scrollDelta = scrollY.current - lastScrollY.current;
      lastScrollY.current = scrollY.current;
      
      if (
        Math.abs(lastPosition.current.x - target.current.x) > 0.001 ||
        Math.abs(lastPosition.current.y - target.current.y) > 0.001 ||
        Math.abs(scrollDelta) > 0
      ) {
        updateParallaxElements(scrollDelta);
        lastPosition.current.x = target.current.x;
        lastPosition.current.y = target.current.y;
      }
      
      rafId.current = null;
      
      if (
        Math.abs(mouse.current.x - target.current.x) > 0.001 ||
        Math.abs(mouse.current.y - target.current.y) > 0.001
      ) {
        rafId.current = requestAnimationFrame(animate);
      }
    };
    
    const updateParallaxElements = (scrollDelta: number) => {
      if (!containerRef.current) return;
      
      const elements = containerRef.current.querySelectorAll<HTMLElement>('.parallax-element');
      const currentScrollY = scrollY.current;
      
      elements.forEach(el => {
        const depth = parseFloat(el.dataset.depth || '0.5');
        
        // Amplification massive de l'effet pour plus de profondeur
        const rotationX = target.current.y * strength * depth;
        const rotationY = -target.current.x * strength * depth;
        
        // Effet de parallax au scroll beaucoup plus prononcé
        const speedMultiplier = depth * 2.5; // Amplification par profondeur
        const translateY = currentScrollY * speedMultiplier;
        
        // Effet 3D amplifié
        const translateZ = depth * (-perspective * 2);
        
        // Ajout d'un mouvement latéral basé sur le scroll pour un effet plus dynamique
        const translateX = target.current.x * (strength * 2) * depth + (scrollDelta * depth * 0.5);
        
        // Échelle qui varie plus en fonction de la profondeur
        const scaleEffect = 1 + depth * 0.8;
        
        el.style.transform = `
          translate3d(${translateX}px, ${translateY}px, ${translateZ}px)
          rotateX(${rotationX}deg)
          rotateY(${rotationY}deg)
          scale(${scaleEffect})
        `;
        
        // Ombre dynamique plus prononcée basée sur la rotation
        const shadowIntensity = Math.abs(rotationX + rotationY) * 0.4;
        el.style.filter = `drop-shadow(0 ${shadowIntensity}px ${shadowIntensity * 3}px rgba(0,0,0,0.5))`;
      });
      
      // Traitement spécial pour l'arrière-plan - mouvement très lent mais perceptible
      const bgElements = document.querySelectorAll<HTMLElement>('[data-depth="0.08"]');
      bgElements.forEach(el => {
        if (el.classList.contains('parallax-element')) return;
        
        // Effet de parallax inversé pour le fond (crée plus de contraste avec les éléments)
        const moveX = target.current.x * strength * 0.05; // Très lent sur l'axe X
        const moveY = currentScrollY * 0.15; // Très lent sur l'axe Y pour l'effet de parallax
        
        el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.2)`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Force une première animation pour initialiser les positions
    scrollY.current = window.scrollY;
    requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [strength, perspective, easing]);
}
