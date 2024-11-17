// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMembership } from '@/utils/api';
import { AuthContextType } from '@/types';
import { useClientStore } from '@/stores/clientStore';


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
  const fetch = useClientStore(state => state.fetch);
  const clearClientStore = useClientStore(state => state.clear); // Move this up

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const membershipId = localStorage.getItem('membershipId');
      if (membershipId) {
        try {
          await getMembership(membershipId);
          setIsAuthenticated(true);
          // Fetch client data immediately after confirming auth
          await fetch();
        } catch (error) {
          localStorage.removeItem('membershipId');
          clearClientStore();
          navigate('/client-login', { replace: true }); // Changed from /login
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, fetch, clearClientStore]);

  const login = async (membershipId: string) => {
    try {
      const response = await getMembership(membershipId);
      
      if (!response.data?.membership?.active) {
        throw new Error('This membership is not active');
      }

      localStorage.setItem('membershipId', membershipId);
      await fetch();
      setIsAuthenticated(true);
      navigate('/', { replace: true });
    } catch (error) {
      // Don't navigate on error, just throw it to be handled by Login component
      throw new Error(error instanceof Error ? error.message : 'Invalid membership ID');
    }
  };

  const logout = () => {
    localStorage.removeItem('membershipId');
    setIsAuthenticated(false);
    clearClientStore(); // Clear the store on logout
    navigate('/client-login', { replace: true }); // Changed from /login
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