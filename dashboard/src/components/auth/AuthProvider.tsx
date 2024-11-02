// src/components/auth/AuthProvider.tsx
import { FC, ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { getStepsForMode } from '@/components/wizard/steps';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const refreshData = useAuthStore(state => state.refreshData);
  const client = useAuthStore(state => state.client);
  const setRequiresOnboarding = useAuthStore(state => state.setRequiresOnboarding);
  const setRequiresWeightUpdate = useAuthStore(state => state.setRequiresWeightUpdate);

  // Handle data refresh
  useEffect(() => {
    const initializeData = async () => {
      await refreshData();
    };

    initializeData();
    const interval = setInterval(refreshData, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [refreshData]);

  // Handle requirement checks
  useEffect(() => {
    if (!client) return;

    const missingFields = getStepsForMode('onboarding', undefined, client);
    
    // Set onboarding requirement
    if (missingFields && missingFields.length > 0) {
      setRequiresOnboarding(true);
    }

    // Set weight update requirement
    if (client.request_weight === 1) {
      setRequiresWeightUpdate(true);
    }
  }, [client, setRequiresOnboarding, setRequiresWeightUpdate]);

  return <>{children}</>;
};