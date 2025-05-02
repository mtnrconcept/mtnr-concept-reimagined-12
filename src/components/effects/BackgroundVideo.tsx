import React, { useEffect, useRef, useState } from "react";
import { useUVMode } from "./UVModeContext";
import { useLocation } from "react-router-dom";

interface BackgroundVideoProps {
  videoUrl?: string;
  videoUrlUV?: string;
  fallbackImage?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  videoUrl = "/lovable-uploads/Video fond normale.mp4",
  videoUrlUV = "/lovable-uploads/Video fond UV.mp4",
  fallbackImage = "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const { uvMode } = useUVMode();
  const location = useLocation();
  const currentVideoUrl = uvMode ? videoUrlUV : videoUrl;

  // Chargement initial de la vidéo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.autoplay = true;

    const playVideo = () => {
      video.src = currentVideoUrl;
      video.load();
      video.play().catch((err) => {
        console.warn("Autoplay échoué :", err);
        setVideoError(true);
      });
    };

    playVideo();
  }, [currentVideoUrl, location.pathname]);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1] overflow-hidden">
      {!videoError ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          onError={() => setVideoError(true)}
        />
      ) : (
        <img
          src={fallbackImage}
          alt="Fallback Background"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};
