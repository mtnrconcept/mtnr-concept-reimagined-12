
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { PaintSplash } from '@/components/parallax/PaintSplash';
import { useNavigation } from '@/components/effects/NavigationContext';
import { useUVMode } from '@/components/effects/UVModeContext';

interface PageSplashesProps {
  pageVariant?: 'home' | 'about' | 'services' | 'portfolio' | 'contact' | 'artists' | 'whatwedo' | 'book' | 'default';
}

export const PageSplashes = ({ pageVariant = 'default' }: PageSplashesProps) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { registerVideoTransitionListener } = useNavigation();
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
    const unregister = registerVideoTransitionListener(() => {
      console.log("Video transition triggered in PageSplashes");
      const paintElements = document.querySelectorAll('.parallax-element');
      paintElements.forEach(el => {
        // Animation plus intense pour les transitions vidéo
        el.classList.add('page-transition');
        
        // Retirer la classe après l'animation
        setTimeout(() => {
          el.classList.remove('page-transition');
        }, 3000);
      });
    });
    
    // Nettoyer l'écouteur lors du démontage
    return () => unregister();
  }, [registerVideoTransitionListener]);

  // Configurations des éclaboussures selon la page
  const getSplashConfigs = () => {
    // Configuration par défaut
    let splashes = [
      { x: 85, y: 10, depth: 0.7, scale: 2.2, rotation: -15, blur: 4,
        src: '/lovable-uploads/paint-splatter-hi.png', className: 'opacity-25', blendMode: 'screen' as const },
      { x: 15, y: 15, depth: 0.5, scale: 2.0, rotation: 20, blur: 3,
        src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'opacity-20', blendMode: 'overlay' as const },
      { x: 80, y: 70, depth: 0.3, scale: 1.6, rotation: -5, blur: 1,
        src: '/lovable-uploads/yellow-watercolor-splatter-3.png', className: 'opacity-40', blendMode: 'screen' as const },
      { x: 20, y: 60, depth: -0.1, scale: 1.2, rotation: 10, blur: 0,
        src: '/lovable-uploads/paint-splatter-hi.png', className: 'opacity-35', blendMode: 'soft-light' as const },
    ];
    
    // Ajout de configurations spécifiques par page
    switch(pageVariant) {
      case 'home':
        splashes = [
          ...splashes,
          { x: 75, y: 40, depth: -0.2, scale: 1.4, rotation: 8, blur: 0,
            src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'opacity-30', blendMode: 'multiply' as const },
          { x: 30, y: 20, depth: -0.3, scale: 1.1, rotation: -12, blur: 0,
            src: '/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png', className: 'opacity-25', blendMode: 'screen' as const },
        ];
        break;
      case 'about':
        splashes = [
          ...splashes,
          { x: 70, y: 30, depth: -0.15, scale: 1.3, rotation: -8, blur: 0,
            src: '/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png', className: 'opacity-30', blendMode: 'screen' as const },
        ];
        break;
      case 'artists':
        splashes = [
          ...splashes,
          { x: 68, y: 55, depth: -0.25, scale: 1.5, rotation: 15, blur: 0,
            src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'opacity-35', blendMode: 'multiply' as const },
          { x: 25, y: 35, depth: -0.4, scale: 1.2, rotation: -10, blur: 0,
            src: '/lovable-uploads/yellow-watercolor-splatter-3.png', className: 'opacity-30', blendMode: 'screen' as const },
        ];
        break;
      case 'whatwedo':
        splashes = [
          ...splashes,
          { x: 80, y: 50, depth: -0.3, scale: 1.6, rotation: -5, blur: 0,
            src: '/lovable-uploads/paint-splatter-hi.png', className: 'opacity-40', blendMode: 'soft-light' as const },
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
        blendMode: (splash.blendMode === 'multiply' ? 'screen' : splash.blendMode),
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
