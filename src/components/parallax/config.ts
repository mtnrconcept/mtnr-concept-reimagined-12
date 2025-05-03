
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
  { type: 'background', depth: 0.9, className: 'opacity-90' },
  
  // Splash très profonds (arrière-plan lointain)
  { type: 'paint', x: 75, y: 15, depth: 0.85, scale: 2.8, rotation: -15, blur: 5,
    src: '/lovable-uploads/paint-splatter-hi.png', className: 'splash-debug opacity-30' },
  { type: 'paint', x: 10, y: 20, depth: 0.8, scale: 2.5, rotation: 25, blur: 4,
    src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'splash-debug opacity-25' },
    
  // Splash à distance moyenne
  { type: 'paint', x: 50, y: 30, depth: 0.6, scale: 2.2, rotation: 10, blur: 3,
    src: '/lovable-uploads/yellow-watercolor-splatter-3.png', className: 'splash-debug opacity-60' },
  { type: 'paint', x: 30, y: 40, depth: 0.5, scale: 2.0, rotation: 5, blur: 2,
    src: '/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png', className: 'splash-debug opacity-60' },
  
  // Splash proches
  { type: 'paint', x: 85, y: 65, depth: 0.3, scale: 1.8, rotation: -10, blur: 1,
    src: '/lovable-uploads/yellow-watercolor-splatter-3.png', className: 'splash-debug opacity-70' },
  { type: 'paint', x: 15, y: 70, depth: 0.2, scale: 1.6, rotation: 15, blur: 0.5,
    src: '/lovable-uploads/paint-splatter-hi.png', className: 'splash-debug opacity-80' },
  
  // Niveau normal (profondeur neutre)
  { type: 'paint', x: 70, y: 42, depth: 0, scale: 1.4, rotation: 8, blur: 0,
    src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'splash-debug opacity-90' },
  
  // Premier plan (devant le contenu)
  { type: 'paint', x: 90, y: 25, depth: -0.2, scale: 1.2, rotation: 20, blur: 0,
    src: '/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png', className: 'splash-debug opacity-70' },
  { type: 'paint', x: 5, y: 85, depth: -0.3, scale: 1.1, rotation: -25, blur: 0,
    src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'splash-debug opacity-60' },
    
  // Premier plan extrême (très proche)
  { type: 'paint', x: 25, y: 5, depth: -0.5, scale: 0.9, rotation: -5, blur: 0,
    src: '/lovable-uploads/yellow-watercolor-splatter-3.png', className: 'splash-debug opacity-40' },
  { type: 'paint', x: 80, y: 90, depth: -0.8, scale: 0.7, rotation: 12, blur: 0,
    src: '/lovable-uploads/paint-splatter-hi.png', className: 'splash-debug opacity-30' },
  
  // Ajouter des taches de couleur supplémentaires pour plus de variété
  { type: 'paint', x: 35, y: 55, depth: 0.75, scale: 1.9, rotation: -8, blur: 3.5,
    src: '/lovable-uploads/yellow-watercolor-splatter-3.png', className: 'splash-debug opacity-50' },
  { type: 'paint', x: 65, y: 12, depth: 0.4, scale: 1.7, rotation: 15, blur: 1.8,
    src: '/lovable-uploads/paint-splatter-hi.png', className: 'splash-debug opacity-65' },
  { type: 'paint', x: 20, y: 60, depth: -0.35, scale: 1.0, rotation: 22, blur: 0,
    src: '/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png', className: 'splash-debug opacity-55' },
  { type: 'paint', x: 40, y: 80, depth: -0.6, scale: 0.85, rotation: -18, blur: 0,
    src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', className: 'splash-debug opacity-35' },
];
