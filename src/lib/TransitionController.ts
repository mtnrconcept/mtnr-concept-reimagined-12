type TransitionState = 'idle' | 'preparing' | 'playing'
type Listener = (state: TransitionState) => void

export class TransitionController {
  private static _i: TransitionController | null = null
  static get i() {
    if (!this._i) {
      this._i = new TransitionController()
    }
    return this._i
  }

  private state: TransitionState = 'idle'
  private subs = new Set<Listener>()
  private videoEl: HTMLVideoElement | null = null
  private navInFlight = false
  private currentSrc: string | null = null

  attach(el: HTMLVideoElement) {
    this.videoEl = el
  }

  on(fn: Listener) {
    this.subs.add(fn)
    return () => this.subs.delete(fn)
  }

  private setState(next: TransitionState) {
    if (this.state === next) return
    this.state = next
    this.subs.forEach((listener) => listener(next))
  }

  async playTransition(src: string) {
    const video = this.videoEl
    if (!video) return
    if (this.navInFlight) return

    this.navInFlight = true
    this.setState('preparing')

    try {
      if (this.currentSrc !== src) {
        video.pause()
        video.src = src
        video.preload = 'metadata'
        this.currentSrc = src
        if (typeof video.load === 'function') {
          video.load()
        }
      }

      video.muted = true
      ;(video as any).playsInline = true

      await video.play().catch(() => undefined)
      this.setState('playing')

      await new Promise<void>((resolve) => {
        const onEnd = () => {
          video.removeEventListener('ended', onEnd)
          resolve()
        }
        video.addEventListener('ended', onEnd, { once: true })
        setTimeout(resolve, 1200)
      })
    } catch {
      // ignore - best effort only
    } finally {
      this.videoEl?.pause()
      this.setState('idle')
      this.navInFlight = false
    }
  }
}
