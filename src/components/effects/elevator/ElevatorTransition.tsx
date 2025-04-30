
import React, { useEffect } from "react";
import { ElevatorTransitionProps } from "./ElevatorTypes";
import { useElevatorTransition } from "./useElevatorTransition";
import { useVideoStore } from "@/components/effects/BackgroundVideoManager";

export function ElevatorTransition({
  children,
  isActive,
  onAnimationComplete,
  customDuration,
  fadeInClass,
  fadeOutClass,
  easing = "cubic-bezier(0.65, 0, 0.35, 1)",
}: ElevatorTransitionProps) {
  const { containerRef, isVisible, transitionStyles } = useElevatorTransition({
    isActive,
    onAnimationComplete,
    customDuration,
    easing,
  });

  // Access the video store to play videos on transition
  const videoStore = useVideoStore();

  useEffect(() => {
    if (isActive) {
      // When transition activates, play the appropriate video
      if (videoStore.play) {
        videoStore.play();
      }
    }
  }, [isActive, videoStore]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${transitionStyles.duration} ${easing}`,
        pointerEvents: isActive ? "none" : "auto",
      }}
    >
      {children}
    </div>
  );
}
