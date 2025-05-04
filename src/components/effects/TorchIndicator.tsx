
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUp } from 'lucide-react';

interface TorchIndicatorProps {
  className?: string;
}

export default function TorchIndicator({ className }: TorchIndicatorProps) {
  const [visible, setVisible] = useState(true);
  
  // Faire disparaître l'indicateur après une utilisation de la lampe torche
  useEffect(() => {
    const hasUsedTorch = localStorage.getItem('hasUsedTorch') === 'true';
    
    if (hasUsedTorch) {
      setVisible(false);
    }
    
    const handleTorchUsage = () => {
      localStorage.setItem('hasUsedTorch', 'true');
      setVisible(false);
    };
    
    document.addEventListener('click', handleTorchUsage);
    
    return () => {
      document.removeEventListener('click', handleTorchUsage);
    };
  }, []);
  
  if (!visible) return null;
  
  return (
    <div 
      className={cn(
        "fixed z-[199] bottom-20 right-4 flex flex-col items-center", 
        "animate-bounce",
        className
      )}
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
      <ArrowUp 
        className="text-yellow-400 w-8 h-8" 
        style={{
          filter: 'drop-shadow(0 0 5px rgba(255, 221, 0, 0.8)) drop-shadow(0 0 10px rgba(255, 221, 0, 0.5))',
          animation: 'neon-pulse 2s infinite'
        }}
      />
    </div>
  );
}
