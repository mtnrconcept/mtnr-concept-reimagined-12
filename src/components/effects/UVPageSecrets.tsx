
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTorch } from './TorchContext';
import { useUVMode } from './UVModeContext';

// Import page-specific secret components
import HomePageSecrets from './secrets/HomePageSecrets';
import ArtistsPageSecrets from './secrets/ArtistsPageSecrets';
import ContactPageSecrets from './secrets/ContactPageSecrets';
import WhatWeDoPageSecrets from './secrets/WhatWeDoPageSecrets';
import BookPageSecrets from './secrets/BookPageSecrets';
import NotFoundPageSecrets from './secrets/NotFoundPageSecrets';

export default function UVPageSecrets() {
  const location = useLocation();
  const { isTorchActive } = useTorch();
  const { uvMode } = useUVMode();
  
  // Only log when the component actually tries to render page-specific content
  const path = location.pathname;
  
  // Prepare content based on path, but don't return early
  let PageSecretsComponent = null;

  // Select the appropriate component based on current path
  if (uvMode && isTorchActive) {
    console.log("UVPageSecrets: current path is", path);
    
    switch (path) {
      case '/':
        PageSecretsComponent = HomePageSecrets;
        break;
        
      case '/artists':
        PageSecretsComponent = ArtistsPageSecrets;
        break;
        
      case '/contact':
        PageSecretsComponent = ContactPageSecrets;
        break;
        
      case '/what-we-do':
        console.log("Rendering WhatWeDoPageSecrets");
        PageSecretsComponent = WhatWeDoPageSecrets;
        break;
        
      case '/book':
        PageSecretsComponent = BookPageSecrets;
        break;
        
      default:
        // Handle 404 and unknown paths
        if (path.includes('404')) {
          PageSecretsComponent = NotFoundPageSecrets;
        } else {
          console.log("No secrets for path:", path);
        }
    }
  }
  
  // If no component selected or conditions not met, return empty div to maintain consistent component structure
  if (PageSecretsComponent === null) {
    return <div id="no-uv-secrets" className="hidden"></div>;
  }
  
  // Render the selected component
  return <PageSecretsComponent />;
}
