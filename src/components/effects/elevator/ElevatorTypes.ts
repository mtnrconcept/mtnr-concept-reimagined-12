
export type TransitionDirection = 'up' | 'down' | null;

export interface ElevatorTransitionProps {
  children: React.ReactNode;
  isActive: boolean;
  onAnimationComplete: () => void;
}

export interface UseElevatorTransitionProps {
  isActive: boolean;
  onAnimationComplete: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  currentPath: string;
}

export interface UseElevatorTransitionReturn {
  direction: TransitionDirection;
  exitContent: React.ReactNode | null;
  enterContent: React.ReactNode | null;
  contentEntranceDelay: number;
}
