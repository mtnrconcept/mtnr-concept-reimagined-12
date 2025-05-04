
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
  
  // Ne rien afficher si le mode UV n'est pas activé ou si la torche est désactivée
  if (!uvMode || !isTorchActive) return null;
  
  // Render page-specific secrets based on the current route
  const path = location.pathname;
  
  // Ajouter un log pour voir quel chemin est actuellement actif
  console.log("UVPageSecrets: current path is", path);
  
  // Render page-specific secrets based on the current route
  switch (path) {
    case '/':
      return <HomePageSecrets />;
      
    case '/artists':
      return <ArtistsPageSecrets />;
      
    case '/contact':
      return <ContactPageSecrets />;
      
    case '/what-we-do':
      console.log("Rendering WhatWeDoPageSecrets");
      return <WhatWeDoPageSecrets />;
      
    case '/book':
      return <BookPageSecrets />;
      
    default:
      // Handle 404 and unknown paths
      if (path.includes('404')) {
        return <NotFoundPageSecrets />;
      }
      console.log("No secrets for path:", path);
      return null;
  }
}
