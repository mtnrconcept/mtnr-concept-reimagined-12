
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
    <div className="relative max-w-4xl mx-auto my-16">
      {/* TV Frame */}
      <div className="relative w-full aspect-video">
        {/* TV Border */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-black rounded-xl border-8 border-zinc-800 shadow-2xl overflow-hidden">
          {/* TV Screen with static effect */}
          <div className="absolute inset-4 bg-black rounded overflow-hidden">
            {/* Loading static */}
            {isLoading && (
              <div className="absolute inset-0 bg-black flex items-center justify-center">
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
            
            {/* Video Player */}
            <div className="relative w-full h-full overflow-hidden">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=0&controls=0&showinfo=0&rel=0&modestbranding=1`}
                title={currentVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          
          {/* TV Controls (buttons on bottom) */}
          <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-zinc-800 px-4 py-2 rounded-full border-2 border-zinc-700">
            <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
            <div className="w-4 h-4 rounded-full bg-zinc-600"></div>
            <div className="w-2 h-7 rounded-full bg-zinc-600"></div>
          </div>

          {/* TV Antenna */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-1 h-10 bg-zinc-500 flex items-start justify-center">
            <div className="w-8 h-1 bg-zinc-500 rotate-45"></div>
            <div className="w-8 h-1 bg-zinc-500 -rotate-45"></div>
          </div>
          
          {/* TV Glow Effect */}
          <div className="absolute -inset-4 bg-yellow-500/10 blur-xl opacity-50 pointer-events-none"></div>
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
