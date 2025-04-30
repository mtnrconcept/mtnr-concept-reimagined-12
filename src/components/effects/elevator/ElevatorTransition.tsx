
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ElevatorTransitionProps } from "./ElevatorTypes";
import { useElevatorTransition } from "./useElevatorTransition";
import { useVideoStore } from "@/components/effects/BackgroundVideoManager";

export function ElevatorTransition({
  children,
  isActive,
  onAnimationComplete,
}: ElevatorTransitionProps) {
  // Get current location for path
  const location = useLocation();
  
  // Get video store for controlling background video playback
  const videoStore = useVideoStore();
  
  // Use the elevator transition hook with required props
  const elevatorTransition = useElevatorTransition({
    isActive,
    onAnimationComplete,
    currentPath: location.pathname,
  });

  // Play video when transition activates
  useEffect(() => {
    if (isActive && videoStore.play) {
      videoStore.play();
    }
  }, [isActive, videoStore]);

  return (
    <div
      className="relative w-full h-full"
      style={{
        opacity: isActive ? 1 : 0,
        transition: `opacity 0.5s ease-in-out`,
        pointerEvents: isActive ? "none" : "auto",
      }}
    >
      {children}
    </div>
  );
}

export default ElevatorTransition;
