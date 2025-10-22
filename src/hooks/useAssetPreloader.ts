import { useEffect, useMemo, useRef, useState } from "react"

export type AssetDescriptor = {
  src: string
  type: "image" | "video"
}

interface AssetPreloaderOptions {
  cacheName?: string
  minimumDelay?: number
}

const DEFAULT_OPTIONS: Required<AssetPreloaderOptions> = {
  cacheName: "transition-assets-v1",
  minimumDelay: 900,
}

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image()
    const handleLoad = () => {
      cleanup()
      resolve()
    }
    const handleError = () => {
      cleanup()
      resolve()
    }
    const cleanup = () => {
      img.removeEventListener("load", handleLoad)
      img.removeEventListener("error", handleError)
    }

    img.addEventListener("load", handleLoad)
    img.addEventListener("error", handleError)
    img.decoding = "async"
    img.src = src
  })

const preloadVideo = (src: string) =>
  new Promise<void>((resolve) => {
    const video = document.createElement("video")
    const cleanup = () => {
      video.removeEventListener("canplaythrough", handleCanPlay)
      video.removeEventListener("error", handleError)
    }
    const handleCanPlay = () => {
      cleanup()
      resolve()
    }
    const handleError = () => {
      cleanup()
      resolve()
    }

    video.preload = "auto"
    video.muted = true
    video.playsInline = true
    video.crossOrigin = "anonymous"

    video.addEventListener("canplaythrough", handleCanPlay)
    video.addEventListener("error", handleError)

    video.src = src
    // Force the browser to start fetching the resource immediately
    const loadPromise = video.load()
    if (loadPromise instanceof Promise) {
      loadPromise.catch(() => undefined)
    }
  })

export function useAssetPreloader(
  assets: AssetDescriptor[],
  options?: AssetPreloaderOptions,
) {
  const { cacheName, minimumDelay } = { ...DEFAULT_OPTIONS, ...options }
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  const uniqueAssets = useMemo(() => {
    const seen = new Set<string>()
    return assets.filter((asset) => {
      if (!asset.src || seen.has(asset.src)) {
        return false
      }
      seen.add(asset.src)
      return true
    })
  }, [assets])

  useEffect(() => {
    if (typeof window === "undefined" || uniqueAssets.length === 0) {
      setProgress(1)
      setIsLoaded(true)
      return
    }

    let isCancelled = false
    let loadedCount = 0
    const total = uniqueAssets.length
    setProgress(0)
    setIsLoaded(false)

    const startTime = typeof performance !== "undefined" ? performance.now() : Date.now()

    const updateProgress = () => {
      if (isCancelled) return
      loadedCount += 1
      setProgress(loadedCount / total)

      if (loadedCount >= total) {
        const complete = () => {
          if (!isCancelled) {
            setIsLoaded(true)
          }
        }

        const elapsed = (typeof performance !== "undefined" ? performance.now() : Date.now()) - startTime
        const remainingDelay = Math.max(0, minimumDelay - elapsed)
        if (remainingDelay > 0) {
          timeoutRef.current = window.setTimeout(complete, remainingDelay)
        } else {
          complete()
        }
      }
    }

    const loaders = uniqueAssets.map((asset) => {
      if (asset.type === "image") {
        return preloadImage(asset.src).then(updateProgress)
      }
      return preloadVideo(asset.src).then(updateProgress)
    })

    Promise.allSettled(loaders).catch(() => undefined)

    return () => {
      isCancelled = true
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [minimumDelay, uniqueAssets])

  useEffect(() => {
    if (typeof window === "undefined" || !("caches" in window)) {
      return
    }

    let cancelled = false

    const cacheAssets = async () => {
      try {
        const cache = await caches.open(cacheName)
        await Promise.all(
          uniqueAssets.map(async (asset) => {
            if (cancelled) return
            try {
              const match = await cache.match(asset.src)
              if (!match) {
                await cache.add(asset.src)
              }
            } catch {
              // Ignore cache failures silently
            }
          }),
        )
      } catch {
        // Cache API may be unavailable or restricted
      }
    }

    cacheAssets().catch(() => undefined)

    return () => {
      cancelled = true
    }
  }, [cacheName, uniqueAssets])

  return {
    progress,
    isLoaded,
  }
}

