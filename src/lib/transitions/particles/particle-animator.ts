
/**
 * Module pour l'animation des particules
 */

import { ParticleElement } from './types';

/**
 * Fonction d'easing pour l'animation ease-in-out (démarrage doux, accélération, décélération)
 * @param t valeur entre 0 et 1
 * @returns valeur transformée avec ease-in-out
 */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

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
  
  // Utiliser l'easing cubique pour une animation plus fluide (ease-in-out)
  const easedProgress = easing ? easing(progress) : easeInOutCubic(progress);
  
  // Calcul des transformations
  const moveDistance = 100 * speed * easedProgress;
  
  // Appliquer turbulence, gravité et effet de vent
  const turbulenceFactor = turbulence * Math.sin((progress * 10) + (turbulenceFactors?.time || 0));
  const turbX = turbulenceFactors ? turbulenceFactors.x * turbulenceFactor * 20 : 0;
  const turbY = turbulenceFactors ? turbulenceFactors.y * turbulenceFactor * 20 : 0;
  
  // Appliquer gravité avec easing pour un effet plus naturel
  const gravityEffect = gravity * easedProgress * easedProgress * 50; // L'accélération de la gravité est progressive
  
  // Appliquer effet de vent avec easing 
  const windEffectValue = windEffect * easedProgress * 20;
  
  const newX = initialX + (direction.x * moveDistance) + turbX + windEffectValue;
  const newY = initialY + (direction.y * moveDistance) + turbY + gravityEffect;
  
  // Rotation progressive avec easing
  const rotation = particle.rotation + (rotationSpeed * easedProgress * 360);
  
  // Opacité qui diminue avec le temps, avec courbe personnalisée selon le type
  let opacityFactor: number;
  
  switch(particle.type) {
    case 'smoke':
      // La fumée reste visible plus longtemps puis s'estompe
      // Courbe modifiée avec easing pour une disparition plus douce
      opacityFactor = progress < 0.6 ? 1 : 1 - easeInOutCubic((progress - 0.6) / 0.4);
      break;
    case 'spark':
      // Les étincelles s'estompent plus tôt et plus rapidement
      opacityFactor = 1 - easeInOutCubic(progress) * 1.2;
      break;
    case 'ember':
      // Les braises restent visibles puis s'estompent rapidement à la fin
      opacityFactor = progress < 0.7 ? 1 - (progress * 0.3) : 1 - easeInOutCubic((progress - 0.7) / 0.3) - 0.21;
      break;
    default:
      opacityFactor = 1 - easedProgress;
  }
  
  opacityFactor = Math.max(0, Math.min(1, opacityFactor));
  
  // Taille qui peut augmenter pour la fumée, et diminuer pour les étincelles
  let scaleFactor: number;
  
  switch(particle.type) {
    case 'smoke':
      // La fumée grossit avec ease-in-out pour un effet plus fluide
      scaleFactor = 1 + easedProgress * growFactor;
      break;
    case 'spark':
      // Les étincelles rétrécissent
      scaleFactor = 1 - easedProgress * 0.7;
      break;
    case 'ember':
      // Les braises grossissent légèrement puis rétrécissent avec courbe ease-in-out
      scaleFactor = progress < 0.4 
        ? 1 + easeInOutCubic(progress / 0.4) * 0.3 
        : 1 + 0.3 - easeInOutCubic((progress - 0.4) / 0.6) * 0.5;
      break;
    default:
      scaleFactor = 1;
  }
  
  // Appliquer les transformations avec will-change pour optimiser les performances
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
