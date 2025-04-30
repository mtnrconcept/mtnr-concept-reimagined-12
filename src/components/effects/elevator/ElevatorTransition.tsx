
import React, { useRef, useEffect, useState } from 'react';
import { ElevatorTransitionProps } from './ElevatorTypes';
import { useBackgroundVideoStore } from '../BackgroundVideoController';

const ElevatorTransition: React.FC<ElevatorTransitionProps> = ({
  children,
  isActive,
  onAnimationComplete
}) => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [exitContent, setExitContent] = useState<React.ReactNode>(null);
  const [enterContent, setEnterContent] = useState<React.ReactNode>(null);
  const { startVideo } = useBackgroundVideoStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Lancer l'animation quand isActive passe à true
  useEffect(() => {
    if (isActive && !animationStarted) {
      // Stocker le contenu actuel pour l'animation de sortie
      setExitContent(children);
      setEnterContent(children);
      setAnimationStarted(true);
      
      // 1. Démarrer la vidéo
      startVideo('forward');
      
      // 2. Animation de sortie terminée après 2s
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      // 3. Animation d'entrée après 5s (2s sortie + 3s vidéo)
      timeoutRef.current = setTimeout(() => {
        // Animation d'entrée
        console.log("Animation d'entrée commence");
      }, 5000);
      
      // 4. Fin de la transition complète après 7s
      timeoutRef.current = setTimeout(() => {
        setAnimationStarted(false);
        onAnimationComplete();
        console.log('Transition terminée');
      }, 7000);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive, children, animationStarted, startVideo, onAnimationComplete]);

  if (!isActive && !animationStarted) {
    return (
      <div id="main-content" className="elevator-content">
        {children}
      </div>
    );
  }

  return (
    <div className="elevator-container">
      {/* Contenu sortant avec animation de sortie vers le haut */}
      <div 
        className={`elevator-content exit-content ${animationStarted ? 'animate-slide-out-up' : ''}`}
      >
        {exitContent}
      </div>

      {/* Contenu entrant avec animation d'entrée par le bas */}
      <div 
        className={`elevator-content enter-content ${animationStarted ? 'animate-slide-in-up' : ''}`}
        style={{ animationDelay: '5s' }} // Démarre après 5s
      >
        {enterContent}
      </div>
    </div>
  );
};

export default ElevatorTransition;
