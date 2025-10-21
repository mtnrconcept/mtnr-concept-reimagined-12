
import React, { useState, useEffect } from 'react';
import { TVPaginationControls } from './TVPaginationControls';

interface Video {
  id: string;
  title: string;
  artist: string;
}

const videos: Video[] = [
  { id: "wQ4-2-Quhbw", title: "La tête sous l'eau", artist: "Allsix feat Aray" },
  { id: "OWnpKebQIYY", title: "L'élu", artist: "Aray" },
  { id: "5g4V0-Zt_9A", title: "Perdu", artist: "Aray" },
  { id: "MdKeBpQrDv0", title: "Si seulement", artist: "Allsix" },
  { id: "JAfLPn5Uj6g", title: "DLa tête dans les nuages", artist: "Maler" },
  { id: "2D2SSmbvGZI", title: "Tous les jours", artist: "Allsix" },
  { id: "pgBjz5xn0lI", title: "Boom chaka llaka", artist: "Hary-B feat Maler" }
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
  const [tvLoaded, setTVLoaded] = useState(false);
  const currentVideo = videos[currentVideoIndex];

  // Réinitialiser le chargement lorsque la vidéo change
  useEffect(() => {
    setIsLoading(true);
    // Le délai est de 1.5 secondes (1500ms)
    const timer = setTimeout(() => setIsLoading(false), 1500);
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

  // Gérer le chargement de l'image TV
  const handleTVImageLoad = () => {
    setTVLoaded(true);
    console.log("Image TV chargée");
  };

  const originParam = typeof window !== 'undefined' ? `&origin=${encodeURIComponent(window.location.origin)}` : '';

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
          <div className="absolute overflow-hidden" style={screenPositionStyle}>
            {/* Lecteur YouTube - Positionné pour permettre l'interaction avec z-index inférieur à l'animation */}
            <div className={`absolute inset-0 w-full h-full z-20 ${tvLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&controls=1&showinfo=0&rel=0&modestbranding=1${originParam}`}
                title={currentVideo.title}
                loading="lazy"
                allow="autoplay; picture-in-picture; encrypted-media"
                sandbox="allow-scripts allow-same-origin allow-presentation"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
            
            {/* Animation de chargement - Masquée par le conteneur parent avec overflow-hidden */}
            {isLoading && (
              <div className={`absolute inset-0 w-full h-full bg-black flex items-center justify-center z-30 ${tvLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                <div className="absolute inset-0 w-[150%] h-[150%] opacity-30" style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22a%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23a)%22/%3E%3C/svg%3E")',
                  animation: 'noise 0.2s infinite',
                  top: '-25%',
                  left: '-25%'
                }}>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm font-mono z-40">
                  Chargement...
                </div>
              </div>
            )}
          </div>
          
          {/* Image de la TV - Utilise un clip-path pour permettre l'interaction avec le lecteur */}
          <div className="absolute inset-0 w-full h-full z-40 pointer-events-none">
            <img 
              src="/lovable-uploads/74a3fc95-3585-4ec5-83d9-080e4dffabb7.png" 
              alt="TV Frame" 
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              onLoad={handleTVImageLoad}
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
