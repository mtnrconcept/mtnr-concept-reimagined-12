
import React, { useState, useEffect } from 'react';
import { TVPaginationControls } from './TVPaginationControls';

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

// Dimensions de référence de la TV
const TV_DIMENSIONS = {
  width: 1164, // largeur en pixels
  height: 655, // hauteur en pixels
};

// Position de l'écran dans la TV
const SCREEN_POSITION = {
  top: 83, // Y en pixels
  left: 97, // X en pixels
  width: 819, // Largeur estimée de l'écran
  height: 489, // Hauteur estimée de l'écran
};

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

  // Calcul des pourcentages pour le positionnement relatif
  const screenPositionStyle = {
    top: `${(SCREEN_POSITION.top / TV_DIMENSIONS.height) * 100}%`,
    left: `${(SCREEN_POSITION.left / TV_DIMENSIONS.width) * 100}%`,
    width: `${(SCREEN_POSITION.width / TV_DIMENSIONS.width) * 100}%`,
    height: `${(SCREEN_POSITION.height / TV_DIMENSIONS.height) * 100}%`,
  };

  return (
    <div className="relative max-w-4xl mx-auto my-16">
      {/* TV Frame with actual image */}
      <div className="relative w-full aspect-video">
        {/* Conteneur pour maintenir le ratio */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {/* YouTube Player - Position relative à l'intérieur de l'écran TV */}
          <div className="absolute" style={screenPositionStyle}>
            {/* Loading static */}
            {isLoading && (
              <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
                <div className="w-full h-full opacity-30" style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22a%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23a)%22/%3E%3C/svg%3E")',
                  animation: 'noise 0.2s infinite'
                }}>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm font-mono">
                  Chargement...
                </div>
              </div>
            )}
            
            {/* YouTube Video */}
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=0&controls=0&showinfo=0&rel=0&modestbranding=1`}
              title={currentVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          
          {/* TV Overlay Image (nouvelle image) */}
          <img 
            src="/lovable-uploads/74a3fc95-3585-4ec5-83d9-080e4dffabb7.png" 
            alt="TV Frame" 
            className="w-full h-full object-contain pointer-events-none z-10"
          />
        </div>
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
