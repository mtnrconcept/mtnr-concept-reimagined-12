
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useTorch } from './TorchContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface TorchIndicatorProps {
  className?: string;
}

export default function TorchIndicator({ className }: TorchIndicatorProps) {
  const { isTorchActive } = useTorch();
  const isMobile = useIsMobile();
  const [torchButtonPosition, setTorchButtonPosition] = useState({ top: 0, left: 0 });
  
  // Afficher l'indicateur seulement quand la torche est désactivée
  if (isTorchActive) return null;
  
  useEffect(() => {
    const updatePosition = () => {
      // Pour mobile, nous ciblons le bouton dans la navbar
      const button = document.getElementById('mobile-torch-button');
      // Pour desktop, nous ciblons le bouton de torche en bas à droite
      const desktopButton = document.querySelector('.fixed.bottom-4.right-4 button:first-child');
      
      const targetButton = isMobile ? button : desktopButton;
      
      if (targetButton) {
        const rect = targetButton.getBoundingClientRect();
        setTorchButtonPosition({
          top: rect.top - (isMobile ? 40 : 70), // Position au-dessus du bouton avec un espace
          left: rect.left + rect.width / 2, // Centré par rapport au bouton
        });
      }
    };
    
    // Mettre à jour la position immédiatement et à chaque redimensionnement
    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    // Observer les changements dans le DOM qui pourraient affecter la position du bouton
    const observer = new MutationObserver(updatePosition);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      observer.disconnect();
    };
  }, [isMobile]);
  
  // Position dynamique basée sur la position du bouton
  const indicatorStyle = {
    position: 'fixed',
    zIndex: 250,
    top: `${torchButtonPosition.top}px`,
    left: `${torchButtonPosition.left}px`,
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    animation: 'bounce 1s infinite',
  };
  
  return (
    <div 
      className={cn(
        "animate-bounce",
        className
      )}
      style={indicatorStyle}
    >
      <span
        className="text-yellow-400 font-bold mb-2 whitespace-nowrap"
        style={{
          textShadow: '0 0 5px rgba(255, 221, 0, 0.8), 0 0 10px rgba(255, 221, 0, 0.5), 0 0 15px rgba(255, 221, 0, 0.3)',
          animation: 'neon-pulse 2s infinite'
        }}
      >
        Active la lampe
      </span>
      <ArrowDown 
        className="text-yellow-400 w-8 h-8" 
        style={{
          filter: 'drop-shadow(0 0 5px rgba(255, 221, 0, 0.8)) drop-shadow(0 0 10px rgba(255, 221, 0, 0.5))',
          animation: 'neon-pulse 2s infinite'
        }}
      />
    </div>
  );
}
