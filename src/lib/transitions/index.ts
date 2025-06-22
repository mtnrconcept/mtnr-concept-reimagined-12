
/**
 * Main export file for transition effects
 * Provides simplified access to all transition functions
 */

export { createLogoDisperseEffect } from './particles/disperse-effect';
export type { DisperseOptions } from './particles/disperse-effect';
export { createPageTransitionEffect } from './particles/page-transition';
export { createSmokeEffect } from './smoke-effect';
export { createSmokeTextEffect } from './smoke-text-effect';
export { createOptimizedDisperseEffect } from './optimized-disperse';
export { random } from './utils';
export * from './particles/types';

// Legacy support for older code paths
import { createPageTransitionEffect } from './particles/page-transition';
export const createParticleEffect = createPageTransitionEffect;
