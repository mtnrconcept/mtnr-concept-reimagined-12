
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import ElevatorTransition from '@/components/effects/ElevatorTransition';
import Home from '@/pages/Home';
import About from '@/pages/About';
import { NavigationProvider } from '@/components/effects/NavigationContext';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [nextPath, setNextPath] = useState<string>(location.pathname);
  const [transitioning, setTransitioning] = useState(false);

  // Déclenche la transition puis change de route
  const handleNavigate = (path: string) => {
    setNextPath(path);
    setTransitioning(true);
    setTimeout(() => {
      navigate(path);
    }, 7000);
  };

  // Quand la transition est finie, on arrête le mode transitioning
  const onAnimationComplete = () => {
    setTransitioning(false);
  };

  // Déterminer quel contenu afficher
  const CurrentPage = location.pathname === '/about' ? About : Home;
  const NextPage    = nextPath === '/about' ? About : Home;

  return (
    <>
      <button onClick={() => handleNavigate('/')}>Accueil</button>
      <button onClick={() => handleNavigate('/about')}>À propos</button>

      <ElevatorTransition
        current={<CurrentPage />}
        next={<NextPage />}
        isActive={transitioning}
        onAnimationComplete={onAnimationComplete}
      />
    </>
  );
};

export default function App() {
  return (
    <NavigationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<AnimatedRoutes />}/>
        </Routes>
      </BrowserRouter>
    </NavigationProvider>
  );
}
