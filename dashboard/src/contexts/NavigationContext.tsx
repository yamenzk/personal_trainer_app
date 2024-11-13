// src/contexts/NavigationContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationContextType } from '@/types';


const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  startNavigation: () => {},
  endNavigation: () => {},
  smoothNavigate: () => {},
});

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const startNavigation = useCallback(() => {
    setIsNavigating(true);
  }, []);

  const endNavigation = useCallback(() => {
    setIsNavigating(false);
  }, []);

  const smoothNavigate = useCallback((path: string) => {
    if (location.pathname === path) return;
    
    startNavigation();
    // Small delay to ensure animation starts
    requestAnimationFrame(() => {
      navigate(path);
    });
  }, [navigate, location.pathname, startNavigation]);

  return (
    <NavigationContext.Provider value={{
      isNavigating,
      startNavigation,
      endNavigation,
      smoothNavigate,
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);