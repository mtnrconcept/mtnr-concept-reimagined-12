
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

// Dimensions réelles de la TV
const TV_DIMENSIONS = {
  width: 1614, // largeur en pixels
  height: 881, // hauteur en pixels
};

// Position et taille de l'écran dans la TV
const SCREEN_POSITION = {
  top: 83, // Y en pixels
  left: 97, // X en pixels
  width: 1164, // Largeur en pixels de l'écran
  height: 655, // Hauteur en pixels de l'écran
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
      {/* Conteneur principal avec ratio d'aspect de la TV */}
      <div className="relative w-full" style={{ paddingBottom: `${(TV_DIMENSIONS.height / TV_DIMENSIONS.width) * 100}%` }}>
        {/* Conteneur pour maintenir le ratio et positionner les éléments */}
        <div className="absolute inset-0">
          {/* La position relative du lecteur vidéo par rapport à la TV */}
          <div className="absolute" style={screenPositionStyle}>
            {/* Animation de chargement - En dessous de la vidéo mais au-dessus du fond */}
            {isLoading && (
              <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center z-10">
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
            
            {/* Lecteur YouTube - Positionné pour permettre l'interaction avec z-index élevé */}
            <div className="absolute inset-0 w-full h-full z-20">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&controls=1&showinfo=0&rel=0&modestbranding=1`}
                title={currentVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          
          {/* Image de la TV - Utilise un clip-path pour permettre l'interaction avec le lecteur */}
          <div className="absolute inset-0 w-full h-full z-30 pointer-events-none">
            <img 
              src="/lovable-uploads/74a3fc95-3585-4ec5-83d9-080e4dffabb7.png" 
              alt="TV Frame" 
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Informations sur la vidéo */}
      <div className="mt-6 mb-4 text-center">
        <h3 className="text-yellow-400 text-xl font-bold">{currentVideo.title}</h3>
        <p className="text-gray-400 text-sm">par {currentVideo.artist}</p>
      </div>
      
      {/* Contrôles de pagination personnalisés */}
      <TVPaginationControls 
        totalVideos={videos.length}
        currentIndex={currentVideoIndex}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSelect={goToVideo}
      />

      {/* Animation pour le statique TV */}
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
