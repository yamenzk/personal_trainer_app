// src/components/ui/route-transition.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const RouteTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut');
    }
  }, [location, displayLocation]);

  const handleAnimationEnd = () => {
    if (transitionStage === 'fadeOut') {
      setTransitionStage('fadeIn');
      setDisplayLocation(location);
    }
  };

  return (
    <div
      className={`${
        transitionStage === 'fadeIn' ? 'animate-fade-in' : 'opacity-0'
      } transition-opacity duration-200`}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
};