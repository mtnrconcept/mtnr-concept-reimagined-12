
import React, { useRef, useEffect } from 'react';
import { useBackgroundVideoStore } from '../BackgroundVideoController';
import '../../../styles/elevator.css';

interface ElevatorTransitionProps {
  current: React.ReactNode;
  next?: React.ReactNode;
  isActive: boolean;
  onAnimationComplete: () => void;
}

const ElevatorTransition: React.FC<ElevatorTransitionProps> = ({
  current,
  next,
  isActive,
  onAnimationComplete
}) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { startVideo } = useBackgroundVideoStore();

  useEffect(() => {
    if (isActive && next) {
      // Démarrer la vidéo
      startVideo('forward');
      
      // Nettoyer les anciens timeouts si nécessaire
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // La transition se termine après 7s (2s sortie + 3s vidéo + 2s entrée)
      timeoutRef.current = setTimeout(() => {
        onAnimationComplete();
        console.log('Transition terminée');
      }, 7000);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive, startVideo, onAnimationComplete, next]);

  // Si pas de transition active, afficher simplement le contenu actuel
  if (!isActive || !next) {
    return <div className="elevator-content">{current}</div>;
  }

  return (
    <div className="elevator-container">
      {/* Contenu sortant */}
      <div className="elevator-content exit-content exit-up">
        {current}
      </div>

      {/* Contenu entrant (commence caché) */}
      <div 
        className="elevator-content enter-content" 
        style={{
          visibility: 'hidden',
          animationDelay: '5s',
        }}
        onAnimationStart={(e) => {
          // Rendre visible au début de l'animation d'entrée
          (e.target as HTMLDivElement).style.visibility = 'visible';
        }}
      >
        {next}
      </div>
    </div>
  );
}

export default ElevatorTransition;
