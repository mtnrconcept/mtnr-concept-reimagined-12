
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  phase: 'normal' | 'uv' | 'complete';
}

export const ProgressBar = ({ progress, phase }: ProgressBarProps) => {
  const [glitchEffect, setGlitchEffect] = useState(false);
  
  // Effet de glitch quand on passe de normal à UV
  useEffect(() => {
    if (phase === 'uv') {
      const interval = setInterval(() => {
        setGlitchEffect(prev => !prev);
      }, 100);
      
      // Nettoyer après 1 seconde
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setGlitchEffect(false);
      }, 1000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [phase]);

  return (
    <div className="w-full">
      {/* Affichage du pourcentage */}
      <div className="flex justify-between mb-2">
        <motion.span
          className="text-sm font-mono"
          style={{ 
            color: phase === 'uv' ? '#D2FF3F' : '#FFDD00',
            transition: 'color 0.5s ease-out',
            textShadow: phase === 'uv' 
              ? '0 0 5px rgba(210, 255, 63, 0.8)' 
              : '0 0 5px rgba(255, 221, 0, 0.5)'
          }}
          animate={{ 
            x: glitchEffect ? [-2, 2, -1, 1, 0] : 0,
            opacity: glitchEffect ? [1, 0.8, 1, 0.9, 1] : 1
          }}
          transition={{ duration: 0.2 }}
        >
          {progress < 100 ? `CHARGEMENT` : `COMPLET`}
        </motion.span>
        <motion.span
          className="text-sm font-mono"
          style={{ 
            color: phase === 'uv' ? '#D2FF3F' : '#FFDD00',
            transition: 'color 0.5s ease-out',
            textShadow: phase === 'uv' 
              ? '0 0 5px rgba(210, 255, 63, 0.8)' 
              : '0 0 5px rgba(255, 221, 0, 0.5)'
          }}
          animate={{ 
            x: glitchEffect ? [2, -2, 1, -1, 0] : 0,
            opacity: glitchEffect ? [1, 0.7, 1, 0.8, 1] : 1
          }}
          transition={{ duration: 0.2 }}
        >
          {`${Math.min(100, progress)}%`}
        </motion.span>
      </div>
      
      {/* Conteneur de la barre de progression */}
      <div 
        className="w-full h-2 bg-gray-800 rounded-full overflow-hidden relative"
        style={{ 
          boxShadow: phase === 'uv' 
            ? '0 0 8px rgba(79, 169, 255, 0.5)' 
            : '0 0 8px rgba(255, 221, 0, 0.3)',
          transition: 'box-shadow 0.5s ease-out'
        }}
      >
        {/* Barre de progression animée */}
        <motion.div
          className="h-full rounded-full"
          style={{ 
            background: phase === 'uv'
              ? 'linear-gradient(90deg, #4FA9FF, #D2FF3F)'
              : 'linear-gradient(90deg, #FFDD00, #FFA500)',
            boxShadow: phase === 'uv'
              ? '0 0 15px rgba(210, 255, 63, 0.8)' 
              : '0 0 15px rgba(255, 221, 0, 0.5)',
            transition: 'all 0.5s ease-out'
          }}
          initial={{ width: '0%' }}
          animate={{ 
            width: `${Math.min(100, progress)}%`,
            x: glitchEffect ? [2, -3, 1, -1, 0] : 0
          }}
          transition={{ 
            width: { duration: 0.5, ease: 'easeOut' },
            x: { duration: 0.1 }
          }}
        />
        
        {/* Ligne de scintillement */}
        <motion.div
          className="absolute top-0 bottom-0 w-20 transform translate-x-full"
          style={{
            background: `linear-gradient(90deg, 
              transparent 0%, 
              ${phase === 'uv' ? 'rgba(210, 255, 63, 0.5)' : 'rgba(255, 221, 0, 0.5)'} 50%, 
              transparent 100%)`,
            opacity: progress < 100 ? 0.7 : 0
          }}
          animate={{
            left: ['-20%', '120%'],
            opacity: progress < 100 ? [0, 0.7, 0] : 0
          }}
          transition={{
            left: { repeat: Infinity, duration: 1.5, ease: 'linear' },
            opacity: { duration: 0.3 }
          }}
        />
      </div>
    </div>
  );
};
