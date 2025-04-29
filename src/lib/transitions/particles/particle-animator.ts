
/**
 * Module pour l'animation des particules
 */

import { ParticleElement } from './types';

/**
 * Met à jour la position et l'apparence d'une particule pendant l'animation
 */
export function updateParticle(
  particle: ParticleElement,
  progress: number,
  easing: (t: number) => number,
  options: {
    growFactor: number;
    colorVariation: boolean;
    gravity: number;
    windEffect: number;
    turbulence: number;
  }
) {
  const { element, initialX, initialY, direction, speed, rotationSpeed, turbulenceFactors } = particle;
  const { growFactor, colorVariation, gravity, windEffect, turbulence } = options;
  
  const easedProgress = easing(progress);
  
  // Calcul des transformations
  const moveDistance = 100 * speed * easedProgress;
  
  // Appliquer turbulence, gravité et effet de vent
  const turbulenceFactor = turbulence * Math.sin((progress * 10) + (turbulenceFactors?.time || 0));
  const turbX = turbulenceFactors ? turbulenceFactors.x * turbulenceFactor * 20 : 0;
  const turbY = turbulenceFactors ? turbulenceFactors.y * turbulenceFactor * 20 : 0;
  
  // Appliquer gravité (augmente avec le temps)
  const gravityEffect = gravity * easedProgress * 50;
  
  // Appliquer effet de vent (constant)
  const windEffectValue = windEffect * 20;
  
  const newX = initialX + (direction.x * moveDistance) + turbX + windEffectValue;
  const newY = initialY + (direction.y * moveDistance) + turbY + gravityEffect;
  
  // Rotation progressive
  const rotation = particle.rotation + (rotationSpeed * easedProgress * 360);
  
  // Opacité qui diminue avec le temps
  let opacityFactor: number;
  
  switch(particle.type) {
    case 'smoke':
      // La fumée reste visible plus longtemps puis s'estompe
      opacityFactor = progress < 0.7 ? 1 : 1 - ((progress - 0.7) / 0.3);
      break;
    case 'spark':
      // Les étincelles s'estompent plus tôt et plus rapidement
      opacityFactor = 1 - easedProgress * 1.2;
      break;
    case 'ember':
      // Les braises restent visibles puis s'estompent rapidement
      opacityFactor = progress < 0.8 ? 1 - (progress * 0.3) : 1 - ((progress - 0.8) / 0.2) - 0.24;
      break;
    default:
      opacityFactor = 1 - easedProgress;
  }
  
  opacityFactor = Math.max(0, Math.min(1, opacityFactor));
  
  // Taille qui peut augmenter pour la fumée, et diminuer pour les étincelles
  let scaleFactor: number;
  
  switch(particle.type) {
    case 'smoke':
      // La fumée grossit
      scaleFactor = 1 + easedProgress * growFactor;
      break;
    case 'spark':
      // Les étincelles rétrécissent
      scaleFactor = 1 - easedProgress * 0.7;
      break;
    case 'ember':
      // Les braises grossissent légèrement puis rétrécissent
      scaleFactor = progress < 0.3 ? 1 + progress : 1 + 0.3 - ((progress - 0.3) * 0.5);
      break;
    default:
      scaleFactor = 1;
  }
  
  // Appliquer les transformations
  element.style.transform = `translate(${newX - initialX}px, ${newY - initialY}px) rotate(${rotation}deg) scale(${scaleFactor})`;
  element.style.opacity = `${particle.opacity * opacityFactor}`;
  
  // Pour les braises et les étincelles, on peut faire varier la couleur
  if (colorVariation && (particle.type === 'ember' || particle.type === 'spark')) {
    particle.hue += 0.5; // Changement subtil de teinte
    if (particle.type === 'ember') {
      element.style.backgroundColor = `hsl(${particle.hue % 30 + 35}, 100%, 60%)`; // Variations de jaune-orangé
    }
  }
}
