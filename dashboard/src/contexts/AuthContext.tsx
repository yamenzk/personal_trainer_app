// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMembership } from '../utils/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (membershipId: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const membershipId = localStorage.getItem('membershipId');
    if (membershipId) {
      setIsAuthenticated(true);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const login = async (membershipId: string) => {
    try {
      await getMembership(membershipId); // Verify membership
      localStorage.setItem('membershipId', membershipId);
      setIsAuthenticated(true);
      navigate('/', { replace: true });
    } catch (error) {
      throw new Error('Invalid membership ID');
    }
  };

  const logout = () => {
    localStorage.removeItem('membershipId');
    localStorage.removeItem('clientId');
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};