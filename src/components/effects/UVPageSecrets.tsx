
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
  
  // Ne rien afficher si le mode UV n'est pas activé
  if (!uvMode || !isTorchActive) return null;
  
  // Render page-specific secrets based on the current route
  switch (location.pathname) {
    case '/':
      return <HomePageSecrets />;
      
    case '/artists':
      return <ArtistsPageSecrets />;
      
    case '/contact':
      return <ContactPageSecrets />;
      
    case '/what-we-do':
      return <WhatWeDoPageSecrets />;
      
    case '/book':
      return <BookPageSecrets />;
      
    case '/404':
    default:
      // Handle 404 and unknown paths
      if (location.pathname === '/404' || location.pathname.includes('*')) {
        return <NotFoundPageSecrets />;
      }
      return null;
  }
}
