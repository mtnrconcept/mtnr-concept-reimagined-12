import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

interface ParallaxElementProps {
  depth: number
  x: number
  y: number
  className?: string
  children: ReactNode
}

export const ParallaxElement = ({ depth, x, y, className, children }: ParallaxElementProps) => {
  const zIndex = depth < 0 ? Math.floor(9000 - depth * 1000) : Math.floor(1000 - depth * 1000)

  const opacity = depth < 0
    ? Math.max(0.3, 0.8 - Math.abs(depth) * 0.2)
    : Math.max(0.25, 1 - depth * 0.6)

  return (
    <div
      className={cn('parallax-element absolute', className)}
      data-parallax
      data-depth={depth}
      data-parallax-depth={depth}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        zIndex,
        transform: `translate3d(0, var(--wc-parallax-offset, 0px), ${depth * -2000}px) scale(${1 + Math.abs(depth) * 0.5})`,
        opacity,
        pointerEvents: 'none',
        transformOrigin: 'center center',
        transition: 'transform 0.1s linear',
      }}
    >
      {children}
    </div>
  )
}
