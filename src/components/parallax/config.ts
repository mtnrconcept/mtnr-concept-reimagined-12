
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
  
  // Section lumières - ambiance
  { type: 'light', x: 20, y: 10, depth: 0.3, size: 120, glow: "rgba(255,221,0,0.6)", className: "opacity-20" },
  { type: 'light', x: 80, y: 15, depth: 0.25, size: 150, glow: "rgba(255,221,0,0.5)", className: "opacity-30" },
  
  // Splash à l'arrière-plan (profonds) - repositionnés pour être visibles
  { type: 'paint', x: 75, y: 20, depth: 0.4, scale: 2.8, rotation: -15, blur: 3,
    src: '/lovable-uploads/paint-splatter-hi.png', className: 'splash-debug' },
  { type: 'paint', x: 10, y: 40, depth: 0.35, scale: 2.5, rotation: 25, blur: 2,
    src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'splash-debug' },
    
  // Éléments industriels à distance moyenne
  { type: 'pipe', x: 85, y: 60, depth: 0.3, scale: 2.5, rotation: 45 },
  { type: 'vent', x: 20, y: 70, depth: 0.25, scale: 1.8 },
    
  // Splash à distance moyenne - repositionnés pour être visibles dans la page
  { type: 'paint', x: 60, y: 90, depth: 0.2, scale: 2.2, rotation: 10, blur: 1,
    src: '/lovable-uploads/yellow-watercolor-splatter-3.png', className: 'splash-debug opacity-50' },
  { type: 'paint', x: 25, y: 110, depth: 0.25, scale: 2.0, rotation: 5, blur: 1,
    src: '/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png', className: 'splash-debug opacity-50' },
  
  // Lumières en premier plan
  { type: 'light', x: 40, y: 130, depth: -0.2, size: 80, glow: "rgba(255,221,0,0.7)" },
  
  // Splash au premier plan - dispersés à travers la page pour permettre de voir le contenu
  { type: 'paint', x: 85, y: 140, depth: -0.3, scale: 1.4, rotation: -10, blur: 0,
    src: '/lovable-uploads/yellow-watercolor-splatter-3.png', className: 'splash-debug opacity-40' },
  { type: 'paint', x: 15, y: 150, depth: -0.4, scale: 1.3, rotation: 15, blur: 0,
    src: '/lovable-uploads/paint-splatter-hi.png', className: 'splash-debug opacity-35' },
  
  // Autres éléments industriels en premier plan
  { type: 'pipe', x: 65, y: 170, depth: -0.5, scale: 1.2, rotation: -30 },
  
  // Splash extrêmement proches - repositionnés en bas de page
  { type: 'paint', x: 80, y: 200, depth: -0.6, scale: 1.2, rotation: 20, blur: 0,
    src: '/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png', className: 'splash-debug opacity-30' },
  { type: 'paint', x: 25, y: 230, depth: -0.7, scale: 1.1, rotation: -25, blur: 0,
    src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'splash-debug opacity-25' },
];
