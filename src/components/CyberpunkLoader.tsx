import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CyberpunkLoaderProps {
  progress: number
  isVisible: boolean
}

export function CyberpunkLoader({ progress, isVisible }: CyberpunkLoaderProps) {
  const safeProgress = Number.isFinite(progress) ? Math.min(Math.max(progress, 0), 1) : 0
  const percent = Math.round(safeProgress * 100)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="cyberpunk-loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="cyberpunk-loader__scanlines" />
            <div className="cyberpunk-loader__grid" />
            <div className="cyberpunk-loader__glow" />
          </div>

          <motion.div
            className="relative z-10 flex flex-col items-center gap-8 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex flex-col items-center gap-6">
              <div className="cyberpunk-loader__rings">
                <motion.span
                  className="cyberpunk-loader__ring"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                />
                <motion.span
                  className="cyberpunk-loader__ring"
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                />
                <motion.span
                  className="cyberpunk-loader__ring"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
                />
                <motion.span
                  className="cyberpunk-loader__core"
                  animate={{ scale: [1, 1.12, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                />
              </div>

              <div className="relative">
                <span
                  className="cyberpunk-loader__title"
                  data-text="Initialisation du Nexus"
                >
                  Initialisation du Nexus
                </span>
                <span className="cyberpunk-loader__subtitle">
                  Séquençage des interfaces immersives
                </span>
              </div>
            </div>

            <div className="flex w-full max-w-xl flex-col gap-3">
              <div className="relative h-3 overflow-hidden rounded-full border border-cyan-400/50 bg-cyan-500/10">
                <motion.div
                  className="absolute inset-y-0 left-0 cyberpunk-loader__bar"
                  initial={{ width: "0%" }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-cyan-200/70">
                <span>Buffering</span>
                <span className="font-mono text-cyan-100">{percent.toString().padStart(2, "0")}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[10px] uppercase tracking-[0.45em] text-cyan-200/60 md:text-xs">
              {[
                "Préchargement vidéo", "Optimisation fumée",
                "Synchronisation néon", "Activation UV",
              ].map((label) => (
                <span key={label} className="cyberpunk-loader__badge">
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function LoaderScrim({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-[999] bg-black transition-opacity duration-700",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    />
  )
}

