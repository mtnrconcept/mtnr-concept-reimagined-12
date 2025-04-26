
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export const NeonLogo = () => {
  const [glowIntensity, setGlowIntensity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(Math.random() * 0.4 + 0.8); // Variation entre 0.8 et 1.2
    }, 50); // Scintillement rapide

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex justify-center items-center py-12 relative z-30">
      <div 
        className={cn(
          "relative w-[500px] max-w-[90vw]",
          "transition-all duration-50 ease-in-out"
        )}
        style={{
          filter: `drop-shadow(0 0 5px rgba(255, 221, 0, ${glowIntensity * 0.5}))
                  drop-shadow(0 0 10px rgba(255, 221, 0, ${glowIntensity * 0.3}))
                  drop-shadow(0 0 15px rgba(255, 221, 0, ${glowIntensity * 0.2}))`
        }}
      >
        <img 
          src="/lovable-uploads/abe06f9b-f700-4a49-a4d8-b4d68c473e70.png"
          alt="MTNR Concept"
          className="w-full h-auto"
          draggable={false}
        />
      </div>
    </div>
  );
};
