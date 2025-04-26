
import { useEffect, useRef } from 'react';

export const ParticleEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];
    const particleCount = 200;
    let mouseX = 0;
    let mouseY = 0;
    
    class Particle {
      x: number;
      y: number;
      z: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      baseX: number;
      baseY: number;

      constructor() {
        this.z = Math.random() * 1000; // Position Z aléatoire pour effet de profondeur
        const scale = this.getScale();
        
        // Position de base aléatoire sur tout l'écran
        this.baseX = Math.random() * canvas.width;
        this.baseY = Math.random() * canvas.height;
        
        // Position actuelle
        this.x = this.baseX;
        this.y = this.baseY;
        
        this.size = (Math.random() * 2 + 1) * scale;
        this.speedX = ((Math.random() - 0.5) * 0.5) * scale;
        this.speedY = ((Math.random() - 0.5) * 0.5) * scale;
        this.alpha = (Math.random() * 0.2 + 0.05) * scale; // Opacité réduite et variable selon la profondeur
        this.color = Math.random() > 0.5 ? '#FFF' : '#FFD700';
      }

      getScale() {
        // Plus la particule est loin (z grand), plus elle sera petite
        return Math.max(0.1, (1000 - this.z) / 1000);
      }

      update() {
        const scale = this.getScale();
        const parallaxX = (mouseX - window.innerWidth / 2) * (this.z / 10000);
        const parallaxY = (mouseY - window.innerHeight / 2) * (this.z / 10000);

        // Mise à jour de la position avec l'effet parallax
        this.x = this.baseX + this.speedX + parallaxX;
        this.y = this.baseY + this.speedY + parallaxY;

        // Replacement aléatoire quand la particule sort de l'écran
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.baseX = Math.random() * canvas.width;
          this.baseY = Math.random() * canvas.height;
          this.x = this.baseX;
          this.y = this.baseY;
          this.z = Math.random() * 1000;
          this.speedX = ((Math.random() - 0.5) * 0.5) * scale;
          this.speedY = ((Math.random() - 0.5) * 0.5) * scale;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        const scale = this.getScale();
        ctx.arc(this.x, this.y, this.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha * scale;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ opacity: 0.7 }}
    />
  );
};

