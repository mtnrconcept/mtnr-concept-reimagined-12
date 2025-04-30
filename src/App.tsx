
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import About from './pages/About';
import WhatWeDo from './pages/WhatWeDo';
import Artists from './pages/Artists';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Book from './pages/Book';
import NotFound from './pages/NotFound';
import { TorchProvider, TorchControls } from './components/effects/TorchSystem';
import { Toaster } from './components/ui/toaster';
import './styles/flashlight.css';

function App() {
  return (
    <Router>
      <TorchProvider>
        <Routes>
          {[
            { path: '/', element: <Home />, key: 'home' },
            { path: '/about', element: <About />, key: 'about' },
            { path: '/what-we-do', element: <WhatWeDo />, key: 'what-we-do' },
            { path: '/artists', element: <Artists />, key: 'artists' },
            { path: '/portfolio', element: <Portfolio />, key: 'portfolio' },
            { path: '/services', element: <Services />, key: 'services' },
            { path: '/contact', element: <Contact />, key: 'contact' },
            { path: '/book', element: <Book />, key: 'book' },
            { path: '*', element: <NotFound />, key: 'not-found' },
          ].map((route) => (
            <Route
              key={route.key}
              path={route.path}
              element={
                <PageTransition keyId={route.key}>
                  {route.element}
                </PageTransition>
              }
            />
          ))}
        </Routes>
        
        {/* Torch Controls UI */}
        <TorchControls />
        
        {/* Toast notifications */}
        <Toaster />
      </TorchProvider>
    </Router>
  );
}

export default App;
