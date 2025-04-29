
import { useEffect, useRef, useState } from "react";

interface ElectricParticlesProps {
  targetSelector?: string;
  color?: string;
  quantity?: number;
}

export default function ElectricParticles({
  targetSelector = ".neon-text",
  color = "#eedd44",
  quantity = 8
}: ElectricParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    // Attendre un peu avant d'activer les particules
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const targetElement = document.querySelector(targetSelector) as HTMLElement;
    
    if (!targetElement) return;
    
    // Récupérer la position de l'élément cible
    const updatePosition = () => {
      const rect = targetElement.getBoundingClientRect();
      
      container.style.position = 'absolute';
      container.style.top = `${rect.top}px`;
      container.style.left = `${rect.left}px`;
      container.style.width = `${rect.width}px`;
      container.style.height = `${rect.height}px`;
    };
    
    // Créer les particules électriques
    const createParticles = () => {
      container.innerHTML = '';
      
      for (let i = 0; i < quantity; i++) {
        const particle = document.createElement('div');
        
        // Positionnement aléatoire autour du texte
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const size = Math.random() * 4 + 2;
        const animDuration = Math.random() * 3 + 2;
        const animDelay = Math.random() * 2;
        
        particle.className = 'absolute rounded-full pointer-events-none';
        particle.style.background = color;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.filter = 'blur(1px)';
        particle.style.boxShadow = `0 0 6px ${color}, 0 0 10px ${color}`;
        particle.style.opacity = '0';
        particle.style.animation = `electricParticle ${animDuration}s ease-in-out ${animDelay}s infinite`;
        
        container.appendChild(particle);
      }
    };
    
    // Initialiser
    updatePosition();
    createParticles();
    
    // Mettre à jour la position si nécessaire
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    
    // Nettoyer
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isActive, targetSelector, color, quantity]);
  
  return (
    <>
      <style jsx>{`
        @keyframes electricParticle {
          0% {
            opacity: 0;
            transform: translateY(0) translateX(0);
          }
          20% {
            opacity: 0.8;
            transform: translateY(-10px) translateX(5px);
          }
          40% {
            opacity: 0.4;
            transform: translateY(5px) translateX(10px);
          }
          60% {
            opacity: 0.8;
            transform: translateY(-5px) translateX(-5px);
          }
          80% {
            opacity: 0.3;
            transform: translateY(10px) translateX(5px);
          }
          100% {
            opacity: 0;
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>
      <div 
        ref={containerRef} 
        className="pointer-events-none overflow-visible z-10 fixed"
        aria-hidden="true"
      />
    </>
  );
}
