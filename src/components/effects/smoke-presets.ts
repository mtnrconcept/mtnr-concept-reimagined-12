
import { SmokeEffectOptions } from '@/hooks/useSmokeEffect';

// Préréglages d'effets pour varier les animations
export const smokeEffectPresets: SmokeEffectOptions[] = [
  {
    baseColor: '#FFD700', // Jaune
    accentColor: '#FFFFFF',
    direction: 'radial',
    speed: 1,
    intensity: 1.5,
    particleCount: 150,
    turbulence: 0.6,
    duration: 3000,
    colorVariation: true,
    blurAmount: 1.2,
  },
  {
    baseColor: '#F5DD00', // Jaune légèrement différent
    accentColor: '#FFFFCC', // Jaune pâle
    direction: 'up',
    speed: 1.2,
    intensity: 1.3,
    particleCount: 180,
    turbulence: 0.8,
    duration: 3000,
    colorVariation: true,
    blurAmount: 1.5,
  },
  {
    baseColor: '#FFD700',
    accentColor: '#FFFFFF',
    direction: 'custom',
    customAngle: 45, // 45 degrés (en haut à droite)
    speed: 0.9,
    intensity: 1.6,
    particleCount: 130,
    turbulence: 0.4,
    duration: 3000,
    colorVariation: true,
    blurAmount: 1.0,
  }
];

// Préréglage spécifique pour les transitions de page
export const pageTransitionPreset: SmokeEffectOptions = {
  baseColor: '#FFD700',
  accentColor: '#FFFFFF',
  particleCount: 180,
  direction: 'radial',
  speed: 1.3,
  intensity: 1.5,
  turbulence: 0.7,
  duration: 1200,
  colorVariation: true,
  blurAmount: 1.2,
};
