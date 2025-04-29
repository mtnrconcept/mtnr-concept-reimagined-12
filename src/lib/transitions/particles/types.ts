
/**
 * Types communs pour les effets de particules
 */

// Types de particules
export type ParticleType = 'smoke' | 'spark' | 'ember';

// Options pour personnaliser l'effet de fumée
export interface SmokeTextOptions {
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

// Interface pour les éléments de particules
export interface ParticleElement {
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
