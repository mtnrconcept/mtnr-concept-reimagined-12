
import React, { useEffect, useRef, useState, ReactNode } from "react";
import "../../../styles/elevator.css";

interface ElevatorTransitionProps {
  current: ReactNode;
  next?: ReactNode;
  isActive: boolean;
  onAnimationComplete: () => void;
}

export default function ElevatorTransition({
  current,
  next,
  isActive,
  onAnimationComplete
}: ElevatorTransitionProps) {
  const [animationState, setAnimationState] = useState<"idle" | "exiting" | "entering" | "video-playing">("idle");
  const videoRef = useRef<HTMLVideoElement>(null);
  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const enterTimerRef = useRef<NodeJS.Timeout | null>(null);
  const completeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const videoVisibleRef = useRef<NodeJS.Timeout | null>(null);

  // Précharger la vidéo au montage du composant
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      console.log("Vidéo préchargée");
    }
    
    // Nettoyage à la destruction du composant
    return () => clearAllTimers();
  }, []);

  // Reset animation state and clear timers when not active
  useEffect(() => {
    if (!isActive) {
      setAnimationState("idle");
      clearAllTimers();
      
      // Cacher la vidéo quand inactive
      if (videoRef.current) {
        videoRef.current.classList.remove('video-visible');
      }
    }
  }, [isActive]);

  // Manage transition sequence
  useEffect(() => {
    if (isActive && animationState === "idle") {
      startTransition();
    }

    return () => clearAllTimers();
  }, [isActive, animationState]);

  const clearAllTimers = () => {
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    if (videoVisibleRef.current) clearTimeout(videoVisibleRef.current);
  };

  const startTransition = () => {
    // 1. Start exit animation
    setAnimationState("exiting");
    console.log("Début de la transition - sortie du contenu actuel");
    
    // Préparer la vidéo et la démarrer après un court délai
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      
      // Démarrer la vidéo après 1s pour laisser le contenu commencer à sortir
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play()
            .then(() => {
              console.log("Lecture vidéo démarrée");
              videoRef.current?.classList.add('video-visible');
              setAnimationState("video-playing");
            })
            .catch(err => {
              console.error("Erreur de lecture vidéo:", err);
              // Continuer la transition même en cas d'erreur vidéo
              setAnimationState("video-playing");
            });
        }
      }, 1000);
    }
    
    // 2. Schedule enter animation après 5s (durée totale: sortie 2.5s + vidéo centrale 2s)
    enterTimerRef.current = setTimeout(() => {
      setAnimationState("entering");
      console.log("Entrée du nouveau contenu");
      
      // Commencer à masquer la vidéo quand le nouveau contenu arrive
      if (videoRef.current) {
        videoRef.current.classList.remove('video-visible');
      }
    }, 4500);
    
    // 3. Schedule animation complete après 8s total (plus de temps pour permettre la transition complète)
    completeTimerRef.current = setTimeout(() => {
      setAnimationState("idle");
      onAnimationComplete();
      console.log("Transition complète");
    }, 8000);
  };

  return (
    <div className="elevator-container">
      {/* Background video */}
      <video 
        ref={videoRef}
        className="background-video"
        src="/lovable-uploads/ascensceur.mp4"
        muted
        playsInline
        preload="auto"
      />
      
      {/* Current content */}
      <div className={`elevator-content exit-content ${animationState === "exiting" || animationState === "video-playing" || animationState === "entering" ? "exit-up" : ""}`}>
        {current}
      </div>
      
      {/* Next content */}
      {next && (animationState === "entering" || animationState === "idle" && isActive) && (
        <div className="elevator-content enter-content">
          {next}
        </div>
      )}
    </div>
  );
}
