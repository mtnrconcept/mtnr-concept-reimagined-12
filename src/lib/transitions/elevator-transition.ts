
/**
 * Utilitaires pour la transition d'ascenseur
 */

// Ordre des pages pour déterminer la direction de l'ascenseur
export const pageOrder = ['/', '/what-we-do', '/artists', '/book', '/contact'];

/**
 * Détermine la direction de la transition d'ascenseur
 * @param currentPath Chemin actuel
 * @param previousPath Chemin précédent
 * @returns Direction: 'up', 'down', ou null si les chemins sont identiques
 */
export function determineElevatorDirection(
  currentPath: string,
  previousPath: string
): 'up' | 'down' | null {
  // Si c'est la même page, pas de direction
  if (currentPath === previousPath) return null;

  const currentIndex = pageOrder.indexOf(currentPath);
  const previousIndex = pageOrder.indexOf(previousPath);

  // Si les pages ne sont pas dans l'ordre défini, on utilise l'ordre lexicographique
  if (currentIndex === -1 || previousIndex === -1) {
    return currentPath > previousPath ? 'down' : 'up';
  }

  return currentIndex > previousIndex ? 'down' : 'up';
}

/**
 * Génère la configuration d'animation pour l'effet d'ascenseur
 * @param direction Direction de l'animation
 */
export function getElevatorAnimationConfig(direction: 'up' | 'down' | null) {
  return {
    initial: {
      y: direction === 'down' ? '-100%' : direction === 'up' ? '100%' : 0,
      filter: 'blur(0px)',
    },
    animate: {
      y: 0,
      filter: [
        'blur(0px)',
        'blur(8px)',
        'blur(12px)',
        'blur(8px)',
        'blur(0px)',
      ],
      transition: {
        y: { duration: 5, ease: [0.16, 1, 0.3, 1] },
        filter: { 
          duration: 5,
          times: [0, 0.2, 0.5, 0.8, 1],
          ease: [0.16, 1, 0.3, 1]
        }
      },
    },
    exit: {
      y: direction === 'down' ? '100%' : direction === 'up' ? '-100%' : 0,
      filter: [
        'blur(0px)',
        'blur(8px)',
        'blur(12px)',
        'blur(8px)',
        'blur(0px)',
      ],
      transition: {
        y: { duration: 5, ease: [0.7, 0, 0.84, 0] },
        filter: { 
          duration: 5, 
          times: [0, 0.2, 0.5, 0.8, 1],
          ease: [0.7, 0, 0.84, 0]
        }
      },
    },
  };
}
