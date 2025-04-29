
import { SmokeEffectOptions } from '@/hooks/useSmokeEffect';

// Préréglages d'effets optimisés pour la fluidité et la performance
export const smokeEffectPresets: SmokeEffectOptions[] = [
  {
    baseColor: '#FFD700', // Jaune
    accentColor: '#FFFFFF',
    direction: 'radial',
    speed: 1.2, // Vitesse augmentée pour une animation plus rapide
    intensity: 1.2,
    particleCount: 70, // Nombre de particules réduit pour de meilleures performances
    turbulence: 0.4,
    duration: 1500, // Durée réduite pour une animation plus rapide
    colorVariation: true,
    blurAmount: 1.0,
  },
  {
    baseColor: '#F5DD00',
    accentColor: '#FFFFCC',
    direction: 'up',
    speed: 1.2,
    intensity: 1.1,
    particleCount: 80,
    turbulence: 0.5,
    duration: 1600, // Durée réduite
    colorVariation: true,
    blurAmount: 0.8,
  },
  {
    baseColor: '#FFD700',
    accentColor: '#FFFFFF',
    direction: 'custom',
    customAngle: 45,
    speed: 1.1,
    intensity: 1.2,
    particleCount: 65,
    turbulence: 0.3,
    duration: 1400, // Durée réduite
    colorVariation: true,
    blurAmount: 0.7,
  }
];

// Préréglage amélioré pour les transitions de page (optimisé pour la performance)
export const pageTransitionPreset: SmokeEffectOptions = {
  baseColor: '#FFD700',
  accentColor: '#FFFFFF',
  particleCount: 90, // Nombre de particules réduit
  direction: 'radial',
  speed: 1.3,  // Vitesse augmentée
  intensity: 1.5,
  turbulence: 0.5,
  duration: 800, // Durée significativement réduite pour une transition plus rapide
  colorVariation: true,
  blurAmount: 1.2,
};
