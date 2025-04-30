
import { ReactNode } from 'react';

export type TransitionDirection = 'up' | 'down' | null;
export type AnimationPhase = 'loop' | 'slide' | null;

export interface ElevatorTransitionProps {
  children: ReactNode;
  isActive: boolean;
  onAnimationComplete: () => void;
}

export interface UseElevatorTransitionProps {
  isActive: boolean;
  onAnimationComplete: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  currentPath: ReactNode;
}

export interface UseElevatorTransitionReturn {
  direction: TransitionDirection;
  exitContent: ReactNode | null;
  enterContent: ReactNode | null;
  contentEntranceDelay: number;
  isTransitioning: boolean;
  animationPhase: AnimationPhase;
}
