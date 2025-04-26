
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
      shadow.style.transition = 'transform 0.05s ease-out';
      shadow.style.pointerEvents = 'none';
      
      return shadow;
    };

    const updateShadows = () => {
      if (!shadowsContainerRef.current || !isEnabled) return;
      
      const elements = document.querySelectorAll('.parallax-element, section, .card, h1, h2, p, img, button');
      shadowsContainerRef.current.innerHTML = '';
      
      elements.forEach(element => {
        if (!element.isVisible) return;
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
        
        // Calculate shadow offset based on distance
        const maxOffset = 50;
        const offsetFactor = Math.min(1, distance / 1000);
        const offsetX = Math.cos(angle) * maxOffset * offsetFactor;
        const offsetY = Math.sin(angle) * maxOffset * offsetFactor;
        
        // Calculate shadow scale based on distance
        const baseScale = 1;
        const maxScaleIncrease = 0.5;
        const scaleIncrease = Math.min(maxScaleIncrease, distance / 1000);
        const shadowScale = baseScale + scaleIncrease;
        
        // Calculate opacity based on distance
        const maxOpacity = 0.6;
        const opacity = Math.min(maxOpacity, (distance / 1000) * maxOpacity);
        
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
