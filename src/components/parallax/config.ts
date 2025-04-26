
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
  // Background avec un déplacement plus rapide
  { type: 'background', depth: 0.15, className: 'opacity-90' },
  
  // Splashes noirs avec déplacement plus lent
  { type: 'paint', x: 75, y: 15, depth: 0.1, scale: 2.5, rotation: -15, blur: 3,
    src: '/lovable-uploads/paint-splatter-hi.png', className: 'splash-debug' },
  { type: 'paint', x: 10, y: 20, depth: 0.08, scale: 2.2, rotation: 25, blur: 2.5,
    src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'splash-debug' },
    
  // Splashes jaunes avec déplacement encore plus lent
  { type: 'paint', x: 50, y: 30, depth: 0.05, scale: 2.0, rotation: 10, blur: 0,
    src: '/lovable-uploads/yellow-watercolor-splatter-3.png', className: 'splash-debug opacity-90' },
  { type: 'paint', x: 30, y: 40, depth: 0.03, scale: 1.8, rotation: 5, blur: 0,
    src: '/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png', className: 'splash-debug opacity-90' }
];
