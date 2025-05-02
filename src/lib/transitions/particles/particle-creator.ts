
/**
 * Module pour la création des particules
 */

import { random } from '../utils';
import { ParticleType, ParticleElement } from './types';
import { adjustColorLightness, adjustColorSaturation } from './color-utils';

/**
 * Crée un élément particule avec ses propriétés
 */
export function createParticle(
  type: ParticleType,
  rect: DOMRect,
  color: string,
  direction: string,
  customAngle: number,
  speed: number,
  blurAmount: number,
  turbulence: number,
  opacity: number,
  rotationSpeed: number
): ParticleElement {
  // Calculer position initiale basée sur le rectangle de l'élément cible
  // Dispersion depuis le centre de l'élément pour un effet plus naturel
  let initialX: number, initialY: number;
  
  // Position aléatoire dans le rectangle avec concentration au centre
  const centerBias = Math.random() < 0.7; // 70% de chance d'être plus près du centre
  
  if (centerBias) {
    // Plus près du centre
    initialX = rect.left + rect.width * (0.3 + Math.random() * 0.4);
    initialY = rect.top + rect.height * (0.3 + Math.random() * 0.4);
  } else {
    // N'importe où dans le rectangle
    initialX = rect.left + Math.random() * rect.width;
    initialY = rect.top + Math.random() * rect.height;
  }
  
  // Direction de la dispersion
  let dirX = 0, dirY = 0;
  
  // Variable pour stocker force et angle en dehors du switch
  let force = 0;
  let angle = 0;
  
  switch(direction) {
    case 'up':
      dirX = random(-0.5, 0.5);
      dirY = random(-2, -1) * speed;
      break;
    case 'down':
      dirX = random(-0.5, 0.5);
      dirY = random(1, 2) * speed;
      break;
    case 'left':
      dirX = random(-2, -1) * speed;
      dirY = random(-0.5, 0.5);
      break;
    case 'right':
      dirX = random(1, 2) * speed;
      dirY = random(-0.5, 0.5);
      break;
    case 'custom':
      // Convertir l'angle en radians
      const angleRad = (customAngle * Math.PI) / 180;
      force = (1 + Math.random() * 0.5) * speed;
      dirX = Math.cos(angleRad) * force;
      dirY = Math.sin(angleRad) * force;
      break;
    case 'radial':
    default:
      // Direction radiale depuis le centre
      angle = Math.random() * Math.PI * 2;
      force = (0.5 + Math.random() * 1.5) * speed;
      dirX = Math.cos(angle) * force;
      dirY = Math.sin(angle) * force;
      break;
  }
  
  // Paramètres spécifiques selon le type de particule
  let size: number, particleOpacity: number, particleColor: string, blur: number;
  
  switch(type) {
    case 'smoke':
      size = random(20, 50) * speed;
      particleOpacity = random(0.4, 0.8) * opacity;
      particleColor = adjustColorLightness(color, random(-20, 20));
      blur = random(5, 12) * blurAmount;
      break;
    case 'spark':
      size = random(2, 8) * speed;
      particleOpacity = random(0.7, 1) * opacity;
      particleColor = adjustColorLightness(color, random(20, 40)); // Plus lumineux
      blur = random(0, 2) * blurAmount;
      break;
    case 'ember':
      size = random(4, 12) * speed;
      particleOpacity = random(0.6, 0.9) * opacity;
      particleColor = adjustColorSaturation(color, random(80, 100)); // Plus saturé
      blur = random(2, 6) * blurAmount;
      break;
  }
  
  // Créer l'élément DOM pour la particule
  const element = document.createElement('div');
  
  // Forme de base selon le type
  const borderRadius = type === 'spark' ? '50%' : '40%';
  
  element.style.cssText = `
    position: absolute;
    left: ${initialX}px;
    top: ${initialY}px;
    width: ${size}px;
    height: ${size}px;
    border-radius: ${borderRadius};
    background-color: ${particleColor};
    opacity: ${particleOpacity};
    filter: blur(${blur}px);
    transform: rotate(0deg);
    pointer-events: none;
    will-change: transform, opacity;
  `;
  
  // Facteurs de turbulence pour le mouvement aléatoire
  const turbulenceFactors = {
    x: random(-1, 1),
    y: random(-1, 1),
    time: random(0, 1000)
  };
  
  return {
    element,
    type,
    initialX,
    initialY,
    direction: { x: dirX, y: dirY },
    speed,
    size,
    opacity: particleOpacity,
    hue: 0, // Pour les variations de couleur pendant l'animation
    rotation: random(0, 360),
    rotationSpeed: random(-1, 1) * rotationSpeed * (type === 'smoke' ? 5 : 2),
    animationDelay: random(0, 500), // Délai avant que la particule commence à se déplacer
    turbulenceFactors
  };
}

/**
 * Crée un mélange de particules de différents types
 */
export function createParticleMix(
  count: number,
  rect: DOMRect,
  particles: ParticleElement[],
  baseColor: string,
  accentColor: string,
  direction: string,
  customAngle: number,
  intensity: number,
  speed: number,
  blurAmount: number,
  turbulence: number,
  smokeOpacity: number,
  mix: { smoke: number, spark: number, ember: number },
  rotationSpeed: number
) {
  // Distribution des différents types de particules
  const smokeCount = Math.round(count * mix.smoke);
  const sparkCount = Math.round(count * mix.spark);
  const emberCount = count - smokeCount - sparkCount;
  
  // Créer les particules de fumée
  for (let i = 0; i < smokeCount; i++) {
    const particle = createParticle('smoke', rect, baseColor, direction, customAngle, intensity * speed, blurAmount, turbulence, smokeOpacity, rotationSpeed);
    particles.push(particle);
  }
  
  // Créer les particules d'étincelles
  for (let i = 0; i < sparkCount; i++) {
    const particle = createParticle('spark', rect, accentColor, direction, customAngle, intensity * speed * 1.2, blurAmount * 0.3, turbulence * 1.5, smokeOpacity * 1.2, rotationSpeed * 1.5);
    particles.push(particle);
  }
  
  // Créer les particules de braises
  for (let i = 0; i < emberCount; i++) {
    const particle = createParticle('ember', rect, baseColor, direction, customAngle, intensity * speed * 1.1, blurAmount * 0.7, turbulence * 1.2, smokeOpacity * 1.1, rotationSpeed * 0.8);
    particles.push(particle);
  }
}
