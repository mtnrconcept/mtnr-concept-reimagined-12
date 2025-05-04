
import { useState, useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';

interface LoadingAppProps {
  children: React.ReactNode;
}

export const LoadingApp = ({ children }: LoadingAppProps) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Vérifier si c'est la première visite sur le site
  useEffect(() => {
    // Vérifier si l'utilisateur a déjà chargé le site
    const hasVisited = sessionStorage.getItem('hasVisitedSite');
    
    if (hasVisited) {
      // Si l'utilisateur a déjà visité le site, ne pas afficher l'écran de chargement
      setIsLoading(false);
    } else {
      // Marquer que l'utilisateur a visité le site
      sessionStorage.setItem('hasVisitedSite', 'true');
    }
  }, []);

  // Si le site est en cours de chargement, afficher l'écran de chargement
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // Sinon, afficher le contenu normal du site
  return <>{children}</>;
};
