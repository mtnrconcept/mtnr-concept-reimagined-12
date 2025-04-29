
import { SmokeEffectOptions } from '@/hooks/useSmokeEffect';

// Préréglages d'effets optimisés pour la fluidité
export const smokeEffectPresets: SmokeEffectOptions[] = [
  {
    baseColor: '#FFD700', // Jaune
    accentColor: '#FFFFFF',
    direction: 'radial',
    speed: 0.8, // Vitesse réduite pour plus de fluidité
    intensity: 1.2, // Intensité réduite
    particleCount: 100, // Moins de particules pour de meilleures performances
    turbulence: 0.4, // Moins de turbulence pour des mouvements plus prévisibles
    duration: 2000, // Plus court pour plus de réactivité
    colorVariation: true,
    blurAmount: 1.0, // Moins de flou pour de meilleures performances
  },
  {
    baseColor: '#F5DD00',
    accentColor: '#FFFFCC',
    direction: 'up',
    speed: 0.9,
    intensity: 1.1,
    particleCount: 120,
    turbulence: 0.5,
    duration: 2200,
    colorVariation: true,
    blurAmount: 0.8,
  },
  {
    baseColor: '#FFD700',
    accentColor: '#FFFFFF',
    direction: 'custom',
    customAngle: 45, // 45 degrés (en haut à droite)
    speed: 0.75,
    intensity: 1.2,
    particleCount: 90,
    turbulence: 0.3,
    duration: 1800,
    colorVariation: true,
    blurAmount: 0.7,
  }
];

// Préréglage spécifique pour les transitions de page (optimisé pour la performance)
export const pageTransitionPreset: SmokeEffectOptions = {
  baseColor: '#FFD700',
  accentColor: '#FFFFFF',
  particleCount: 100, // Réduit pour de meilleures performances
  direction: 'radial',
  speed: 1.0,
  intensity: 1.3,
  turbulence: 0.4, // Réduit pour des mouvements plus fluides
  duration: 1000, // Plus rapide pour de meilleures transitions
  colorVariation: true,
  blurAmount: 0.8, // Moins de flou pour de meilleures performances
};
