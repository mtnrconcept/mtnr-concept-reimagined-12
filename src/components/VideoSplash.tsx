import { useEffect, useRef } from 'react'
import { TransitionController } from '../lib/TransitionController'
import VideoOverlayEffects from './effects/video/VideoOverlayEffects'

export default function VideoSplash() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const warmupVideosRef = useRef<HTMLVideoElement[]>([])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.autoplay = true

    TransitionController.instance.attach(video)
  }, [])

  // Warm-up routine: preload both videos in memory for instant playback
  useEffect(() => {
    const sources = [
      '/lovable-uploads/videonormale.mp4',
      '/lovable-uploads/videouv.mp4'
    ]
    
    sources.forEach(src => {
      const warmupVideo = document.createElement('video')
      warmupVideo.preload = 'auto'
      warmupVideo.muted = true
      warmupVideo.playsInline = true
      warmupVideo.style.display = 'none'
      warmupVideo.src = src
      
      try {
        warmupVideo.load()
      } catch (error) {
        console.warn(`Failed to preload video: ${src}`, error)
      }
      
      warmupVideosRef.current.push(warmupVideo)
    })

    return () => {
      // Clean up warmup videos on unmount
      warmupVideosRef.current.forEach(video => {
        video.src = ''
        video.load()
      })
      warmupVideosRef.current = []
    }
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
          transform: 'translate3d(0, 0, 0)',
          transformOrigin: 'center',
          backfaceVisibility: 'hidden',
          willChange: 'transform',
        }}
      />
      <VideoOverlayEffects />
    </div>
  )
}
