
import { useEffect, useRef } from 'react';

export const ParticleEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];
    const particleCount = 400; // Increased from 200
    let mouseX = 0;
    let mouseY = 0;
    
    class Particle {
      x: number;
      y: number;
      z: number;
      size: number;
      speedX: number;
      speedY: number;
      speedZ: number;
      color: string;
      alpha: number;
      baseX: number;
      baseY: number;
      angle: number;

      constructor() {
        this.z = Math.random() * 2000; // Increased depth range
        const scale = this.getScale();
        
        this.baseX = Math.random() * canvas.width;
        this.baseY = Math.random() * canvas.height;
        
        this.x = this.baseX;
        this.y = this.baseY;
        
        this.size = (Math.random() * 2 + 0.5) * scale; // Slightly smaller base size
        this.speedX = ((Math.random() - 0.5) * 0.3) * scale;
        this.speedY = ((Math.random() - 0.5) * 0.3) * scale;
        this.speedZ = (Math.random() - 0.5) * 2; // Z axis movement
        this.alpha = (Math.random() * 0.15 + 0.02) * scale; // Reduced overall opacity
        this.color = Math.random() > 0.5 ? '#FFF' : '#FFD700';
        this.angle = Math.random() * Math.PI * 2; // Random angle for circular motion
      }

      getScale() {
        return Math.max(0.1, (2000 - this.z) / 2000);
      }

      update() {
        const scale = this.getScale();
        const parallaxX = (mouseX - window.innerWidth / 2) * (this.z / 20000);
        const parallaxY = (mouseY - window.innerHeight / 2) * (this.z / 20000);

        // Circular motion + wave effect
        this.angle += 0.02 * scale;
        const radius = 1;
        const waveX = Math.sin(this.angle) * radius * scale;
        const waveY = Math.cos(this.angle) * radius * scale;

        // Update Z position for depth movement
        this.z += this.speedZ;
        if (this.z < 0) this.z = 2000;
        if (this.z > 2000) this.z = 0;

        // Update position with combined effects
        this.x = this.baseX + this.speedX + parallaxX + waveX;
        this.y = this.baseY + this.speedY + parallaxY + waveY;

        // Reset position if out of bounds
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.baseX = Math.random() * canvas.width;
          this.baseY = Math.random() * canvas.height;
          this.x = this.baseX;
          this.y = this.baseY;
          this.z = Math.random() * 2000;
          this.speedX = ((Math.random() - 0.5) * 0.3) * scale;
          this.speedY = ((Math.random() - 0.5) * 0.3) * scale;
          this.speedZ = (Math.random() - 0.5) * 2;
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
      style={{ opacity: 0.6 }} // Slightly reduced overall canvas opacity
    />
  );
};

