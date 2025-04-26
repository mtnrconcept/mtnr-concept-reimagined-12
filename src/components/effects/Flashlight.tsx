
import { useState, useEffect, useRef } from 'react';
import { Flashlight as FlashlightIcon, FlashlightOff } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

export const Flashlight = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const shadowCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isEnabled) {
        setPosition({ x: e.pageX, y: e.pageY });
      }
    };

    const renderShadows = () => {
      const canvas = shadowCanvasRef.current;
      if (!canvas || !isEnabled) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size to match document height
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient for smooth shadow effect with higher contrast
      const gradient = ctx.createRadialGradient(
        position.x, position.y, 0,
        position.x, position.y, 800
      );
      
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(0.2, 'rgba(0, 0, 0, 0.4)'); // Increased opacity
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.7)'); // Increased opacity
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)'); // Increased opacity

      // Draw shadow effect
      ctx.save();
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'destination-out';

      // Get all visible elements
      const elements = document.querySelectorAll('[data-cast-shadow="true"]');
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.scrollY;
        
        // Calculate shadow angle based on light position
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + scrollTop + rect.height / 2;
        const angle = Math.atan2(position.y - elementCenterY, position.x - elementCenterX);
        
        // Shadow length based on distance from light with increased length
        const distance = Math.hypot(position.x - elementCenterX, position.y - elementCenterY);
        const shadowLength = Math.min(500, distance * 0.8); // Increased shadow length
        
        // Draw shadow shape with enhanced blur
        ctx.shadowBlur = 20; // Added shadow blur
        ctx.shadowColor = 'black';
        ctx.beginPath();
        ctx.moveTo(rect.left, rect.top + scrollTop);
        ctx.lineTo(rect.left + rect.width, rect.top + scrollTop);
        ctx.lineTo(
          rect.left + rect.width + Math.cos(angle) * shadowLength,
          rect.top + scrollTop + rect.height + Math.sin(angle) * shadowLength
        );
        ctx.lineTo(
          rect.left + Math.cos(angle) * shadowLength,
          rect.top + scrollTop + rect.height + Math.sin(angle) * shadowLength
        );
        ctx.closePath();
        ctx.fill();
      });
      
      ctx.restore();
    };

    const animate = () => {
      renderShadows();
      if (isEnabled) {
        requestAnimationFrame(animate);
      }
    };

    if (isEnabled) {
      // Add shadow-casting attribute to more elements
      document.querySelectorAll('section, .card, .btn, h1, h2, p, img, button').forEach(el => {
        el.setAttribute('data-cast-shadow', 'true');
      });
      
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      animate();
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.querySelectorAll('[data-cast-shadow="true"]').forEach(el => {
        el.removeAttribute('data-cast-shadow');
      });
    };
  }, [isEnabled, position]);

  return (
    <>
      <Toggle 
        className="fixed right-4 top-24 z-[9999] bg-black/20 hover:bg-black/40"
        pressed={isEnabled}
        onPressedChange={setIsEnabled}
      >
        {isEnabled ? (
          <FlashlightIcon className="h-5 w-5 text-yellow-400" />
        ) : (
          <FlashlightOff className="h-5 w-5 text-yellow-400" />
        )}
      </Toggle>

      {/* Shadow canvas with increased opacity and contrast */}
      <canvas
        ref={shadowCanvasRef}
        className="pointer-events-none fixed inset-0 z-[15]"
        style={{
          mixBlendMode: 'multiply',
          opacity: isEnabled ? 1 : 0,
          transition: 'opacity 0.3s ease',
          filter: 'contrast(1.5)' // Added contrast
        }}
      />

      {isEnabled && (
        <div
          className="pointer-events-none absolute top-0 left-0 z-[20] w-full"
          style={{
            height: `${document.documentElement.scrollHeight}px`,
            maskImage: `radial-gradient(circle 600px at ${position.x}px ${position.y}px, transparent, black)`,
            WebkitMaskImage: `radial-gradient(circle 600px at ${position.x}px ${position.y}px, transparent, black)`,
            background: 'rgba(0, 0, 0, 0.95)', // Increased darkness
            backdropFilter: 'blur(2px)', // Increased blur
            isolation: 'isolate',
          }}
        >
          <div
            className="pointer-events-none absolute"
            style={{
              left: position.x,
              top: position.y,
              width: '1200px', // Increased size
              height: '1200px', // Increased size
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(255, 221, 0, 0.2) 0%, rgba(255, 221, 0, 0.1) 30%, transparent 70%)',
              filter: 'blur(40px)', // Increased blur
              mixBlendMode: 'soft-light',
            }}
          />
        </div>
      )}
    </>
  );
};
