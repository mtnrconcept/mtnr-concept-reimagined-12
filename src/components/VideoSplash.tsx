import { useEffect, useRef } from 'react'
import { TransitionController } from '../lib/TransitionController'

export default function VideoSplash() {
  const ref = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    video.muted = true
    ;(video as any).playsInline = true
    video.preload = 'metadata'
    TransitionController.i.attach(video)
  }, [])

  return (
    <video
      ref={ref}
      muted
      playsInline
      autoPlay
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}
