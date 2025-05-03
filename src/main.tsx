
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './styles/elevator.css'
import './styles/flashlight.css'

// Make sure React is available in the global scope for hooks
window.React = React;

// Ajout de CSS spécifique pour l'écran de chargement
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
  body {
    margin: 0;
    padding: 0;
    background-color: black;
  }
  #root {
    height: 100vh;
  }
`;
document.head.appendChild(loadingStyles);

// Créer un écran de chargement minimaliste avant même que React ne soit monté
const initialLoadingScreen = document.createElement('div');
initialLoadingScreen.id = 'initial-loading';
initialLoadingScreen.style.cssText = `
  position: fixed;
  inset: 0;
  background-color: black;
  color: #eab308;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  font-family: sans-serif;
`;
initialLoadingScreen.innerHTML = `
  <div style="text-align: center;">
    <h1 style="font-size: 2rem; margin-bottom: 1rem;">MTNR</h1>
    <p style="color: #888;">Chargement de l'interface...</p>
  </div>
`;

// Ajouter l'écran de chargement initial au DOM
document.body.appendChild(initialLoadingScreen);

// Fonction pour retirer l'écran de chargement initial une fois que React est monté
const removeInitialLoading = () => {
  const el = document.getElementById('initial-loading');
  if (el) {
    // Ajouter une transition de fondu avant de supprimer
    el.style.transition = 'opacity 0.5s ease';
    el.style.opacity = '0';
    
    setTimeout(() => {
      el.remove();
    }, 500);
  }
};

// Monter l'application React
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Retirer l'écran de chargement initial une fois que React est monté
// (Ce sera remplacé par notre LoadingScreen React)
setTimeout(removeInitialLoading, 1000);
