
// Déclaration de variables globales pour TypeScript
interface Window {
  pageTransitionInProgress: boolean;
  requestIdleCallback(
    callback: () => void,
    options?: { timeout: number }
  ): number;
  cancelIdleCallback(handle: number): void;
}
