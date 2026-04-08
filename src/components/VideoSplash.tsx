import { useEffect, useRef } from 'react'
import { TransitionController } from '../lib/TransitionController'
import { useUVMode } from './effects/UVModeContext'
import VideoOverlayEffects from './effects/video/VideoOverlayEffects'

const NORMAL_SRC = '/lovable-uploads/videonormale.mp4'
const UV_SRC = '/lovable-uploads/videouv.mp4'

export default function VideoSplash() {
  const normalRef = useRef<HTMLVideoElement | null>(null)
  const uvRef = useRef<HTMLVideoElement | null>(null)
  const { uvMode } = useUVMode()
  const didMountRef = useRef(false)

  // Attach the currently-active video to the TransitionController and play the intro
  useEffect(() => {
    const active = (uvMode ? uvRef : normalRef).current
    if (!active) return
    active.muted = true
    active.playsInline = true
    active.preload = 'auto'
    TransitionController.instance.attach(active)

    if (!didMountRef.current) {
      TransitionController.instance.playTransition(uvMode ? UV_SRC : NORMAL_SRC)
      didMountRef.current = true
    }
  }, [uvMode])

  // Make sure the inactive video shows its first frame as a static backdrop
  useEffect(() => {
    const ensureFirstFrame = (video: HTMLVideoElement | null) => {
      if (!video) return
      const show = () => {
        try {
          video.pause()
          video.currentTime = 0
        } catch {
          /* ignore */
        }
      }
      if (video.readyState >= 1) show()
      else video.addEventListener('loadedmetadata', show, { once: true })
    }
    ensureFirstFrame(normalRef.current)
    ensureFirstFrame(uvRef.current)
  }, [])

  // Extremely subtle parallax (inverted), with per-video scale correction
  useEffect(() => {
    let ticking = false
    let scrollY = 0
    const MAX = 15 // px

    const apply = () => {
      const raw = -scrollY * 0.03
      const offset = Math.max(-MAX, Math.min(MAX, raw))
      if (normalRef.current) {
        normalRef.current.style.setProperty('--parallax-y', `${offset}px`)
      }
      if (uvRef.current) {
        uvRef.current.style.setProperty('--parallax-y', `${offset}px`)
      }
      ticking = false
    }

    const onScroll = () => {
      scrollY = window.scrollY
      if (!ticking) {
        requestAnimationFrame(apply)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    apply()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const baseVideoStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    transformOrigin: 'center',
    backfaceVisibility: 'hidden',
    willChange: 'transform, opacity, filter',
    // Smooth crossfade: opacity + blur + scale for a cinematic dissolve
    transition:
      'opacity 900ms cubic-bezier(0.22, 1, 0.36, 1), filter 900ms cubic-bezier(0.22, 1, 0.36, 1)',
  }

  const normalActive = !uvMode
  const uvActive = uvMode

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      {/* NORMAL video */}
      <video
        ref={normalRef}
        src={NORMAL_SRC}
        muted
        playsInline
        preload="auto"
        style={{
          ...baseVideoStyle,
          opacity: normalActive ? 1 : 0,
          filter: normalActive ? 'blur(0px) brightness(1)' : 'blur(14px) brightness(0.7)',
          transform:
            'translate3d(0, var(--parallax-y, 0px), 0) scale(' +
            (normalActive ? 1 : 1.04) +
            ')',
        }}
      />

      {/* UV video — scaled down because the source is framed tighter */}
      <video
        ref={uvRef}
        src={UV_SRC}
        muted
        playsInline
        preload="auto"
        style={{
          ...baseVideoStyle,
          opacity: uvActive ? 1 : 0,
          filter: uvActive
            ? 'blur(0px) brightness(1) saturate(1.1)'
            : 'blur(14px) brightness(0.7) saturate(1.1)',
          transform:
            'translate3d(0, var(--parallax-y, 0px), 0) scale(' +
            (uvActive ? 0.85 : 0.88) +
            ')',
        }}
      />

      {/* Flash sweep that plays during the crossfade */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: uvMode
            ? 'radial-gradient(circle at 50% 50%, rgba(210,255,63,0.18), rgba(210,255,63,0) 60%)'
            : 'radial-gradient(circle at 50% 50%, rgba(255,215,0,0.12), rgba(255,215,0,0) 60%)',
          opacity: 0,
          animation: 'mtnr-video-flash 900ms ease-out',
          animationPlayState: 'running',
          mixBlendMode: 'screen',
        }}
        key={uvMode ? 'uv' : 'normal'}
      />

      <style>{`
        @keyframes mtnr-video-flash {
          0%   { opacity: 0; }
          30%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      <VideoOverlayEffects />
    </div>
  )
}
