
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
  // Background - très lent
  { type: 'background', depth: 0.05, className: 'opacity-90' },
  
  // Éclaboussures de peinture - couche profonde
  { type: 'paint', x: 10, y: 15, depth: 0.2, scale: 1.8, rotation: -15, className: 'opacity-80', 
    src: '/lovable-uploads/4fdf517b-935e-4848-a014-c02754a79ce5.png' },
  { type: 'paint', x: 75, y: 20, depth: 0.3, scale: 2, rotation: 25, className: 'opacity-85',
    src: '/lovable-uploads/361c7d09-c2a5-413f-a973-c89812c3e85f.png' },
  
  // Éclaboussures de peinture - couche intermédiaire
  { type: 'paint', x: 20, y: 40, depth: 0.4, scale: 1.6, rotation: -20, className: 'opacity-90',
    src: '/lovable-uploads/47a81307-0753-4601-86bb-da53c9a62002.png' },
  { type: 'paint', x: 85, y: 30, depth: 0.5, scale: 1.7, rotation: 15, className: 'opacity-85',
    src: '/lovable-uploads/6bcb3e5d-4148-4cc3-b30d-fa65979d2f3d.png' },
  
  // Éclaboussures de peinture - couche avant
  { type: 'paint', x: 5, y: 60, depth: 0.6, scale: 1.5, rotation: 10, className: 'opacity-90',
    src: '/lovable-uploads/4bcc54d6-fbe7-4e59-ad3c-85be26c0556a.png' },
  { type: 'paint', x: 90, y: 70, depth: 0.7, scale: 1.4, rotation: -5, className: 'opacity-95',
    src: '/lovable-uploads/40b430f2-e89d-4f31-972c-42da68f93fc4.png' },
];
