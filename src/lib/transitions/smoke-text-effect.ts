
/**
 * Effet de fumée/brouillard inspiré de MechCoders
 * Applique un effet de dispersion de style fumée aux éléments texte ou image
 */

import { random } from './utils';

// Options pour personnaliser l'effet de fumée
interface SmokeTextOptions {
  particleCount?: number; // Nombre de particules de fumée
  duration?: number; // Durée de l'animation en ms
  baseColor?: string; // Couleur de base des particules
  accentColor?: string; // Couleur d'accent pour certaines particules
  onComplete?: () => void; // Callback à la fin de l'animation
  easing?: (t: number) => number; // Fonction d'easing pour l'animation
  direction?: 'up' | 'down' | 'left' | 'right' | 'radial'; // Direction de dispersion
  intensity?: number; // Intensité de l'effet (taille et vitesse)
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
}

/**
 * Applique un effet de fumée/dispersion à un élément
 */
export function createSmokeTextEffect(
  targetElement: HTMLElement | null, 
  options: SmokeTextOptions = {}
) {
  if (!targetElement) return { cancel: () => {} };
  
  const {
    particleCount = 100,
    duration = 3000,
    baseColor = '#FFD700', // Jaune
    accentColor = '#FFFFFF', // Blanc
    onComplete = () => {},
    easing = (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic par défaut
    direction = 'radial',
    intensity = 1
  } = options;
  
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
    intensity
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
        updateParticle(particle, particleProgress, easing);
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
  intensity: number
) {
  // Distribution des différents types de particules
  const smokeCount = Math.round(count * 0.6); // 60% de fumée
  const sparkCount = Math.round(count * 0.3); // 30% d'étincelles
  const emberCount = count - smokeCount - sparkCount; // Le reste en braises
  
  // Créer les particules de fumée
  for (let i = 0; i < smokeCount; i++) {
    const particle = createParticle('smoke', rect, baseColor, direction, intensity);
    particles.push(particle);
  }
  
  // Créer les particules d'étincelles
  for (let i = 0; i < sparkCount; i++) {
    const particle = createParticle('spark', rect, accentColor, direction, intensity);
    particles.push(particle);
  }
  
  // Créer les particules de braises
  for (let i = 0; i < emberCount; i++) {
    const particle = createParticle('ember', rect, baseColor, direction, intensity * 1.2);
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
  intensity: number
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
      dirY = random(-2, -1) * intensity;
      break;
    case 'down':
      dirX = random(-0.5, 0.5);
      dirY = random(1, 2) * intensity;
      break;
    case 'left':
      dirX = random(-2, -1) * intensity;
      dirY = random(-0.5, 0.5);
      break;
    case 'right':
      dirX = random(1, 2) * intensity;
      dirY = random(-0.5, 0.5);
      break;
    case 'radial':
    default:
      // Direction radiale depuis le centre
      const angle = Math.random() * Math.PI * 2;
      const force = (0.5 + Math.random() * 1.5) * intensity;
      dirX = Math.cos(angle) * force;
      dirY = Math.sin(angle) * force;
      break;
  }
  
  // Paramètres spécifiques selon le type de particule
  let size: number, opacity: number, particleColor: string, blur: number;
  
  switch(type) {
    case 'smoke':
      size = random(20, 50) * intensity;
      opacity = random(0.4, 0.8);
      particleColor = adjustColorLightness(color, random(-20, 20));
      blur = random(5, 12);
      break;
    case 'spark':
      size = random(2, 8) * intensity;
      opacity = random(0.7, 1);
      particleColor = adjustColorLightness(color, random(20, 40)); // Plus lumineux
      blur = random(0, 2);
      break;
    case 'ember':
      size = random(4, 12) * intensity;
      opacity = random(0.6, 0.9);
      particleColor = adjustColorSaturation(color, random(80, 100)); // Plus saturé
      blur = random(2, 6);
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
    opacity: ${opacity};
    filter: blur(${blur}px);
    transform: rotate(0deg);
    pointer-events: none;
    will-change: transform, opacity;
  `;
  
  return {
    element,
    type,
    initialX,
    initialY,
    direction: { x: dirX, y: dirY },
    speed: random(0.8, 1.2) * intensity,
    size,
    opacity,
    hue: 0, // Pour les variations de couleur pendant l'animation
    rotation: random(0, 360),
    rotationSpeed: random(-1, 1) * (type === 'smoke' ? 5 : 2),
    animationDelay: random(0, 500) // Délai avant que la particule commence à se déplacer
  };
}

/**
 * Met à jour la position et l'apparence d'une particule pendant l'animation
 */
function updateParticle(
  particle: ParticleElement,
  progress: number,
  easing: (t: number) => number
) {
  const { element, initialX, initialY, direction, speed, rotationSpeed } = particle;
  const easedProgress = easing(progress);
  
  // Calcul des transformations
  const moveDistance = 100 * speed * easedProgress;
  const newX = initialX + direction.x * moveDistance;
  const newY = initialY + direction.y * moveDistance;
  
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
      scaleFactor = 1 + easedProgress * 2;
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
  if (particle.type === 'ember' || particle.type === 'spark') {
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
 * Ajuste la saturation d'une couleur
 */
function adjustColorSaturation(color: string, percent: number): string {
  // Cette fonction pourrait être améliorée pour une manipulation plus précise des couleurs
  if (color.startsWith('#')) {
    // Conversion simplifiée pour l'exemple
    return color; // Pour l'instant, retourne la couleur d'origine
  }
  return color;
}
