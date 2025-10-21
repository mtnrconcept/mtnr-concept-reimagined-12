import { PropsWithChildren, useEffect } from 'react'
import { TransitionController } from '../lib/TransitionController'

type Props = {
  pickVideoSrc: (pathname: string) => string | null | undefined
  subscribeToRoute: (cb: (path: string) => void) => () => void
}

export function NavigationEventsProvider({ pickVideoSrc, subscribeToRoute, children }: PropsWithChildren<Props>) {
  useEffect(() => {
    let booted = false
    const off = subscribeToRoute(async (path) => {
      if (!booted) {
        booted = true
        return
      }
      const src = pickVideoSrc(path)
      if (src) {
        await TransitionController.i.playTransition(src)
      }
    })
    return off
  }, [pickVideoSrc, subscribeToRoute])

  return <>{children}</>
}
