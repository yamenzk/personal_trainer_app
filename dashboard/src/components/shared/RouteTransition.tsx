// src/components/shared/RouteTransition.tsx
import { AnimatePresence } from "framer-motion";
import { Routes, useLocation } from "react-router-dom";

export const RouteTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {children}
      </Routes>
    </AnimatePresence>
  );
};