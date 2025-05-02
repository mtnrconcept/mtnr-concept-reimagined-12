
/**
 * Effet de fumée/brouillard inspiré de MechCoders
 * Applique un effet de dispersion de style fumée aux éléments texte ou image
 * Version refactorisée pour une meilleure maintenabilité
 */

import { SmokeTextOptions, ParticleElement } from './particles/types';
import { createParticleMix } from './particles/particle-creator';
import { updateParticle } from './particles/particle-animator';

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
