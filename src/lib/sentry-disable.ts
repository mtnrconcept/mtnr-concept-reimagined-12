
/**
 * Ce fichier désactive les requêtes Sentry inutiles qui génèrent des erreurs 429
 */

// Fonction pour désactiver Sentry au chargement de la page
export function disableSentryRequests() {
  if (typeof window !== 'undefined') {
    // Intercepte les requêtes à Sentry pour éviter les erreurs 429
    const originalFetch = window.fetch;
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      const url = input.toString();
      
      // Si c'est une requête Sentry, on l'intercepte et on retourne une promesse résolue
      if (url.includes('sentry.io') || url.includes('ingest.sentry.io')) {
        console.log('Requête Sentry interceptée et bloquée:', url);
        return Promise.resolve(new Response('{}', { status: 200 }));
      }
      
      // Sinon on laisse passer la requête normalement
      return originalFetch.apply(this, [input, init]);
    };
    
    console.log('Intercepteur Sentry activé pour bloquer les requêtes inutiles');
  }
}
