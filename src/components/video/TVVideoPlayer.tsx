
import React, { useState, useEffect } from 'react';
import { TVPaginationControls } from './TVPaginationControls';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Video {
  id: string;
  title: string;
  artist: string;
}

const videos: Video[] = [
  { id: "wQ4-2-Quhbw", title: "Unforgiven", artist: "U.D Sensei" },
  { id: "OWnpKebQIYY", title: "Purgatoire", artist: "Mairo" },
  { id: "5g4V0-Zt_9A", title: "Infernal", artist: "Aray" },
  { id: "MdKeBpQrDv0", title: "Tourner La Page", artist: "Neverzed" },
  { id: "JAfLPn5Uj6g", title: "Démons", artist: "U.D Sensei" },
  { id: "2D2SSmbvGZI", title: "Virage", artist: "Mairo" },
  { id: "pgBjz5xn0lI", title: "Bourreau", artist: "Aray" }
];

export default function TVVideoPlayer() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const currentVideo = videos[currentVideoIndex];

  // Réinitialiser le chargement lorsque la vidéo change
  useEffect(() => {
    setIsLoading(true);
    // Le délai simule le temps de chargement de la vidéo
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [currentVideoIndex]);

  const handleNext = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePrevious = () => {
    setCurrentVideoIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  const goToVideo = (index: number) => {
    setCurrentVideoIndex(index);
  };

  return (
    <div className="max-w-4xl mx-auto my-8 sm:my-12 lg:my-16 px-3 sm:px-6">
      {/* TV Frame avec dimensions préservées */}
      <div className="relative w-full">
        <AspectRatio ratio={16/9} className="relative overflow-hidden bg-black rounded-lg">
          {/* Conteneur du lecteur vidéo avec positionnement absolu pour maintenir la cohérence */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Conteneur YouTube avec dimensions fixes correspondant à l'original */}
            <div className="relative w-[60%] h-[60%]">
              {/* Affichage du chargement */}
              {isLoading && (
                <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
                  <div className="w-full h-full opacity-30" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22a%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23a)%22/%3E%3C/svg%3E")',
                    animation: 'noise 1s infinite'
                  }}>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm font-mono">
                    Chargement...
                  </div>
                </div>
              )}
              
              {/* YouTube Video - dimensions exactes préservées */}
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=0&controls=0&showinfo=0&rel=0&modestbranding=1`}
                title={currentVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            {/* TV Overlay Image - position fixe par rapport au lecteur */}
            <img 
              src="/lovable-uploads/tv.png" 
              alt="TV Frame" 
              className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
            />
          </div>
        </AspectRatio>
      </div>

      {/* Video Info */}
      <div className="mt-6 mb-4 text-center">
        <h3 className="text-yellow-400 text-xl font-bold">{currentVideo.title}</h3>
        <p className="text-gray-400 text-sm">par {currentVideo.artist}</p>
      </div>
      
      {/* Custom Pagination Controls */}
      <TVPaginationControls 
        totalVideos={videos.length}
        currentIndex={currentVideoIndex}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSelect={goToVideo}
      />

      {/* Animation for TV static */}
      <style>
        {`
        @keyframes noise {
          0% { transform: translate(0,0); }
          10% { transform: translate(-5%,-5%); }
          20% { transform: translate(-10%,5%); }
          30% { transform: translate(5%,-10%); }
          40% { transform: translate(-5%,15%); }
          50% { transform: translate(-10%,5%); }
          60% { transform: translate(15%,0); }
          70% { transform: translate(0,10%); }
          80% { transform: translate(-15%,0); }
          90% { transform: translate(10%,5%); }
          100% { transform: translate(5%,0); }
        }
        `}
      </style>
    </div>
  );
}
