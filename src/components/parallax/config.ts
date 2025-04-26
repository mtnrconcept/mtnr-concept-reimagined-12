export interface ParallaxElementConfig {
  type: 'background' | 'paint' | 'pipe' | 'light' | 'vent';
  x?: number;
  y?: number;
  depth: number;
  scale?: number;
  rotation?: number;
  className?: string;
  src?: string;
  size?: number;
  glow?: string;
}

export const parallaxElements: ParallaxElementConfig[] = [
  // Background with very slow scrolling
  { type: 'background', depth: 0.05, className: 'opacity-90' },
  
  // Paint splashes (faster movement)
  { type: 'paint', x: 10, y: 15, depth: 0.4, scale: 2.5, rotation: -15, className: 'opacity-70', 
    src: '/lovable-uploads/4fdf517b-935e-4848-a014-c02754a79ce5.png' },
  { type: 'paint', x: 85, y: 25, depth: 0.45, scale: 2.8, rotation: 25, className: 'opacity-75',
    src: '/lovable-uploads/361c7d09-c2a5-413f-a973-c89812c3e85f.png' },
  
  // Other elements with faster parallax
  { type: 'paint', x: 5, y: 40, depth: 0.6, scale: 1.8, rotation: -20, className: 'opacity-80',
    src: '/lovable-uploads/47a81307-0753-4601-86bb-da53c9a62002.png' },
  { type: 'paint', x: 90, y: 45, depth: 0.65, scale: 1.9, rotation: 15, className: 'opacity-85',
    src: '/lovable-uploads/6bcb3e5d-4148-4cc3-b30d-fa65979d2f3d.png' },
  
  // Foreground elements (fastest movement)
  { type: 'paint', x: 15, y: 60, depth: 0.8, scale: 1.5, rotation: 10, className: 'opacity-90',
    src: '/lovable-uploads/4bcc54d2-e89d-4f31-972c-42da68f93fc4.png' },
  { type: 'paint', x: 80, y: 75, depth: 0.9, scale: 1.4, rotation: -5, className: 'opacity-95',
    src: '/lovable-uploads/40b430f2-e89d-4f31-972c-42da68f93fc4.png' },
];
