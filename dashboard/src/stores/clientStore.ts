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

    if (!membershipId) {
      set({ error: 'No membership ID found' });
      return;
    }

    // Return cached data if it's still fresh
    if (state.client && state.lastFetched && (now - state.lastFetched < CACHE_DURATION)) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await getMembership(membershipId);
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

      set({
        client: response.data.client,
        membership: response.data.membership,
        plans: response.data.plans,
        references: response.data.references,
        lastFetched: now
      });
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
      set({ isLoading: false });
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
