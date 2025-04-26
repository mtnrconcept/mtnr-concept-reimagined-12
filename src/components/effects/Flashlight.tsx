
import { useState, useEffect, useRef } from 'react';
import { Flashlight as FlashlightIcon, FlashlightOff } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

export const Flashlight = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const shadowsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isEnabled) return;
      setPosition({ x: e.pageX, y: e.pageY });
    };

    const createShadowElement = (element: Element) => {
      const rect = element.getBoundingClientRect();
      const shadow = document.createElement('div');
      shadow.className = 'shadow-element';
      
      // Copier les styles de l'élément original
      const computedStyle = window.getComputedStyle(element);
      shadow.style.width = `${rect.width}px`;
      shadow.style.height = `${rect.height}px`;
      shadow.style.position = 'absolute';
      shadow.style.left = `${rect.left + window.scrollX}px`;
      shadow.style.top = `${rect.top + window.scrollY}px`;
      shadow.style.backgroundColor = 'black';
      shadow.style.opacity = '0';
      shadow.style.borderRadius = computedStyle.borderRadius;
      shadow.style.transition = 'transform 0.05s ease-out, opacity 0.1s ease-out';
      shadow.style.pointerEvents = 'none';
      shadow.dataset.elementType = element.tagName.toLowerCase();
      
      // Si l'élément a un attribut data-depth, l'utiliser pour l'effet d'ombre
      if (element.getAttribute('data-depth')) {
        shadow.dataset.depth = element.getAttribute('data-depth') || '';
      }
      
      return shadow;
    };

    const isElementVisible = (element: Element): boolean => {
      const rect = element.getBoundingClientRect();
      return (
        rect.width > 0 && 
        rect.height > 0 && 
        rect.top < window.innerHeight && 
        rect.bottom > 0 &&
        rect.left < window.innerWidth && 
        rect.right > 0
      );
    };

    const updateShadows = () => {
      if (!shadowsContainerRef.current || !isEnabled) return;
      
      // Sélectionner des éléments plus précis et pertinents pour les ombres
      const elements = document.querySelectorAll('.parallax-element, section, .card, h1, h2, p, img, button');
      shadowsContainerRef.current.innerHTML = '';
      
      elements.forEach(element => {
        if (!isElementVisible(element)) return;
        const shadow = createShadowElement(element);
        shadowsContainerRef.current?.appendChild(shadow);
      });
    };

    const animateShadows = () => {
      if (!isEnabled || !shadowsContainerRef.current) return;
      
      const shadows = shadowsContainerRef.current.querySelectorAll('.shadow-element');
      shadows.forEach(shadow => {
        const rect = (shadow as HTMLElement).getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;
        
        // Calculate angle and distance between light and element
        const dx = elementCenterX - position.x;
        const dy = elementCenterY - position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        // Ajuster l'effet d'ombre en fonction de la profondeur (si disponible)
        const depth = parseFloat((shadow as HTMLElement).dataset.depth || '0.5');
        const elementType = (shadow as HTMLElement).dataset.elementType || 'div';
        
        // Calculer l'offset de l'ombre basé sur la distance et le type d'élément
        let maxOffset = 50;
        if (elementType === 'h1' || elementType === 'h2') maxOffset = 30;
        if (elementType === 'p') maxOffset = 20;
        if (elementType === 'button') maxOffset = 15;
        
        // La distance affecte l'ombre de façon non-linéaire pour un effet plus réaliste
        const distanceFactor = Math.min(1, Math.pow(distance / 1000, 0.7));
        const offsetX = Math.cos(angle) * maxOffset * distanceFactor;
        const offsetY = Math.sin(angle) * maxOffset * distanceFactor;
        
        // Scale basé sur la distance et la profondeur
        const baseScale = 1;
        const scaleIncrease = Math.min(0.4, distance / 1200 + depth * 0.3);
        const shadowScale = baseScale + scaleIncrease;
        
        // Opacité qui diminue avec la distance à la source lumineuse
        let maxOpacity = 0.6;
        // Réduire l'opacité pour les petits éléments
        if (rect.width < 100 || rect.height < 50) maxOpacity = 0.4;
        if (distance > 800) maxOpacity *= 0.8; // Réduction progressive à grande distance
        
        const opacity = Math.min(maxOpacity, (distanceFactor * maxOpacity));
        
        (shadow as HTMLElement).style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${shadowScale})`;
        (shadow as HTMLElement).style.opacity = opacity.toString();
      });

      requestAnimationFrame(animateShadows);
    };

    if (isEnabled) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      updateShadows();
      requestAnimationFrame(animateShadows);
      
      // Mettre à jour les ombres lors du scroll
      window.addEventListener('scroll', updateShadows, { passive: true });
      // Mettre à jour les ombres si le contenu change
      const observer = new MutationObserver(updateShadows);
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', updateShadows);
        observer.disconnect();
      };
    }
  }, [isEnabled, position]);

  return (
    <>
      <Toggle 
        className="fixed right-4 top-24 z-[9999] bg-black/20 hover:bg-black/40"
        pressed={isEnabled}
        onPressedChange={setIsEnabled}
      >
        {isEnabled ? (
          <FlashlightIcon className="h-5 w-5 text-yellow-400" />
        ) : (
          <FlashlightOff className="h-5 w-5 text-yellow-400" />
        )}
      </Toggle>

      {/* Container pour les éléments d'ombre */}
      <div
        ref={shadowsContainerRef}
        className="fixed inset-0 z-[5] pointer-events-none"
      />

      {/* Effet de lumière */}
      {isEnabled && (
        <div
          className="pointer-events-none fixed inset-0 z-[20]"
          style={{
            maskImage: `radial-gradient(circle 600px at ${position.x}px ${position.y}px, transparent, black)`,
            WebkitMaskImage: `radial-gradient(circle 600px at ${position.x}px ${position.y}px, transparent, black)`,
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <div
            className="pointer-events-none absolute"
            style={{
              left: position.x,
              top: position.y,
              width: '1200px',
              height: '1200px',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(255, 221, 0, 0.2) 0%, rgba(255, 221, 0, 0.1) 30%, transparent 70%)',
              filter: 'blur(40px)',
              mixBlendMode: 'soft-light',
            }}
          />
        </div>
      )}
    </>
  );
};
