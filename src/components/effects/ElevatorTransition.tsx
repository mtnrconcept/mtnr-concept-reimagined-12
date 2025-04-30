
import React, { useRef, useEffect } from 'react';
import { useBackgroundVideo } from '@/hooks/useBackgroundVideo';
import './ElevatorTransition.css';

interface ElevatorTransitionProps {
  /** Contenu de la page actuelle */
  current: React.ReactNode;
  /** Contenu de la page suivante */
  next: React.ReactNode;
  /** Passe à true pour démarrer la transition */
  isActive: boolean;
  /** Callback quand la transition est finie (après 7s) */
  onAnimationComplete: () => void;
}

const ElevatorTransition: React.FC<ElevatorTransitionProps> = ({
  current,
  next,
  isActive,
  onAnimationComplete
}) => {
  const { videoRef, currentVideo, playVideoTransition } = useBackgroundVideo({
    videoUrl:   '/ascenseur.mp4',
    videoUrlUV: '/ascenseur-uv.mp4',
  });

  const currentRef = useRef<HTMLDivElement>(null);
  const nextRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;
    // 1) Lance la vidéo
    playVideoTransition();

    // 2) Easy‐out des 2 premières secondes
    currentRef.current?.classList.add('exit-up');

    // 3) 5s après le début (7 – 2), easy‐in du contenu suivant
    const enterTimeout = window.setTimeout(() => {
      nextRef.current?.classList.add('enter-down');
    }, 5000);

    // 4) 7s pile -> fin de transition
    const finishTimeout = window.setTimeout(() => {
      onAnimationComplete();
      // reset des classes pour la prochaine fois
      currentRef.current?.classList.remove('exit-up');
      nextRef.current?.classList.remove('enter-down');
      nextRef.current?.classList.add('next-hidden');
    }, 7000);

    return () => {
      window.clearTimeout(enterTimeout);
      window.clearTimeout(finishTimeout);
    };
  }, [isActive, playVideoTransition, onAnimationComplete]);

  return (
    <div className="elevator-container">
      <video
        ref={videoRef}
        src={currentVideo}
        muted
        playsInline
        preload="auto"
        className="background-video"
      />
      <div ref={currentRef} className="elevator-content">
        {current}
      </div>
      <div ref={nextRef} className="elevator-content next-hidden">
        {next}
      </div>
    </div>
  );
};

export default ElevatorTransition;
