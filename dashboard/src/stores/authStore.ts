// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginResponse, Client, Membership, Plan, References } from '@/types/api';

interface AuthState {
  client: Client | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  membership: Membership | null;
  requiresOnboarding: boolean;
  requiresWeightUpdate: boolean;
  plans: Plan[];
  references: References | null;
  
  
  login: (data: LoginResponse['data']) => void;
  logout: () => void;
  refreshData: () => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;  // Added this function
  setLoading: (isLoading: boolean) => void;
  setRequiresOnboarding: (requires: boolean) => void;
  setRequiresWeightUpdate: (requires: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: true,
      error: null,
      membership: null,
      requiresOnboarding: false,
      requiresWeightUpdate: false,
      client: null,
      plans: [],
      references: null,

      login: (data) => {
        set({
          isAuthenticated: true,
          membership: data.membership,
          client: data.client,
          plans: data.plans,
          references: data.references,
          error: null,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          membership: null,
          client: null,
          plans: [],
          references: null,
          error: null,
        });
      },

      refreshData: async () => {
        const state = get();
        if (!state.membership?.name) {
          set({ isLoading: false });
          return;
        }

        try {
          set({ isLoading: true });
          const response = await fetch(`/api/v2/method/personal_trainer_app.api.get_membership?membership=${state.membership.name}`);
          const result = await response.json();
          
          if (!response.ok || !result.data) {
            throw new Error('Failed to refresh data');
          }

          set({
            membership: result.data.membership,
            client: result.data.client,
            plans: result.data.plans,
            references: result.data.references,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: 'Failed to refresh data',
            isLoading: false
          });
        }
      },

      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),  // Added clearError implementation
      setLoading: (isLoading) => set({ isLoading }),
      setRequiresOnboarding: (requires) => set({ requiresOnboarding: requires }),
      setRequiresWeightUpdate: (requires) => set({ requiresWeightUpdate: requires }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        membership: state.membership,
      }),
    }
  )
);

// Helper hooks
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useClient = () => useAuthStore((state) => state.client);
export const useMembership = () => useAuthStore((state) => state.membership);
export const usePlans = () => useAuthStore((state) => state.plans);
export const useError = () => useAuthStore((state) => state.error);