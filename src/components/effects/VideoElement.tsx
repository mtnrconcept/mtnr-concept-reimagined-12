
import React, { forwardRef } from 'react';

interface VideoElementProps {
  className: string;
  src: string;
  onLoadedData?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
}

const VideoElement = forwardRef<HTMLVideoElement, VideoElementProps>(({
  className,
  src,
  onLoadedData,
  onError
}, ref) => {
  return (
    <video
      ref={ref}
      className={className}
      playsInline
      muted
      preload="auto"
      onLoadedData={onLoadedData}
      onError={onError}
    >
      <source src={src} type="video/mp4" />
      Votre navigateur ne prend pas en charge les vidéos HTML5.
    </video>
  );
});

VideoElement.displayName = 'VideoElement';

export default VideoElement;
