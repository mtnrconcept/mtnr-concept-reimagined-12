import { useEffect, useRef } from 'react'

type Options = {
  strength?: number
  selector?: string
  idleTimeout?: number
}

export function useParallax({ strength = 0.3, selector = '[data-parallax]', idleTimeout = 500 }: Options = {}) {
  const ticking = useRef(false)
  const lastY = useRef(0)

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector))
    if (!nodes.length) return

    const arm = () => nodes.forEach((node) => node.classList.add('wc-armed'))
    const disarm = () => nodes.forEach((node) => node.classList.remove('wc-armed'))

    let disarmTimer: number | undefined

    const update = () => {
      ticking.current = false
      const y = window.scrollY || 0
      if (Math.abs(y - lastY.current) < 0.5) return
      lastY.current = y
      for (const node of nodes) {
        const depth = Number(node.dataset.parallaxDepth ?? node.dataset.depth ?? '1')
        const offset = -y * strength * depth
        node.style.setProperty('--wc-parallax-offset', `${offset}px`)
      }
    }

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(update)
      }
    }

    const onIdle = () => {
      if (disarmTimer) {
        window.clearTimeout(disarmTimer)
      }
      disarmTimer = window.setTimeout(disarm, idleTimeout)
    }

    arm()
    update()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scroll', onIdle, { passive: true })

    disarmTimer = window.setTimeout(disarm, idleTimeout)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', onIdle)
      if (disarmTimer) {
        window.clearTimeout(disarmTimer)
      }
      disarm()
      for (const node of nodes) {
        node.style.removeProperty('--wc-parallax-offset')
      }
    }
  }, [selector, strength, idleTimeout])
}
