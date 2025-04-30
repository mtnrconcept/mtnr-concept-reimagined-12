
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './styles/elevator.css'
import './styles/elevator/repetile.css'
import './styles/parallax.css'

// Make sure React is available in the global scope for hooks
window.React = React;

// Temporarily removed StrictMode to prevent double rendering during development
ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
