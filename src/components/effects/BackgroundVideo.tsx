
import React, { useRef, useEffect, useState } from 'react';

interface BackgroundVideoProps {
  videoSrc: string;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (videoElement) {
      // Fonction pour mettre en pause la vidéo à la fin
      const handleEnded = () => {
        console.log("Vidéo terminée, pause maintenue");
        // La vidéo reste sur la dernière image
      };
      
      // Fonction pour marquer le chargement
      const handleLoaded = () => {
        setIsLoaded(true);
        console.log("Vidéo de fond chargée");
        
        // Précharger la vidéo en la lisant puis en la mettant en pause
        // pour s'assurer qu'elle est prête pour les transitions
        videoElement.play()
          .then(() => {
            // Attendre une fraction de seconde pour que la vidéo se charge vraiment
            setTimeout(() => {
              videoElement.pause();
              console.log("Vidéo mise en pause après préchargement");
            }, 100);
          })
          .catch(err => {
            console.error("Erreur de préchargement vidéo:", err);
          });
      };
      
      videoElement.addEventListener('ended', handleEnded);
      videoElement.addEventListener('loadeddata', handleLoaded);
      
      return () => {
        videoElement.removeEventListener('ended', handleEnded);
        videoElement.removeEventListener('loadeddata', handleLoaded);
      };
    }
  }, []);
  
  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={videoSrc}
        muted
        playsInline
        preload="auto"
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-black z-[1] flex items-center justify-center">
          <div className="text-yellow-400 text-2xl">Chargement...</div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
    </div>
  );
};

export default BackgroundVideo;
