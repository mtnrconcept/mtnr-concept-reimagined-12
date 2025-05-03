
// Liste des ressources à précharger
const resources = {
  videos: [
    "/lovable-uploads/videonormale.mp4",
    "/lovable-uploads/videouv.mp4"
  ],
  images: [
    "/lovable-uploads/07c10d93-651e-4ab2-a2d1-66268cbb231b.png",
    "/lovable-uploads/211284ce-8851-4248-8f65-0ea7e3c0c8ff.png",
    "/lovable-uploads/47-473376_splash-by-highpoweredart-on-black-paint-splash-png.png",
    "/lovable-uploads/51d0caf2-88c4-425d-8751-e697fb315c42.png",
    "/lovable-uploads/5688334d-9fa2-4439-9453-5a5b9cde0c81.png",
    "/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png",
    "/lovable-uploads/5e71b343-84de-46de-ab26-ad53863f8f6f.png",
    "/lovable-uploads/62a9a9d9-c7b1-4cce-b401-180c42e9a514.png",
    "/lovable-uploads/6d9c5bde7a1a980174b6d555586ff1b0.png",
    "/lovable-uploads/7eefa948-da3a-4bfd-8b4b-e19299caaa22.png",
    "/lovable-uploads/abe06f9b-f700-4a49-a4d8-b4d68c473e70.png",
    "/lovable-uploads/c0a483ca-deba-4667-a277-1e85c6960e36.png",
    "/lovable-uploads/c51ac031-c85b-42b2-8d7d-b14f16692636.png",
    "/lovable-uploads/d5371d86-1927-4507-9da6-d2ee46d0d577.png",
    "/lovable-uploads/ed3157a2-e211-4f4e-87c4-f3976efe1025.png",
    "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png",
    "/lovable-uploads/ff5c872a-d737-47fe-a427-a31849cceac3.png",
    "/lovable-uploads/paint-splatter-hi.png",
    "/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png",
    "/lovable-uploads/tv.png",
    "/lovable-uploads/yellow-watercolor-splatter-3.png",
    "/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png",
  ]
};

// Précharger une image
const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => {
      console.warn(`Échec du préchargement de l'image: ${url}`);
      resolve(); // On résout quand même pour ne pas bloquer le processus
    };
    img.src = url;
  });
};

// Précharger une vidéo
const preloadVideo = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    
    let loaded = false;
    
    // On considère qu'une vidéo est préchargée quand suffisamment de données sont disponibles
    video.oncanplaythrough = () => {
      if (!loaded) {
        loaded = true;
        resolve();
      }
    };
    
    video.onerror = () => {
      console.warn(`Échec du préchargement de la vidéo: ${url}`);
      resolve(); // On résout quand même pour ne pas bloquer le processus
    };
    
    // Timeout pour éviter d'attendre trop longtemps
    setTimeout(() => {
      if (!loaded) {
        loaded = true;
        console.warn(`Timeout du préchargement pour: ${url}`);
        resolve();
      }
    }, 10000); // 10 secondes maximum par vidéo
    
    video.src = url;
    video.load();
  });
};

// Fonction principale pour précharger toutes les ressources
export const preloadAllResources = async (): Promise<void> => {
  console.log("Démarrage du préchargement des ressources...");
  
  try {
    // Précharger les vidéos (prioritaire)
    const videoPromises = resources.videos.map(preloadVideo);
    await Promise.all(videoPromises);
    console.log("Vidéos préchargées avec succès");
    
    // Précharger les images
    const imagePromises = resources.images.map(preloadImage);
    await Promise.all(imagePromises);
    console.log("Images préchargées avec succès");
    
    console.log("Toutes les ressources ont été préchargées!");
  } catch (error) {
    console.error("Erreur lors du préchargement des ressources:", error);
  }
};

// Précharger les routes pour React Router
export const preloadRoutes = async (): Promise<void> => {
  try {
    // Importer dynamiquement les composants de page principaux
    await Promise.all([
      import('../pages/Home'),
      import('../pages/WhatWeDo'),
      import('../pages/Artists'),
      import('../pages/Contact'),
      import('../pages/Book'),
      import('../pages/NotFound')
    ]);
    console.log("Composants de route préchargés");
  } catch (error) {
    console.error("Erreur lors du préchargement des routes:", error);
  }
};

// Précharger les principaux composants UI
export const preloadUI = async (): Promise<void> => {
  try {
    await Promise.all([
      import('../components/Navbar'),
      import('../components/effects/ParticleEffect'),
      import('../components/effects/TorchToggle'),
      import('../components/effects/BackgroundVideo'),
      import('../components/ParallaxScene')
    ]);
    console.log("Composants UI principaux préchargés");
  } catch (error) {
    console.error("Erreur lors du préchargement des composants UI:", error);
  }
};

// Fonction globale de préchargement
export const initializePreloader = async (): Promise<void> => {
  try {
    // Précharger les routes et l'UI en parallèle
    await Promise.all([
      preloadRoutes(),
      preloadUI()
    ]);
    
    // Précharger ensuite les ressources média (peut prendre plus de temps)
    await preloadAllResources();
    
    // Créer et attacher un gestionnaire d'événements pour précharger
    // les pages lors des hover sur les liens de navigation
    document.addEventListener('DOMContentLoaded', () => {
      attachNavigationPreloading();
    });
    
    console.log("Préchargement initial terminé");
  } catch (error) {
    console.error("Erreur lors de l'initialisation du préchargement:", error);
  }
};

// Attacher des listeners pour précharger les pages au survol des liens
const attachNavigationPreloading = () => {
  const navLinks = document.querySelectorAll('a[href^="/"]');
  
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('/')) {
        // Précharger la page au survol
        const route = href.substring(1) || 'home';
        import(`../pages/${route.charAt(0).toUpperCase() + route.slice(1)}`)
          .catch(() => console.log(`Préchargement de ${route} non nécessaire ou impossible`));
      }
    });
  });
};
