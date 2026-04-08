import { motion } from "framer-motion";

/**
 * Decorative concentric circles (radar/target style) — positioned behind section titles.
 */
export function ConcentricCircles({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className={`pointer-events-none select-none absolute ${className}`}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer rings */}
      {[140, 120, 100, 80, 60].map((r, i) => (
        <circle
          key={r}
          cx="150"
          cy="150"
          r={r}
          stroke="rgba(255,215,0,0.15)"
          strokeWidth={i === 0 ? "1" : "0.5"}
          strokeDasharray={i % 2 === 0 ? "4 6" : "2 8"}
          className="animate-[spin_60s_linear_infinite]"
          style={{ 
            transformOrigin: "150px 150px",
            animationDirection: i % 2 === 0 ? "normal" : "reverse",
            animationDuration: `${50 + i * 15}s`
          }}
        />
      ))}

      {/* Crosshair lines */}
      <line x1="150" y1="0" x2="150" y2="300" stroke="rgba(255,215,0,0.08)" strokeWidth="0.5" />
      <line x1="0" y1="150" x2="300" y2="150" stroke="rgba(255,215,0,0.08)" strokeWidth="0.5" />
      <line x1="44" y1="44" x2="256" y2="256" stroke="rgba(255,215,0,0.05)" strokeWidth="0.5" />
      <line x1="256" y1="44" x2="44" y2="256" stroke="rgba(255,215,0,0.05)" strokeWidth="0.5" />

      {/* Center dot glow */}
      <circle cx="150" cy="150" r="4" fill="rgba(255,215,0,0.3)">
        <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="150" cy="150" r="2" fill="rgba(255,215,0,0.6)" />

      {/* Tick marks on outer ring */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i * 10 * Math.PI) / 180;
        const inner = i % 3 === 0 ? 132 : 136;
        const outer = 140;
        return (
          <line
            key={`tick-${i}`}
            x1={150 + inner * Math.cos(angle)}
            y1={150 + inner * Math.sin(angle)}
            x2={150 + outer * Math.cos(angle)}
            y2={150 + outer * Math.sin(angle)}
            stroke={`rgba(255,215,0,${i % 3 === 0 ? 0.25 : 0.1})`}
            strokeWidth={i % 3 === 0 ? "1" : "0.5"}
          />
        );
      })}

      {/* Arc sweep segment */}
      <path
        d="M 150 10 A 140 140 0 0 1 280 100"
        stroke="rgba(255,215,0,0.2)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        className="animate-[spin_20s_linear_infinite]"
        style={{ transformOrigin: "150px 150px" }}
      />
    </motion.svg>
  );
}

/**
 * Audio waveform decoration — horizontal frequency bars mimicking studio sound visualization.
 */
export function AudioWaveform({ className = "", barCount = 60 }: { className?: string; barCount?: number }) {
  // Generate pseudo-random waveform heights
  const bars = Array.from({ length: barCount }, (_, i) => {
    const x = i / barCount;
    // Create a natural-looking waveform shape
    const base = Math.sin(x * Math.PI) * 0.7;
    const detail = Math.sin(x * 12) * 0.15 + Math.sin(x * 23) * 0.1 + Math.sin(x * 37) * 0.05;
    return Math.max(0.05, Math.min(1, base + detail));
  });

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.5 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
      className={`pointer-events-none select-none absolute flex items-center gap-[1.5px] ${className}`}
    >
      {bars.map((h, i) => (
        <div
          key={i}
          className="bg-yellow-400/30 rounded-full"
          style={{
            width: "1.5px",
            height: `${h * 30}px`,
            animationName: "waveformPulse",
            animationDuration: `${2 + (i % 5) * 0.3}s`,
            animationDelay: `${(i % 8) * 0.1}s`,
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
          }}
        />
      ))}
    </motion.div>
  );
}

/**
 * Small decorative frequency meter accent
 */
export function FrequencyMeter({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className={`pointer-events-none select-none absolute flex items-end gap-[2px] ${className}`}
    >
      {[0.3, 0.6, 1, 0.8, 0.5, 0.9, 0.4, 0.7, 1, 0.6, 0.3, 0.8, 0.5].map((h, i) => (
        <div
          key={i}
          className="w-[2px] rounded-full"
          style={{
            height: `${h * 16}px`,
            background: `rgba(255,215,0,${0.2 + h * 0.25})`,
            animationName: "waveformPulse",
            animationDuration: `${1.5 + (i % 4) * 0.2}s`,
            animationDelay: `${(i % 6) * 0.15}s`,
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
          }}
        />
      ))}
    </motion.div>
  );
}
