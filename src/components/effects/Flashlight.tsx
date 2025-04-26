
import { useState, useEffect, useRef } from 'react';
import { Flashlight as FlashlightIcon, FlashlightOff } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import * as PIXI from 'pixi.js';

export const Flashlight = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const shadowsRef = useRef<PIXI.Graphics[]>([]);
  const lightRef = useRef<PIXI.Graphics | null>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current || !isEnabled) return;

    // Initialize PIXI Application with better quality settings
    const app = new PIXI.Application({
      resizeTo: window,
      backgroundAlpha: 0,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    });
    containerRef.current.appendChild(app.view as HTMLCanvasElement);
    appRef.current = app;

    // Enhanced light source with gradient
    const light = new PIXI.Graphics();
    const gradientTexture = createGradientTexture(app);
    light.beginTextureFill({ texture: gradientTexture });
    light.drawCircle(0, 0, 500);
    light.endFill();
    light.filters = [new PIXI.BlurFilter(30)];
    app.stage.addChild(light);
    lightRef.current = light;

    // Get all elements that should cast shadows - expanded selection
    const elements = document.querySelectorAll('[data-cast-shadow="true"], .parallax-element, section, h1, h2, p, img, button, .card');

    // Create shadows for each element
    shadowsRef.current = Array.from(elements).map(() => {
      const shadow = new PIXI.Graphics();
      app.stage.addChild(shadow);
      return shadow;
    });

    const updateShadows = (x: number, y: number) => {
      if (!lightRef.current) return;

      lightRef.current.x = x;
      lightRef.current.y = y + window.scrollY;

      elements.forEach((element, i) => {
        const shadow = shadowsRef.current[i];
        if (!shadow) return;

        const rect = element.getBoundingClientRect();
        const scrollTop = window.scrollY;

        // Enhanced shadow parameters
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + scrollTop + rect.height / 2;
        const dx = elementCenterX - x;
        const dy = (elementCenterY - scrollTop) - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const normX = dx / dist;
        const normY = dy / dist;

        // Dynamic shadow properties based on distance
        const shadowLength = Math.min(800, dist * 1.2);
        const shadowOpacity = Math.max(0.3, Math.min(0.7, 1.2 - (dist / 1200)));
        const shadowBlur = Math.min(20, dist * 0.05);

        // Draw enhanced shadow with blur filter
        shadow.clear();
        shadow.filters = [new PIXI.BlurFilter(shadowBlur)];
        shadow.beginFill(0x000000, shadowOpacity);
        shadow.moveTo(rect.left, rect.top + scrollTop);
        shadow.lineTo(rect.left + rect.width, rect.top + scrollTop);
        shadow.lineTo(
          rect.left + rect.width + normX * shadowLength,
          rect.top + scrollTop + normY * shadowLength
        );
        shadow.lineTo(
          rect.left + normX * shadowLength,
          rect.top + scrollTop + normY * shadowLength
        );
        shadow.closePath();
        shadow.endFill();
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isEnabled) return;
      const { clientX: x, clientY: y } = e;
      setPosition({ x, y });
      
      // Use requestAnimationFrame for smooth updates
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => updateShadows(x, y));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', () => {
      if (position.x && position.y) {
        updateShadows(position.x, position.y);
      }
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', () => {});
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        if (containerRef.current?.firstChild) {
          containerRef.current.removeChild(appRef.current.view as HTMLCanvasElement);
        }
      }
    };
  }, [isEnabled]);

  // Helper function to create gradient texture for the light cone
  const createGradientTexture = (app: PIXI.Application) => {
    const quality = 256;
    const canvas = document.createElement('canvas');
    canvas.width = quality;
    canvas.height = 1;
    const ctx = canvas.getContext('2d')!;
    
    const gradient = ctx.createLinearGradient(0, 0, quality, 0);
    gradient.addColorStop(0, 'rgba(255, 221, 0, 0.4)');
    gradient.addColorStop(0.3, 'rgba(255, 221, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 221, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, quality, 1);
    
    return PIXI.Texture.from(canvas);
  };

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

      <div
        ref={containerRef}
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 15,
          opacity: isEnabled ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {isEnabled && (
        <div
          className="pointer-events-none absolute top-0 left-0 z-[20] w-full"
          style={{
            height: `${document.documentElement.scrollHeight}px`,
            maskImage: `radial-gradient(circle 800px at ${position.x}px ${position.y}px, transparent, black)`,
            WebkitMaskImage: `radial-gradient(circle 800px at ${position.x}px ${position.y}px, transparent, black)`,
            background: 'rgba(0, 0, 0, 0.97)',
            backdropFilter: 'blur(3px)',
            isolation: 'isolate',
          }}
        >
          <div
            className="pointer-events-none absolute"
            style={{
              left: position.x,
              top: position.y,
              width: '1600px',
              height: '1600px',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(255, 221, 0, 0.3) 0%, rgba(255, 221, 0, 0.15) 40%, transparent 70%)',
              filter: 'blur(50px)',
              mixBlendMode: 'soft-light',
            }}
          />
        </div>
      )}
    </>
  );
};
