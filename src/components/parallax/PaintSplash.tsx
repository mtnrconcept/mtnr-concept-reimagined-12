import { useMemo } from 'react'
import { useUVMode } from '@/components/effects/UVModeContext'

type SupportedBlendMode = 'screen' | 'overlay' | 'soft-light' | 'color-dodge' | 'lighten' | 'color'

interface PaintSplashProps {
  x: number
  y: number
  depth: number
  scale?: number
  rotation?: number
  className?: string
  src?: string
  blur?: number
  blendMode?: SupportedBlendMode
}

export const PaintSplash: React.FC<PaintSplashProps> = ({
  x,
  y,
  depth,
  scale = 1,
  rotation = 0,
  className = '',
  src = '/lovable-uploads/paint-splatter-hi.png',
  blur = 0,
  blendMode = 'screen'
}) => {
  const { uvMode } = useUVMode()

  const zIndex = depth < 0 ? Math.floor(20 - depth * 10) : Math.floor(10 - depth * 10)

  const baseOpacity = className.includes('opacity-')
    ? parseFloat(className.match(/opacity-(\d+)/)?.[1] || '30') / 100
    : 0.3

  const depthScale = 1 + Math.abs(depth) * (depth < 0 ? 0.3 : -0.2)
  const finalScale = scale * depthScale

  const finalBlendMode = uvMode ? 'screen' : blendMode

  const baseTransform = useMemo(() => {
    return [
      'translate(-50%, -50%)',
      `scale(${finalScale})`,
      `rotate(${rotation}deg)`
    ].join(' ')
  }, [finalScale, rotation])

  return (
    <div
      className={`absolute parallax-element ${className}`}
      data-depth={depth}
      data-parallax="true"
      data-parallax-base={baseTransform}
      data-parallax-depth={depth}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        mixBlendMode: finalBlendMode,
        zIndex,
        transform: baseTransform,
        transition: 'opacity 0.2s ease-out'
      }}
    >
      <img
        src={src}
        alt="paint splash effect"
        className={`w-full h-full object-contain ${uvMode ? 'uv-splash' : ''}`}
        style={{
          maxWidth: depth < 0 ? '550px' : depth < 0.5 ? '450px' : '350px',
          opacity: Math.max(0.1, Math.min(1, baseOpacity * (1 - Math.abs(depth) * 0.3))),
          filter: uvMode
            ? `hue-rotate(60deg) brightness(1.8) saturate(2) blur(${blur + Math.abs(depth) * 2}px)`
            : `blur(${blur + Math.abs(depth) * 2}px)`,
          transition: 'filter 0.5s ease-out'
        }}
      />
    </div>
  )
}
