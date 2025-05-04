
/**
 * Utilitaires pour les transitions et les effets
 */

/**
 * Génère un nombre aléatoire entre min et max
 */
export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Permet d'attendre un certain temps
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Déclaration globale pour stocker l'état de la transition de page
 */
declare global {
  interface Window {
    pageTransitionInProgress: boolean;
  }
}

// Initialiser la variable globale si elle n'existe pas
if (typeof window !== 'undefined') {
  window.pageTransitionInProgress = window.pageTransitionInProgress || false;
}
