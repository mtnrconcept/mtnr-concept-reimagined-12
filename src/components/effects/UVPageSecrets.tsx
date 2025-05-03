
import React, { useEffect } from 'react';
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
  
  // Ajout d'un effet pour forcer le rendu des secrets
  useEffect(() => {
    // Log les états pour débogage
    console.log("UVPageSecrets mounted: uvMode:", uvMode, "isTorchActive:", isTorchActive);
    
    // Ajouter une classe au body pour faciliter le ciblage CSS des éléments UV
    if (uvMode && isTorchActive) {
      document.body.classList.add('uv-secrets-visible');
    } else {
      document.body.classList.remove('uv-secrets-visible');
    }
    
    return () => {
      document.body.classList.remove('uv-secrets-visible');
    };
  }, [uvMode, isTorchActive]);
  
  // Ne rien afficher si le mode UV n'est pas activé ou si la torche est désactivée
  if (!uvMode || !isTorchActive) return null;
  
  // Render page-specific secrets based on the current route
  const path = location.pathname;
  
  // Ajouter un log pour voir quel chemin est actuellement actif
  console.log("UVPageSecrets: current path is", path);
  
  // Créer un conteneur pour tous les secrets
  const renderSecrets = () => {
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
  };
  
  return (
    <div id="uv-page-secrets-container" className="uv-secrets-container">
      {renderSecrets()}
    </div>
  );
}
