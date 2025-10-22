import React, { createContext, useContext, useRef, useCallback } from 'react'
import { requestTransitionForRoute } from '@/providers/NavigationEvents'

interface NavigationContextType {
  triggerVideoTransition: (path?: string) => void
  registerVideoTransitionListener: (callback: () => void) => () => void
}

const NavigationContext = createContext<NavigationContextType | null>(null)

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const listenersRef = useRef<(() => void)[]>([])
  const transitionInProgressRef = useRef<boolean>(false)

  const triggerVideoTransition = useCallback((path?: string) => {
    if (transitionInProgressRef.current) return

    transitionInProgressRef.current = true

    const targetPath = path ?? window.location.pathname

    requestTransitionForRoute(targetPath)
      .catch((error) => {
        console.error("Erreur lors du déclenchement de la transition vidéo:", error)
      })
      .finally(() => {
        transitionInProgressRef.current = false
      })

    listenersRef.current.forEach((listener) => {
      try {
        listener()
      } catch (error) {
        console.error("Erreur lors de l'exécution d'un listener de navigation:", error)
      }
    })
  }, [])

  const registerVideoTransitionListener = useCallback((callback: () => void) => {
    listenersRef.current.push(callback)
    console.log(`Nouveau listener enregistré, total: ${listenersRef.current.length}`)

    return () => {
      listenersRef.current = listenersRef.current.filter((listener) => listener !== callback)
      console.log(`Listener désenregistré, total: ${listenersRef.current.length}`)
    }
  }, [])

  const contextValue = React.useMemo(
    () => ({
      triggerVideoTransition,
      registerVideoTransitionListener,
    }),
    [triggerVideoTransition, registerVideoTransitionListener]
  )

  return <NavigationContext.Provider value={contextValue}>{children}</NavigationContext.Provider>
}

export const useNavigation = () => {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
