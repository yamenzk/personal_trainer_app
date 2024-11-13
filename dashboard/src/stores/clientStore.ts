import { create } from 'zustand';
import { getMembership } from '@/utils/api';
import { Client, Plan, Membership, References } from '@/types';

interface ClientState {
  client: Client | null;
  membership: Membership | null;
  plans: Plan[];
  references: References | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetch: () => Promise<void>;
  clear: () => void;
  needsRefresh: () => boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useClientStore = create<ClientState>((set, get) => ({
  client: null,
  membership: null,
  plans: [],
  references: null,
  isLoading: false,
  error: null,
  lastFetched: null,

  fetch: async () => {
    const state = get();
    const now = Date.now();
    const membershipId = localStorage.getItem('membershipId');

    // Add early return if already loading
    if (state.isLoading) return;

    if (!membershipId) {
      set({ error: 'No membership ID found' });
      return;
    }

    // Improve cache check
    if (state.client && state.lastFetched && (now - state.lastFetched < CACHE_DURATION)) {
      if (!state.error) return; // Only return if there's no error
    }

    set({ isLoading: true, error: null });

    try {
      const response = await getMembership(membershipId);
      
      // Add validation check
      if (!response?.data) {
        throw new Error('Invalid response data');
      }

      if (!response.data?.membership?.active) {
        localStorage.removeItem('membershipId');
        set({ 
          client: null,
          membership: null,
          plans: [],
          references: null,
          lastFetched: null,
          error: 'Membership is not active'
        });
        return;
      }

      // Use separate state updates to reduce re-renders
      set((state) => ({
        ...state,
        client: response.data.client,
        membership: response.data.membership,
        plans: response.data.plans,
        references: response.data.references,
        lastFetched: now,
        error: null
      }));

    } catch (err) {
      localStorage.removeItem('membershipId');
      set({ 
        client: null,
        membership: null,
        plans: [],
        references: null,
        lastFetched: null,
        error: err instanceof Error ? err.message : 'An error occurred'
      });
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },

  clear: () => {
    set({
      client: null,
      membership: null,
      plans: [],
      references: null,
      isLoading: false,
      error: null,
      lastFetched: null
    });
  },

  needsRefresh: () => {
    const state = get();
    const now = Date.now();
    return !state.client || !state.lastFetched || (now - state.lastFetched >= CACHE_DURATION);
  },
}));
