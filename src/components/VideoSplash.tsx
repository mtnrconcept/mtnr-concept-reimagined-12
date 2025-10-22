import { useEffect, useRef } from 'react'
import { TransitionController } from '../lib/TransitionController'
import VideoOverlayEffects from './effects/video/VideoOverlayEffects'

export default function VideoSplash() {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.autoplay = true

    TransitionController.instance.attach(video)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'translate3d(0, 0, 0) scale(1.1)',
          transformOrigin: 'center',
          backfaceVisibility: 'hidden',
          willChange: 'transform',
        }}
      />
      <VideoOverlayEffects />
    </div>
  )
}
