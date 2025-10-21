import { useEffect, useRef } from 'react'

type Options = {
  strength?: number
  selector?: string
}

export function useParallax({ strength = 0.3, selector = '[data-parallax]' }: Options = {}) {
  const ticking = useRef(false)
  const lastY = useRef(0)

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector))
    if (!nodes.length) return

    const baseTransforms = new Map<HTMLElement, string>()
    nodes.forEach((node) => {
      const base = node.dataset.parallaxBase ?? ''
      baseTransforms.set(node, base.trim())
    })

    const arm = () => nodes.forEach((node) => node.classList.add('wc-armed'))
    const disarm = () => nodes.forEach((node) => node.classList.remove('wc-armed'))

    const update = () => {
      ticking.current = false
      const y = window.scrollY || 0
      if (Math.abs(y - lastY.current) < 0.5) return
      lastY.current = y

      nodes.forEach((node) => {
        const depthAttr = node.dataset.parallaxDepth ?? node.dataset.depth
        const depth = depthAttr ? Number.parseFloat(depthAttr) : 1
        const depthFactor = Number.isFinite(depth) ? depth : 1
        const offset = y * strength * depthFactor
        const base = baseTransforms.get(node) ?? ''
        const transform = [base, `translate3d(0, ${-offset}px, 0)`]
          .map((part) => part.trim())
          .filter(Boolean)
          .join(' ')
        node.style.transform = transform
      })
    }

    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(update)
        ticking.current = true
      }
    }

    arm()
    update()
    window.addEventListener('scroll', onScroll, { passive: true })

    let idleTimer: ReturnType<typeof setTimeout> | undefined
    const onIdle = () => {
      if (idleTimer) clearTimeout(idleTimer)
      idleTimer = setTimeout(disarm, 500)
    }

    window.addEventListener('scroll', onIdle, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', onIdle)
      if (idleTimer) clearTimeout(idleTimer)
      disarm()
      nodes.forEach((node) => {
        node.style.transform = baseTransforms.get(node) ?? ''
      })
    }
  }, [selector, strength])
}
