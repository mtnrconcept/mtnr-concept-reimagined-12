
import { useEffect, useState } from "react";
import { VideoState, VideoActions } from "./types";

interface UseVideoErrorHandlingProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoState: Pick<VideoState, "videoError" | "retryCount">;
  videoActions: Pick<VideoActions, "setVideoError" | "setRetryCount">;
  fallbackImage: string;
}

export function useVideoErrorHandling({
  videoRef,
  videoState,
  videoActions,
  fallbackImage,
}: UseVideoErrorHandlingProps) {
  const { videoError, retryCount } = videoState;
  const { setVideoError, setRetryCount } = videoActions;
  
  // Gestion des erreurs vidéo
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleVideoError = (error: Event) => {
      console.error("Erreur lors du chargement de la vidéo:", error);
      if (retryCount < 3) {
        console.log(`Tentative de rechargement ${retryCount + 1}/3...`);
        setRetryCount(retryCount + 1);
        
        // Timeout court avant de réessayer
        setTimeout(() => {
          if (videoElement) {
            videoElement.load();
            videoElement.play().catch(e => {
              console.error("Échec de lecture après tentative de rechargement:", e);
              if (retryCount >= 2) {
                setVideoError(true);
              }
            });
          }
        }, 1000);
      } else {
        setVideoError(true);
      }
    };

    videoElement.addEventListener("error", handleVideoError);
    
    return () => {
      videoElement.removeEventListener("error", handleVideoError);
    };
  }, [videoRef, retryCount, setRetryCount, setVideoError]);

  // Gestion de l'affichage du fallback lorsqu'une erreur se produit
  useEffect(() => {
    if (videoError && videoRef.current) {
      console.log("Erreur vidéo détectée, affichage du fallback");
      videoRef.current.poster = fallbackImage;
    }
  }, [videoError, fallbackImage, videoRef]);
}
