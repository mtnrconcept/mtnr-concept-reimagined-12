
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { PaintSplash } from '@/components/parallax/PaintSplash';
import { TransitionController } from '@/lib/TransitionController';
import { useUVMode } from '@/components/effects/UVModeContext';

interface PageSplashesProps {
  pageVariant?: 'home' | 'about' | 'services' | 'portfolio' | 'contact' | 'artists' | 'whatwedo' | 'book' | 'default';
}

export const PageSplashes = ({ pageVariant = 'default' }: PageSplashesProps) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { uvMode } = useUVMode();
  
  // Effet pour synchroniser avec les transitions de page
  useEffect(() => {
    const paintElements = document.querySelectorAll('.parallax-element');
    paintElements.forEach(el => {
      // Ajouter une classe qui déclenche une animation temporaire
      el.classList.add('route-change-transition');
      
      // Retirer la classe après l'animation
      setTimeout(() => {
        el.classList.remove('route-change-transition');
      }, 1000);
    });
  }, [location.pathname]);
  
  // Synchroniser les transitions de splash avec les transitions vidéo
  useEffect(() => {
    const unsubscribe = TransitionController.i.on((state) => {
      if (state !== 'playing') return;
      const paintElements = document.querySelectorAll('.parallax-element');
      paintElements.forEach((el) => {
        el.classList.add('page-transition');
        setTimeout(() => {
          el.classList.remove('page-transition');
        }, 3000);
      });
    });

    return unsubscribe;
  }, []);


  // Configurations des éclaboussures selon la page avec une distribution sur l'axe Z
  const getSplashConfigs = () => {
    // Configuration par défaut avec une distribution complète sur l'axe Z (de -0.9 à 0.99)
    let splashes = [
      // TRÈS ÉLOIGNÉES (arrière-plan profond) - déplacement très lent au scroll
      { x: 85, y: 10, depth: 0.99, scale: 3.2, rotation: -15, blur: 10,
        src: '/lovable-uploads/paint-splatter-hi.png', className: 'opacity-15', blendMode: 'screen' as const },
      { x: 15, y: 15, depth: 0.95, scale: 3.0, rotation: 20, blur: 9,
        src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'opacity-10', blendMode: 'overlay' as const },
      
      // ÉLOIGNÉES (arrière-plan) - déplacement lent au scroll
      { x: 75, y: 20, depth: 0.8, scale: 2.5, rotation: -8, blur: 7,
        src: '/lovable-uploads/yellow-watercolor-splatter-3.png', className: 'opacity-15', blendMode: 'screen' as const },
      { x: 25, y: 65, depth: 0.7, scale: 2.3, rotation: 12, blur: 5,
        src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'opacity-20', blendMode: 'overlay' as const },
      
      // DISTANCE INTERMÉDIAIRE - déplacement modéré au scroll
      { x: 60, y: 40, depth: 0.5, scale: 1.8, rotation: -5, blur: 3,
        src: '/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png', className: 'opacity-25', blendMode: 'screen' as const },
      { x: 30, y: 30, depth: 0.3, scale: 1.5, rotation: 10, blur: 2,
        src: '/lovable-uploads/paint-splatter-hi.png', className: 'opacity-30', blendMode: 'soft-light' as const },
      
      // PLAN DE RÉFÉRENCE (proche du plan de la page) - déplacement léger au scroll
      { x: 80, y: 60, depth: 0.1, scale: 1.2, rotation: 8, blur: 1,
        src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'opacity-35', blendMode: 'overlay' as const },
      { x: 20, y: 80, depth: 0, scale: 1.0, rotation: -12, blur: 0,
        src: '/lovable-uploads/yellow-watercolor-splatter-3.png', className: 'opacity-40', blendMode: 'screen' as const },
      
      // PREMIER PLAN - déplacement rapide au scroll (sens opposé)
      { x: 70, y: 30, depth: -0.3, scale: 0.9, rotation: 5, blur: 0,
        src: '/lovable-uploads/paint-splatter-hi.png', className: 'opacity-45', blendMode: 'soft-light' as const },
      { x: 35, y: 55, depth: -0.5, scale: 0.8, rotation: -7, blur: 0,
        src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'opacity-50', blendMode: 'overlay' as const },
      
      // TRÈS PROCHE (premier plan) - déplacement très rapide au scroll
      { x: 45, y: 25, depth: -0.7, scale: 0.7, rotation: 10, blur: 0,
        src: '/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png', className: 'opacity-55', blendMode: 'screen' as const },
      { x: 10, y: 40, depth: -0.9, scale: 0.6, rotation: -15, blur: 0,
        src: '/lovable-uploads/paint-splatter-hi.png', className: 'opacity-60', blendMode: 'soft-light' as const },
    ];
    
    // Ajout de configurations spécifiques par page
    switch(pageVariant) {
      case 'home':
        splashes = [
          ...splashes,
          // Une éclaboussure centrale extrêmement proche
          { x: 50, y: 50, depth: -0.95, scale: 0.55, rotation: 8, blur: 0,
            src: '/lovable-uploads/paint-splatter-hi.png', className: 'opacity-65', blendMode: 'overlay' as const },
        ];
        break;
      case 'about':
        splashes = [
          ...splashes,
          // Éclaboussure ultra-éloignée
          { x: 70, y: 30, depth: 0.99, scale: 3.5, rotation: -8, blur: 12,
            src: '/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png', className: 'opacity-10', blendMode: 'screen' as const },
        ];
        break;
      case 'book':
        splashes = [
          ...splashes,
          // Éclaboussures spécifiques pour la page book - avec beaucoup de profondeur
          { x: 20, y: 20, depth: -0.92, scale: 0.58, rotation: -12, blur: 0,
            src: '/lovable-uploads/yellow-watercolor-splatter-3.png', className: 'opacity-60', blendMode: 'screen' as const },
          { x: 80, y: 70, depth: 0.97, scale: 3.3, rotation: 15, blur: 11,
            src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'opacity-10', blendMode: 'overlay' as const },
          { x: 50, y: 85, depth: -0.8, scale: 0.7, rotation: 0, blur: 0,
            src: '/lovable-uploads/paint-splatter-hi.png', className: 'opacity-50', blendMode: 'soft-light' as const },
        ];
        break;
      case 'artists':
        splashes = [
          ...splashes,
          // Éclaboussures spécifiques pour la page artistes
          { x: 68, y: 55, depth: -0.85, scale: 0.65, rotation: 15, blur: 0,
            src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'opacity-55', blendMode: 'overlay' as const },
          { x: 25, y: 35, depth: 0.98, scale: 3.2, rotation: -10, blur: 11,
            src: '/lovable-uploads/yellow-watercolor-splatter-3.png', className: 'opacity-10', blendMode: 'screen' as const },
        ];
        break;
      case 'whatwedo':
        splashes = [
          ...splashes,
          // Une éclaboussure très proche et une très éloignée pour maximiser l'effet de profondeur
          { x: 80, y: 35, depth: -0.95, scale: 0.55, rotation: -5, blur: 0,
            src: '/lovable-uploads/paint-splatter-hi.png', className: 'opacity-65', blendMode: 'soft-light' as const },
          { x: 40, y: 75, depth: 0.99, scale: 3.4, rotation: 20, blur: 12,
            src: '/lovable-uploads/yellow-watercolor-splatter-3.png', className: 'opacity-10', blendMode: 'screen' as const },
        ];
        break;
      // Autres configurations de page selon les besoins
      default:
        // Utiliser la configuration par défaut
        break;
    }
    
    // En mode UV, certaines éclaboussures peuvent avoir des effets différents
    if (uvMode) {
      splashes = splashes.map(splash => ({
        ...splash,
        className: splash.className.replace('opacity-25', 'opacity-40').replace('opacity-20', 'opacity-35'),
        // Si c'était overlay avant, on le garde overlay
        blendMode: splash.blendMode,
      }));
    }
    
    return splashes;
  };
  
  const splashConfigs = getSplashConfigs();

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-10"
      style={{ 
        perspective: '2000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {splashConfigs.map((splash, index) => (
        <PaintSplash
          key={`paint-${pageVariant}-${index}`}
          x={splash.x}
          y={splash.y}
          depth={splash.depth}
          scale={splash.scale}
          rotation={splash.rotation}
          className={splash.className}
          src={splash.src}
          blur={splash.blur}
          blendMode={splash.blendMode}
        />
      ))}
    </div>
  );
};
