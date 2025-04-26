
import { useState, useEffect, useRef } from 'react';
import { Flashlight as FlashlightIcon, FlashlightOff } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

export const Flashlight = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const shadowsContainerRef = useRef<HTMLDivElement>(null);
  const shadowElements = useRef<Map<string, HTMLElement>>(new Map());
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isEnabled) return;
      setPosition({ x: e.pageX, y: e.pageY });
    };
    
    // Fonction pour créer un élément d'ombre
    const createShadowElement = (element: Element, index: number): HTMLElement => {
      const rect = element.getBoundingClientRect();
      const shadow = document.createElement('div');
      const id = `shadow-${index}`;
      shadow.id = id;
      shadow.className = 'shadow-element';
      
      // Styles de base pour l'ombre
      shadow.style.position = 'absolute';
      shadow.style.left = `${rect.left + window.scrollX}px`;
      shadow.style.top = `${rect.top + window.scrollY}px`;
      shadow.style.width = `${rect.width}px`;
      shadow.style.height = `${rect.height}px`;
      shadow.style.backgroundColor = 'black';
      shadow.style.borderRadius = window.getComputedStyle(element).borderRadius;
      shadow.style.pointerEvents = 'none';
      shadow.style.opacity = '0';
      shadow.style.transition = 'opacity 0.2s ease-out';
      shadow.style.zIndex = '1';
      shadow.style.filter = 'blur(4px)';
      
      // Stocker des informations sur l'élément pour les calculs d'ombre
      shadow.dataset.elementType = element.tagName.toLowerCase();
      shadow.dataset.elementId = id;
      
      // Si l'élément a un attribut data-depth, l'utiliser pour l'effet d'ombre
      if (element.getAttribute('data-depth')) {
        shadow.dataset.depth = element.getAttribute('data-depth') || '';
      }
      
      return shadow;
    };

    const isElementVisible = (element: Element): boolean => {
      const rect = element.getBoundingClientRect();
      return (
        rect.width > 5 && 
        rect.height > 5 && 
        rect.top < window.innerHeight && 
        rect.bottom > 0 &&
        rect.left < window.innerWidth && 
        rect.right > 0
      );
    };

    const updateShadows = () => {
      if (!shadowsContainerRef.current || !isEnabled) return;
      
      // Vider le conteneur d'ombres
      shadowElements.current.clear();
      
      // On cible des éléments plus spécifiques et visibles
      const selectorList = [
        '.parallax-element', 'section', '.card', 
        'h1', 'h2', 'h3', 'p', 'img', 'button',
        'div[data-depth]', 'a', '.shadow-receiver'
      ];
      const selector = selectorList.join(', ');
      const elements = document.querySelectorAll(selector);
      
      // Vider le conteneur d'ombres
      shadowsContainerRef.current.innerHTML = '';
      
      // Créer une ombre pour chaque élément visible
      elements.forEach((element, index) => {
        if (!isElementVisible(element)) return;
        
        // Ignorer les éléments trop petits ou déjà des ombres
        if (element.classList.contains('shadow-element')) return;
        
        const shadow = createShadowElement(element, index);
        shadowsContainerRef.current?.appendChild(shadow);
        shadowElements.current.set(`shadow-${index}`, shadow);
      });
    };

    const updateShadowPositions = () => {
      if (!isEnabled || !shadowsContainerRef.current) return;
      
      shadowElements.current.forEach((shadow) => {
        // Récupérer l'ID de l'élément d'ombre
        const elementId = shadow.dataset.elementId || '';
        const elementType = shadow.dataset.elementType || 'div';
        
        // Position de l'ombre
        const rect = shadow.getBoundingClientRect();
        const shadowCenterX = rect.left + rect.width / 2;
        const shadowCenterY = rect.top + rect.height / 2;
        
        // Calculer l'angle et la distance entre la source lumineuse et l'élément
        const dx = position.x - shadowCenterX;
        const dy = position.y - shadowCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        // Angle opposé à la source de lumière
        const angle = Math.atan2(-dy, -dx);
        
        // Ajuster l'effet d'ombre en fonction de la profondeur (si disponible)
        const depth = parseFloat(shadow.dataset.depth || '0.5');
        
        // Calculer l'offset de l'ombre basé sur la distance et le type d'élément
        // Plus l'élément est éloigné de la source lumineuse, plus l'ombre est prononcée
        let maxOffset = 20; // Valeur de base plus petite pour éviter les grands déplacements
        if (elementType === 'h1' || elementType === 'h2') maxOffset = 15;
        if (elementType === 'p') maxOffset = 10;
        if (elementType === 'button' || elementType === 'a') maxOffset = 8;
        
        // Distance minimale pour éviter les effets extrêmes à proximité immédiate
        const minDistance = 100;
        const effectiveDistance = Math.max(minDistance, distance);
        
        // Calculer le déplacement en fonction de la distance (inversement proportionnel à la distance)
        const offsetFactor = Math.min(1, 800 / effectiveDistance);
        const offsetX = Math.cos(angle) * maxOffset * offsetFactor;
        const offsetY = Math.sin(angle) * maxOffset * offsetFactor;
        
        // Scale légèrement pour donner un effet de profondeur
        const baseScale = 1;
        const scaleIncrease = Math.min(0.1, distance / 5000 + depth * 0.1);
        const shadowScale = baseScale + scaleIncrease;
        
        // Calculer l'opacité de l'ombre en fonction de la distance
        // Plus la source lumineuse est proche, plus l'ombre est intense
        const maxOpacity = 0.5; // Opacité maximum réduite
        const minOpacity = 0.1; // Opacité minimum
        
        // Calculer l'opacité en fonction de la distance (inversement proportionnelle)
        const opacityFactor = Math.min(1, 1000 / effectiveDistance);
        const opacity = minOpacity + (maxOpacity - minOpacity) * opacityFactor;
        
        // Ajuster le flou en fonction de la distance
        const blur = 3 + Math.min(8, distance / 200);
        
        // Appliquer les transformations à l'ombre
        shadow.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${shadowScale})`;
        shadow.style.opacity = opacity.toString();
        shadow.style.filter = `blur(${blur}px)`;
      });
    };

    const animateLoop = () => {
      if (!isEnabled) return;
      
      updateShadowPositions();
      rafId.current = requestAnimationFrame(animateLoop);
    };

    if (isEnabled) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      updateShadows();
      animateLoop();
      
      // Mettre à jour les ombres lors du scroll ou du redimensionnement
      window.addEventListener('scroll', updateShadows, { passive: true });
      window.addEventListener('resize', updateShadows, { passive: true });
      
      // Surveiller les changements dans le DOM pour mettre à jour les ombres
      const observer = new MutationObserver(() => {
        // Utiliser un debounce simple pour éviter trop de recalculs
        if (rafId.current) cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
          updateShadows();
          updateShadowPositions();
        });
      });
      
      observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'] 
      });

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', updateShadows);
        window.removeEventListener('resize', updateShadows);
        observer.disconnect();
        if (rafId.current) cancelAnimationFrame(rafId.current);
      };
    } else {
      // Nettoyer les ombres quand la lampe est désactivée
      if (shadowsContainerRef.current) {
        shadowsContainerRef.current.innerHTML = '';
      }
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
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

      {/* Conteneur pour les éléments d'ombre */}
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
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(1px)',
            transition: 'backdrop-filter 0.3s ease',
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
              background: 'radial-gradient(circle, rgba(255, 221, 0, 0.15) 0%, rgba(255, 221, 0, 0.08) 30%, transparent 70%)',
              filter: 'blur(40px)',
              mixBlendMode: 'soft-light',
            }}
          />
        </div>
      )}
    </>
  );
};

