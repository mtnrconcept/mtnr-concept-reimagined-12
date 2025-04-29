import { SmokeEffectOptions } from '@/hooks/useSmokeEffect';

/**
 * Générateur de presets de fumée avec adaptation dynamique
 * selon les capacités du dispositif (GPU/CPU).
 */

// Valeurs par défaut communes à tous les presets
const BASE_OPTIONS: Partial<SmokeEffectOptions> = {
  colorVariation: true,
  blurAmount: 1.0,
  turbulence: 0.4,
};

/**
 * Adapte un preset en fonction de la puissance matérielle.
 * Réduit ou augmente le nombre de particules et la vitesse.
 */
function adaptByPerformance(preset: SmokeEffectOptions): SmokeEffectOptions {
  const cores = navigator.hardwareConcurrency || 4;
  const performanceFactor = Math.min(1, cores / 8);
  return {
    ...preset,
    particleCount: Math.round(preset.particleCount * performanceFactor),
    speed: parseFloat((preset.speed * (0.8 + performanceFactor * 0.4)).toFixed(2)),
    turbulence: parseFloat((preset.turbulence * (0.8 + performanceFactor * 0.4)).toFixed(2)),
  };
}

/**
 * Génère un preset en fusionnant BASE_OPTIONS et les overrides fournis.
 * Introduit une légère variation de durée pour un effet organique.
 */
function createPreset(overrides: Partial<SmokeEffectOptions>): SmokeEffectOptions {
  const randomDurOffset = 0.9 + Math.random() * 0.2;
  return {
    ...BASE_OPTIONS,
    ...overrides,
    duration: Math.round((overrides.duration || 1500) * randomDurOffset),
  } as SmokeEffectOptions;
}

// Presets personnalisés pour les effets de smokes
export const smokeEffectPresets: SmokeEffectOptions[] = [
  createPreset({
    baseColor: '#FFD700',
    accentColor: '#FFF',
    direction: 'radial',
    speed: 1.2,
    intensity: 1.2,
    particleCount: 70,
    duration: 1500,
  }),
  createPreset({
    baseColor: '#F5DD00',
    accentColor: '#FFFFCC',
    direction: 'up',
    speed: 1.2,
    intensity: 1.1,
    particleCount: 80,
    duration: 1600,
  }),
  createPreset({
    baseColor: '#FFD700',
    accentColor: '#FFF',
    direction: 'custom',
    customAngle: 45,
    speed: 1.1,
    intensity: 1.2,
    particleCount: 65,
    duration: 1400,
  }),
].map(adaptByPerformance);

/**
 * Préréglage pour la transition de page, optimisé ease-in-out
 */
export const pageTransitionPreset: SmokeEffectOptions = adaptByPerformance(
  createPreset({
    baseColor: '#FFD700',
    accentColor: '#FFF',
    direction: 'radial',
    speed: 1.4,
    intensity: 1.6,
    particleCount: 110,
    duration: 1200,
  })
);
