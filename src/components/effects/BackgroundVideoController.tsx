
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const BackgroundVideoController = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialiser le préchargement une seule fois
    const videoUrls = [
      '/lovable-uploads/Composition_1.mp4',
      '/lovable-uploads/Composition_1_1.mp4'
    ];
    
    console.info('Initialisation du préchargement des vidéos');
    
    // Utiliser fetch pour précharger plutôt que des éléments vidéo
    // pour éviter les erreurs d'interruption de lecture
    const preloadVideo = async (url) => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          console.info(`Métadonnées vidéo vérifiées pour ${url}`);
        } else {
          console.error(`Échec de vérification de ${url} - statut: ${response.status}`);
        }
      } catch (err) {
        console.error(`Erreur lors de la vérification de ${url}:`, err);
      }
    };
    
    // Préchargement séquentiel pour éviter les requêtes simultanées
    const preloadSequentially = async () => {
      for (const url of videoUrls) {
        await preloadVideo(url);
      }
    };
    
    preloadSequentially();
    
    return () => {
      // Nettoyage si nécessaire
      console.info('Nettoyage du contrôleur vidéo');
    };
  }, []); // Dépendance vide pour exécuter une seule fois au montage

  // Composant invisible qui gère uniquement le préchargement
  return null;
};

export default BackgroundVideoController;
