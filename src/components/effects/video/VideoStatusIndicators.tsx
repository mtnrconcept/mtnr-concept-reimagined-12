
import React from 'react';

interface VideoStatusIndicatorsProps {
  loadingStatus: 'loading' | 'ready' | 'waiting' | 'error';
  videoError: boolean;
  isTransitioning: boolean;
}

const VideoStatusIndicators: React.FC<VideoStatusIndicatorsProps> = ({
  loadingStatus,
  videoError,
  isTransitioning
}) => {
  return (
    <>
      {loadingStatus === 'loading' && !videoError && (
        <div className="absolute top-0 left-0 bg-yellow-500 text-xs text-black px-2 py-0.5 opacity-70 z-50">
          Chargement vidéo...
        </div>
      )}
      {loadingStatus === 'waiting' && !videoError && (
        <div className="absolute top-0 left-0 bg-yellow-500 text-xs text-black px-2 py-0.5 opacity-70 z-50">
          Mise en mémoire tampon...
        </div>
      )}
      {videoError && (
        <div className="absolute top-0 left-0 bg-red-500 text-xs text-white px-2 py-0.5 opacity-70 z-50">
          Erreur vidéo
        </div>
      )}
      {isTransitioning && (
        <div className="absolute top-0 left-0 bg-blue-500 text-xs text-white px-2 py-0.5 opacity-70 z-50">
          Transition de page
        </div>
      )}
    </>
  );
};

export default VideoStatusIndicators;
