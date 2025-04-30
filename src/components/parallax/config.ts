
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
  // Background avec mouvement très lent
  { type: 'background', depth: 0.15, className: 'opacity-90' },
  
  // Splash très profonds (arrière-plan)
  { type: 'paint', x: 75, y: 15, depth: 0.4, scale: 2.8, rotation: -15, blur: 3,
    src: '/lovable-uploads/paint-splatter-hi.png', className: 'splash-debug' },
  { type: 'paint', x: 10, y: 20, depth: 0.35, scale: 2.5, rotation: 25, blur: 2,
    src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'splash-debug' },
    
  // Splash à distance moyenne
  { type: 'paint', x: 50, y: 30, depth: 0.2, scale: 2.2, rotation: 10, blur: 1,
    src: '/lovable-uploads/yellow-watercolor-splatter-3.png', className: 'splash-debug opacity-50' },
  { type: 'paint', x: 30, y: 40, depth: 0.25, scale: 2.0, rotation: 5, blur: 1,
    src: '/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png', className: 'splash-debug opacity-50' },
  
  // Splash très proches, au premier plan absolu (devant tout le contenu)
  { type: 'paint', x: 85, y: 65, depth: -0.5, scale: 1.4, rotation: -10, blur: 0,
    src: '/lovable-uploads/yellow-watercolor-splatter-3.png', className: 'splash-debug opacity-40' },
  { type: 'paint', x: 15, y: 70, depth: -0.6, scale: 1.3, rotation: 15, blur: 0,
    src: '/lovable-uploads/paint-splatter-hi.png', className: 'splash-debug opacity-35' },
  
  // Nouveaux splash extrêmement proches
  { type: 'paint', x: 90, y: 25, depth: -0.8, scale: 1.2, rotation: 20, blur: 0,
    src: '/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png', className: 'splash-debug opacity-30' },
  { type: 'paint', x: 5, y: 85, depth: -1, scale: 1.1, rotation: -25, blur: 0,
    src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'splash-debug opacity-25' },
];
