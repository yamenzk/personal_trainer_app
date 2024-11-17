// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientStore } from '@/stores/clientStore';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (membershipId: string) => Promise<void>;
  logout: () => void;
  isInitialized: boolean; // Add this
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isInitialized: false,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  const { fetch, clear } = useClientStore();

  // Check authentication status on mount
  useEffect(() => {
    const init = async () => {
      const membershipId = localStorage.getItem('membershipId');
      if (membershipId) {
        try {
          await fetch();
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('membershipId');
        }
      }
      setIsInitialized(true);
    };
    init();
  }, [fetch]);

  const login = async (membershipId: string) => {
    try {
      localStorage.setItem('membershipId', membershipId);
      await fetch(true);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      localStorage.removeItem('membershipId');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('membershipId');
    setIsAuthenticated(false);
    clear();
    navigate('/client-login');
  };

  // Show nothing until auth is initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isInitialized, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);