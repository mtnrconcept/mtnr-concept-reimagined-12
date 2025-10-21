import { PropsWithChildren, useEffect } from 'react'
import { TransitionController } from '../lib/TransitionController'

type Props = {
  pickVideoSrc: (pathname: string) => string | null
  subscribeToRoute: (cb: (path: string) => void) => () => void
}

let playForRoute: ((path: string) => Promise<void>) | null = null

export function requestTransitionForRoute(path: string) {
  if (!playForRoute) {
    return Promise.resolve()
  }
  return playForRoute(path)
}

export function NavigationEventsProvider({ pickVideoSrc, subscribeToRoute, children }: PropsWithChildren<Props>) {
  useEffect(() => {
    playForRoute = async (path: string) => {
      const src = pickVideoSrc(path)
      if (src) {
        await TransitionController.instance.playTransition(src)
      }
    }
    return () => {
      playForRoute = null
    }
  }, [pickVideoSrc])

  useEffect(() => {
    return subscribeToRoute(async (path) => {
      const src = pickVideoSrc(path)
      if (src) {
        await TransitionController.instance.playTransition(src)
      }
    })
  }, [pickVideoSrc, subscribeToRoute])

  return <>{children}</>
}
