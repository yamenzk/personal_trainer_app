// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMembership } from '../utils/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (membershipId: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const membershipId = localStorage.getItem('membershipId');
      if (membershipId) {
        try {
          await getMembership(membershipId);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('membershipId');
          navigate('/login', { replace: true });
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const login = async (membershipId: string) => {
    try {
      await getMembership(membershipId);
      localStorage.setItem('membershipId', membershipId);
      setIsAuthenticated(true);
      navigate('/', { replace: true });
    } catch (error) {
      throw new Error('Invalid membership ID');
    }
  };

  const logout = () => {
    localStorage.removeItem('membershipId');
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          </div>
          <div className="text-foreground/60 font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};