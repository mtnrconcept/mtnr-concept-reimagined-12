
/**
 * Main module for particle effects
 */

// Re-export all effect functions from their respective modules
export { createLogoDisperseEffect, type DisperseOptions } from './particles/disperse-effect';
export { createPageTransitionEffect } from './particles/page-transition';

// Legacy support - redirect to newer functions
export function createParticleEffect(container: HTMLElement | null) {
  return createPageTransitionEffect(container);
}
