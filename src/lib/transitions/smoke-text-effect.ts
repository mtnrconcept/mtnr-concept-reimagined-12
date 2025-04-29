
/**
 * Effet de fumée/brouillard inspiré de MechCoders
 * Applique un effet de dispersion de style fumée aux éléments texte ou image
 */

import { random } from './utils';
import { createSafeFilter } from '@/lib/animation-utils';

// Options pour personnaliser l'effet de fumée
interface SmokeTextOptions {
  particleCount?: number;         // Nombre de particules de fumée
  duration?: number;              // Durée de l'animation en ms
  baseColor?: string;             // Couleur de base des particules
  accentColor?: string;           // Couleur d'accent pour certaines particules
  onComplete?: () => void;        // Callback à la fin de l'animation
  easing?: (t: number) => number; // Fonction d'easing pour l'animation
  direction?: 'up' | 'down' | 'left' | 'right' | 'radial' | 'custom'; // Direction de dispersion
  customAngle?: number;           // Angle personnalisé (en degrés) si direction = 'custom'
  intensity?: number;             // Intensité de l'effet (taille et vitesse)
  speed?: number;                 // Multiplicateur de vitesse global
  colorVariation?: boolean;       // Activer la variation de couleurs
  blurAmount?: number;            // Quantité de flou
  turbulence?: number;            // Niveau de turbulence dans le mouvement
  smokeOpacity?: number;          // Opacité max de la fumée (0-1)
  growFactor?: number;            // Facteur de croissance des particules
  particleMix?: {                 // Distribution des types de particules
    smoke?: number;               // Pourcentage de particules de fumée (0-1)
    spark?: number;               // Pourcentage de particules d'étincelles (0-1)
    ember?: number;               // Pourcentage de particules de braises (0-1)
  };
  gravity?: number;               // Effet de gravité (positif = vers le bas)
  windEffect?: number;            // Effet de vent (positif = vers la droite)
  rotationSpeed?: number;         // Vitesse de rotation des particules
}

// Types de particules
type ParticleType = 'smoke' | 'spark' | 'ember';

// Interface pour les éléments de particules
interface ParticleElement {
  element: HTMLDivElement;
  type: ParticleType;
  initialX: number;
  initialY: number;
  direction: { x: number; y: number };
  speed: number;
  size: number;
  opacity: number;
  hue: number;
  rotation: number;
  rotationSpeed: number;
  animationDelay: number;
  turbulenceFactors?: {
    x: number;
    y: number;
    time: number;
  };
}

/**
 * Applique un effet de fumée/dispersion à un élément
 */
