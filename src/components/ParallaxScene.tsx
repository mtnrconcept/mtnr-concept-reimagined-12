import { useEffect } from 'react'
import { useParallax } from '@/hooks/useParallax'

export default function ParallaxScene() {
  useParallax({ strength: 0.25, selector: '[data-parallax]' })

  useEffect(() => {
    console.log('ParallaxScene mounted')
    return () => console.log('ParallaxScene unmounted')
  }, [])

  return null
}
