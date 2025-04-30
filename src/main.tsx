
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { disableSentryRequests } from './lib/sentry-disable';

// Désactiver les requêtes Sentry inutiles qui causent des erreurs 429
disableSentryRequests();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);