export function createSmokeTextEffect(
  targetElement: HTMLElement | null, 
  options: SmokeTextOptions = {}
) {
  if (!targetElement) return { cancel: () => {} };
  
  // Fusionner les options par défaut avec celles fournies
  const {
    particleCount = 100,
    duration = 3000,
    baseColor = '#FFD700', // Jaune
    accentColor = '#FFFFFF', // Blanc
    onComplete = () => {},
    easing = (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic par défaut
    direction = 'radial',
    customAngle = 0,
    intensity = 1,
    speed = 1,
    colorVariation = true,
    blurAmount = 1,
    turbulence = 0.5,
    smokeOpacity = 0.8,
    growFactor = 2,
    particleMix = { smoke: 0.6, spark: 0.3, ember: 0.1 },
    gravity = 0,
    windEffect = 0,
    rotationSpeed = 1
  } = options;
  
  // Normaliser les proportions de particleMix pour s'assurer qu'elles totalisent 1
  const totalMix = (particleMix.smoke || 0) + (particleMix.spark || 0) + (particleMix.ember || 0);
  const normalizedMix = {
    smoke: totalMix > 0 ? (particleMix.smoke || 0) / totalMix : 0.6,
    spark: totalMix > 0 ? (particleMix.spark || 0) / totalMix : 0.3,
    ember: totalMix > 0 ? (particleMix.ember || 0) / totalMix : 0.1
  };
  
  // Récupérer les dimensions et position de l'élément cible
  const rect = targetElement.getBoundingClientRect();
  
  // Créer un conteneur pour l'effet qui sera positionné par-dessus l'élément cible
  const effectContainer = document.createElement('div');
  effectContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
    z-index: 1000;
  `;
  document.body.appendChild(effectContainer);

  // Stocker l'état original de l'élément
  const originalOpacity = targetElement.style.opacity;
  
  // Générer les particules
  const particles: ParticleElement[] = [];
  
  // Créer les différents types de particules
  createParticleMix(
    particleCount,
    rect,
    particles,
    baseColor,
    accentColor,
    direction,
    customAngle,
    intensity,
    speed,
    blurAmount,
    turbulence,
    smokeOpacity,
    normalizedMix,
    rotationSpeed
  );
  
  // Ajouter les particules au conteneur
  particles.forEach(particle => {
    effectContainer.appendChild(particle.element);
  });

  // Fonction d'animation principale utilisant requestAnimationFrame pour les performances
  let startTime: number | null = null;
  let animationFrameId: number;

  // Fonction d'animation
  const animate = (timestamp: number) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1); // Valeur entre 0 et 1
    const easedProgress = easing(progress);
    
    // Animer chaque particule
    let allComplete = true;
    particles.forEach(particle => {
      // N'animer qu'après le délai
      if (elapsed < particle.animationDelay) {
        allComplete = false;
        return;
      }
      
      const particleProgress = Math.min(
        (elapsed - particle.animationDelay) / (duration - particle.animationDelay), 
        1
      );
      
      if (particleProgress < 1) {
        allComplete = false;
        updateParticle(
          particle, 
          particleProgress, 
          easing, 
          { 
            growFactor,
            colorVariation,
            gravity,
            windEffect,
            turbulence
          }
        );
      } else {
        // Masquer la particule une fois terminée
        particle.element.style.opacity = '0';
      }
    });
    
    // Continuer l'animation ou terminer
    if (progress < 1 && !allComplete) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      // Animation terminée, nettoyer
      setTimeout(() => {
        effectContainer.remove();
        targetElement.style.opacity = originalOpacity;
        onComplete();
      }, 100);
    }
  };
  
  // Démarrer l'animation
  targetElement.style.opacity = '0'; // Cacher l'élément original pendant l'animation
  animationFrameId = requestAnimationFrame(animate);
  
  // Retourner une fonction pour annuler l'animation si nécessaire
  return {
    cancel: () => {
      cancelAnimationFrame(animationFrameId);
      effectContainer.remove();
      targetElement.style.opacity = originalOpacity;
    }
  };
}

/**
 * Crée un mélange de particules de différents types
 */
function createParticleMix(
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

/**
 * Crée un élément particule avec ses propriétés
 */
function createParticle(
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
      const force = (1 + Math.random() * 0.5) * speed;
      dirX = Math.cos(angleRad) * force;
      dirY = Math.sin(angleRad) * force;
      break;
    case 'radial':
    default:
      // Direction radiale depuis le centre
      const angle = Math.random() * Math.PI * 2;
      const force = (0.5 + Math.random() * 1.5) * speed;
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
 * Met à jour la position et l'apparence d'une particule pendant l'animation
 */
function updateParticle(
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

/**
 * Ajuste la luminosité d'une couleur
 */
function adjustColorLightness(color: string, percent: number): string {
  // Pour simplifier, cette fonction ne fonctionne qu'avec les couleurs hex
  if (color.startsWith('#')) {
    // Convertir hex en RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Ajuster la luminosité
    const factor = 1 + percent / 100;
    const adjustR = Math.max(0, Math.min(255, Math.floor(r * factor)));
    const adjustG = Math.max(0, Math.min(255, Math.floor(g * factor)));
    const adjustB = Math.max(0, Math.min(255, Math.floor(b * factor)));
    
    // Reconvertir en hex
    return `#${adjustR.toString(16).padStart(2, '0')}${adjustG.toString(16).padStart(2, '0')}${adjustB.toString(16).padStart(2, '0')}`;
  }
  return color;
}

/**
 * Ajuste la saturation d'une couleur (conversion de hex à HSL puis HSL à hex)
 */
function adjustColorSaturation(color: string, percent: number): string {
  if (color.startsWith('#')) {
    // Convertir hex en RGB
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;
    
    // Convertir RGB en HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    // Ajuster la saturation
    s = Math.min(1, s * (percent / 100));
    
    // Convertir HSL à RGB
    let r1 = 0, g1 = 0, b1 = 0;
    
    if (s === 0) {
      r1 = g1 = b1 = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r1 = hue2rgb(p, q, h + 1/3);
      g1 = hue2rgb(p, q, h);
      b1 = hue2rgb(p, q, h - 1/3);
    }
    
    // Convertir RGB à hex
    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`;
  }
  return color;
}
