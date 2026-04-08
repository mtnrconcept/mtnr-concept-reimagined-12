import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useUVMode } from '../effects/UVModeContext';

interface NeonLogoProps {
  className?: string;
  size?: number;
}

export const NeonLogo: React.FC<NeonLogoProps> = ({ className, size = 340 }) => {
  const { uvMode } = useUVMode();
  const ref = useRef<HTMLDivElement>(null);

  // Mouse-tracked 3D tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 15 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const glowColor = uvMode ? 'rgba(210, 255, 63, 0.7)' : 'rgba(255, 215, 0, 0.7)';
  const glowColorSoft = uvMode ? 'rgba(210, 255, 63, 0.25)' : 'rgba(255, 215, 0, 0.25)';

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`logo-container relative flex items-center justify-center ${className || ''}`}
      style={{ perspective: 1200, width: size, height: size }}
    >
      {/* Outer pulsing halo */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColorSoft} 0%, transparent 65%)`,
          filter: 'blur(40px)',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Inner tighter halo */}
      <motion.div
        aria-hidden
        className="absolute inset-8 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 55%)`,
          filter: 'blur(25px)',
          mixBlendMode: 'screen',
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Rotating outer ring with dashes */}
      <motion.svg
        aria-hidden
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 200 200"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx="100"
          cy="100"
          r="96"
          fill="none"
          stroke={uvMode ? '#D2FF3F' : '#FFD700'}
          strokeOpacity="0.35"
          strokeWidth="0.6"
          strokeDasharray="2 6"
        />
      </motion.svg>

      {/* Counter-rotating inner ring */}
      <motion.svg
        aria-hidden
        className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] pointer-events-none"
        viewBox="0 0 200 200"
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx="100"
          cy="100"
          r="94"
          fill="none"
          stroke={uvMode ? '#D2FF3F' : '#FFD700'}
          strokeOpacity="0.5"
          strokeWidth="0.8"
          strokeDasharray="0.5 3"
        />
        {/* Accent ticks */}
        {[0, 90, 180, 270].map((angle) => (
          <line
            key={angle}
            x1="100"
            y1="0"
            x2="100"
            y2="12"
            stroke={uvMode ? '#D2FF3F' : '#FFD700'}
            strokeWidth="2"
            strokeOpacity="0.9"
            transform={`rotate(${angle} 100 100)`}
          />
        ))}
      </motion.svg>

      {/* Circular orbiting text */}
      <motion.svg
        aria-hidden
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 200 200"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <defs>
          <path id="mtnr-orbit" d="M 100,100 m -88,0 a 88,88 0 1,1 176,0 a 88,88 0 1,1 -176,0" />
        </defs>
        <text
          fontSize="7"
          fill={uvMode ? '#D2FF3F' : '#FFD700'}
          fillOpacity="0.8"
          letterSpacing="4"
          style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
        >
          <textPath href="#mtnr-orbit">
            MTNR • CAVE STUDIO • UNDERGROUND • GENEVA • MTNR • CAVE STUDIO • UNDERGROUND • GENEVA •
          </textPath>
        </text>
      </motion.svg>

      {/* The logo itself with 3D tilt and entry animation */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        initial={{ scale: 0.4, opacity: 0, filter: 'blur(30px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src="/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png"
          alt="MTNR Logo"
          style={{
            filter: uvMode
              ? 'hue-rotate(120deg) brightness(1.5) saturate(1.5) contrast(1.2) drop-shadow(0 0 12px rgba(210, 255, 63, 0.9)) drop-shadow(0 0 30px rgba(210, 255, 63, 0.5))'
              : 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 30px rgba(255, 215, 0, 0.5)) drop-shadow(0 0 60px rgba(255, 215, 0, 0.25))',
          }}
          className="w-[65%] max-w-full h-auto object-contain select-none"
          draggable={false}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          animate={{
            filter: uvMode
              ? [
                  'hue-rotate(120deg) brightness(1.5) saturate(1.5) contrast(1.2) drop-shadow(0 0 12px rgba(210, 255, 63, 0.9)) drop-shadow(0 0 30px rgba(210, 255, 63, 0.5))',
                  'hue-rotate(120deg) brightness(1.7) saturate(1.8) contrast(1.3) drop-shadow(0 0 18px rgba(210, 255, 63, 1)) drop-shadow(0 0 45px rgba(210, 255, 63, 0.7))',
                  'hue-rotate(120deg) brightness(1.5) saturate(1.5) contrast(1.2) drop-shadow(0 0 12px rgba(210, 255, 63, 0.9)) drop-shadow(0 0 30px rgba(210, 255, 63, 0.5))',
                ]
              : [
                  'drop-shadow(0 0 12px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 30px rgba(255, 215, 0, 0.5)) drop-shadow(0 0 60px rgba(255, 215, 0, 0.25))',
                  'drop-shadow(0 0 18px rgba(255, 215, 0, 1)) drop-shadow(0 0 45px rgba(255, 215, 0, 0.7)) drop-shadow(0 0 80px rgba(255, 215, 0, 0.4))',
                  'drop-shadow(0 0 12px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 30px rgba(255, 215, 0, 0.5)) drop-shadow(0 0 60px rgba(255, 215, 0, 0.25))',
                ],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Scan line sweep */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-20"
        style={{ mixBlendMode: 'screen' }}
      >
        <motion.div
          className="absolute left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
            filter: 'blur(1px)',
          }}
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  );
};
