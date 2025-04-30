
import { ReactNode } from 'react';

export type TransitionDirection = 'up' | 'down' | null;

export interface ElevatorTransitionProps {
  children: ReactNode;
  isActive: boolean;
  onAnimationComplete: () => void;
}

export interface UseElevatorTransitionProps {
  isActive: boolean;
  onAnimationComplete: () => void;
  currentPath: ReactNode;
}

export interface UseElevatorTransitionReturn {
  direction: TransitionDirection;
  exitContent: ReactNode | null;
  enterContent: ReactNode | null;
  contentEntranceDelay: number;
  isTransitioning: boolean;
  repetileActive: boolean;
  loopCount: number;
  maxLoops: number;
  finalSlideActive: boolean;
}
