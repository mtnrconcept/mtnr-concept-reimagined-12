
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
  
  // Éclaboussures à différentes distances pour accentuer l'effet de profondeur
  
  // Très éloignées (arrière-plan)
  { type: 'paint', x: 75, y: 15, depth: 0.95, scale: 2.8, rotation: -15, blur: 9,
    src: '/lovable-uploads/paint-splatter-hi.png', className: 'opacity-20', blendMode: 'screen' },
  { type: 'paint', x: 10, y: 20, depth: 0.8, scale: 2.5, rotation: 25, blur: 7,
    src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'opacity-15', blendMode: 'overlay' },
    
  // Distance intermédiaire
  { type: 'paint', x: 85, y: 65, depth: 0.5, scale: 1.8, rotation: -10, blur: 4,
    src: '/lovable-uploads/yellow-watercolor-splatter-3.png', className: 'opacity-30', blendMode: 'screen' },
  { type: 'paint', x: 20, y: 60, depth: 0.3, scale: 1.4, rotation: 15, blur: 2,
    src: '/lovable-uploads/paint-splatter-hi.png', className: 'opacity-35', blendMode: 'soft-light' },
  
  // Plan de référence
  { type: 'paint', x: 50, y: 40, depth: 0, scale: 1.2, rotation: 0, blur: 0,
    src: '/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png', className: 'opacity-40', blendMode: 'screen' },
  
  // Premier plan
  { type: 'paint', x: 70, y: 42, depth: -0.3, scale: 0.9, rotation: 8, blur: 0,
    src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'opacity-45', blendMode: 'overlay' },
  { type: 'paint', x: 25, y: 5, depth: -0.6, scale: 0.7, rotation: -5, blur: 0,
    src: '/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png', className: 'opacity-50', blendMode: 'screen' },
];
