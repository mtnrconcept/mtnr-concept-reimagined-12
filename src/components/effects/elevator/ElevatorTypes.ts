
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
  videoRef: React.RefObject<HTMLVideoElement>;
  currentPath: ReactNode;  // Modifié de string à ReactNode pour correspondre au type attendu
}

export interface UseElevatorTransitionReturn {
  direction: TransitionDirection;
  exitContent: ReactNode | null;
  enterContent: ReactNode | null;
  contentEntranceDelay: number;
}
