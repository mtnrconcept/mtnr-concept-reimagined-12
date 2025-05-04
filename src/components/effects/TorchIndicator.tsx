
import React from 'react';
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
  
  // Afficher l'indicateur seulement quand la torche est désactivée
  if (isTorchActive) return null;
  
  // Sur mobile, l'indicateur pointe vers le haut (vers le bouton de la torche dans la navbar)
  if (isMobile) {
    return (
      <div 
        className={cn(
          "fixed z-[250] top-24 left-1/2 flex flex-col items-center animate-bounce",
          className
        )}
        style={{
          transform: 'translateX(-50%)',
        }}
      >
        <ArrowUp 
          className="text-yellow-400 w-8 h-8 mb-2" 
          style={{
            filter: 'drop-shadow(0 0 5px rgba(255, 221, 0, 0.8)) drop-shadow(0 0 10px rgba(255, 221, 0, 0.5))',
            animation: 'neon-pulse 2s infinite'
          }}
        />
        <span
          className="text-yellow-400 font-bold whitespace-nowrap"
          style={{
            textShadow: '0 0 5px rgba(255, 221, 0, 0.8), 0 0 10px rgba(255, 221, 0, 0.5), 0 0 15px rgba(255, 221, 0, 0.3)',
            animation: 'neon-pulse 2s infinite'
          }}
        >
          Active la lampe
        </span>
      </div>
    );
  }
  
  // Sur desktop, on maintient le comportement actuel (indicateur centré en bas)
  return (
    <div 
      className={cn(
        "fixed z-[250] bottom-24 flex flex-col items-center animate-bounce",
        className
      )}
      style={{
        transform: 'translateX(-50%)',
        left: '50%',
        right: 'auto'
      }}
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
