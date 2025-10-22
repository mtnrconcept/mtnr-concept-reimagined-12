type TransitionState = 'idle' | 'preparing' | 'playing'
export type TransitionListener = (state: TransitionState) => void

export class TransitionController {
  private static _instance: TransitionController | null = null
  static get instance(): TransitionController {
    if (!this._instance) {
      this._instance = new TransitionController()
    }
    return this._instance
  }

  private state: TransitionState = 'idle'
  private readonly subscribers = new Set<TransitionListener>()
  private videoEl: HTMLVideoElement | null = null
  private navInFlight = false
  private currentSrc: string | null = null

  private constructor() {}

  attach(element: HTMLVideoElement) {
    this.videoEl = element
  }

  on(listener: TransitionListener) {
    this.subscribers.add(listener)
    return () => this.subscribers.delete(listener)
  }

  private setState(next: TransitionState) {
    if (this.state === next) return
    this.state = next
    for (const listener of this.subscribers) {
      listener(next)
    }
  }

  async playTransition(src: string) {
    const video = this.videoEl
    if (!video || this.navInFlight) {
      return
    }

    this.navInFlight = true
    this.setState('preparing')

    try {
      if (this.currentSrc !== src) {
        video.pause()
        video.src = src
        video.preload = 'auto'
        this.currentSrc = src
        video.load()
      }

      video.muted = true
      video.playsInline = true

      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        await new Promise<void>((resolve) => {
          const onLoaded = () => {
            video.removeEventListener('loadeddata', onLoaded)
            resolve()
          }
          video.addEventListener('loadeddata', onLoaded, { once: true })
          setTimeout(resolve, 400)
        })
      }

      this.setState('playing')
      await video.play().catch(() => undefined)

      await new Promise<void>((resolve) => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null

        const finish = () => {
          video.removeEventListener('ended', handleEnded)
          video.removeEventListener('error', handleError)
          if (timeoutId !== null) {
            clearTimeout(timeoutId)
          }
          resolve()
        }

        const handleEnded = () => {
          finish()
        }

        const handleError = () => {
          finish()
        }

        video.addEventListener('ended', handleEnded)
        video.addEventListener('error', handleError)

        const fallbackDelay = Number.isFinite(video.duration) && video.duration > 0
          ? Math.ceil(video.duration * 1000) + 500
          : 5000

        timeoutId = setTimeout(finish, fallbackDelay)
      })
    } finally {
      if (this.videoEl) {
        this.videoEl.pause()
        this.videoEl.currentTime = 0
      }
      this.setState('idle')
      this.navInFlight = false
    }
  }
}
