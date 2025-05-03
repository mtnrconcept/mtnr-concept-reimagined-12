
export type SupportedBlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' 
  | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' 
  | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' 
  | 'hue' | 'saturation' | 'color' | 'luminosity';

export interface ParallaxElementConfig {
  type: 'background' | 'paint' | 'pipe' | 'light' | 'vent';
  x?: number;
  y?: number;
  depth: number;
  scale?: number;
  rotation?: number;
  className?: string;
  src?: string;
  blur?: number;
  size?: number;
  glow?: string;
  blendMode?: SupportedBlendMode;
}

export const parallaxElements: ParallaxElementConfig[] = [
  // Background avec mouvement très lent
  { type: 'background', depth: 0.9, className: 'opacity-90' },
  
  // Réduction du nombre de splashs et ajustement de leur position/profondeur
  
  // Splash à distance moyenne - arrière-plan
  { type: 'paint', x: 75, y: 15, depth: 0.85, scale: 2.8, rotation: -15, blur: 7,
    src: '/lovable-uploads/paint-splatter-hi.png', className: 'opacity-25', blendMode: 'screen' },
  { type: 'paint', x: 10, y: 20, depth: 0.7, scale: 2.5, rotation: 25, blur: 5,
    src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'opacity-20', blendMode: 'overlay' },
    
  // Niveau intermédiaire
  { type: 'paint', x: 85, y: 65, depth: 0.4, scale: 1.8, rotation: -10, blur: 2,
    src: '/lovable-uploads/yellow-watercolor-splatter-3.png', className: 'opacity-40', blendMode: 'screen' },
  { type: 'paint', x: 20, y: 60, depth: 0.2, scale: 1.6, rotation: 15, blur: 1,
    src: '/lovable-uploads/paint-splatter-hi.png', className: 'opacity-35', blendMode: 'soft-light' },
  
  // Premier plan
  { type: 'paint', x: 70, y: 42, depth: -0.1, scale: 1.3, rotation: 8, blur: 0,
    src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'opacity-30', blendMode: 'overlay' },
  { type: 'paint', x: 25, y: 5, depth: -0.3, scale: 1.0, rotation: -5, blur: 0,
    src: '/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png', className: 'opacity-25', blendMode: 'screen' },
];
