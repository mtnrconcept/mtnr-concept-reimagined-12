
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
}

export const parallaxElements: ParallaxElementConfig[] = [
  // Background avec un déplacement beaucoup plus lent (depth réduit)
  { type: 'background', depth: 0.08, className: 'opacity-90' },
  
  // Splashes noirs avec déplacement moyen - plus contrastés avec le fond
  { type: 'paint', x: 75, y: 15, depth: 0.25, scale: 2.8, rotation: -15, blur: 2,
    src: '/lovable-uploads/paint-splatter-hi.png', className: 'splash-debug' },
  { type: 'paint', x: 10, y: 20, depth: 0.22, scale: 2.5, rotation: 25, blur: 1.5,
    src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'splash-debug' },
    
  // Splashes jaunes avec déplacement très rapide (amplifiés) pour un effet de premier plan
  { type: 'paint', x: 50, y: 30, depth: 0.35, scale: 2.2, rotation: 10, blur: 0,
    src: '/lovable-uploads/yellow-watercolor-splatter-3.png', className: 'splash-debug opacity-90' },
  { type: 'paint', x: 30, y: 40, depth: 0.42, scale: 2.0, rotation: 5, blur: 0,
    src: '/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png', className: 'splash-debug opacity-90' },
  
  // Ajout d'éléments supplémentaires pour renforcer l'effet de profondeur
  { type: 'paint', x: 85, y: 65, depth: 0.30, scale: 1.8, rotation: -10, blur: 0,
    src: '/lovable-uploads/yellow-watercolor-splatter-3.png', className: 'splash-debug opacity-80' },
  { type: 'paint', x: 15, y: 70, depth: 0.38, scale: 1.6, rotation: 15, blur: 0,
    src: '/lovable-uploads/paint-splatter-hi.png', className: 'splash-debug opacity-85' },
];
