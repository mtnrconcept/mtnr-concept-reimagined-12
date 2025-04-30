
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
  const [animationState, setAnimationState] = useState<"idle" | "exiting" | "entering">("idle");
  const videoRef = useRef<HTMLVideoElement>(null);
  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const enterTimerRef = useRef<NodeJS.Timeout | null>(null);
  const completeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset animation state and clear timers when not active
  useEffect(() => {
    if (!isActive) {
      setAnimationState("idle");
      clearAllTimers();
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
  };

  const startTransition = () => {
    // 1. Start exit animation
    setAnimationState("exiting");
    
    // Trigger the video to play
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(err => console.error("Error playing video:", err));
    }
    
    // 2. Schedule enter animation after 5s
    exitTimerRef.current = setTimeout(() => {
      setAnimationState("entering");
    }, 5000);
    
    // 3. Schedule animation complete after 7s total
    completeTimerRef.current = setTimeout(() => {
      setAnimationState("idle");
      onAnimationComplete();
    }, 7000);
  };

  return (
    <div className="elevator-container">
      {/* Background video */}
      <video 
        ref={videoRef}
        className="background-video"
        src="/lovable-uploads/ascensceur.mp4"
        muted
        preload="auto"
      />
      
      {/* Current content */}
      <div className={`elevator-content exit-content ${animationState === "exiting" ? "exit-up" : ""}`}>
        {current}
      </div>
      
      {/* Next content */}
      {next && animationState === "entering" && (
        <div className="elevator-content enter-content">
          {next}
        </div>
      )}
    </div>
  );
}
