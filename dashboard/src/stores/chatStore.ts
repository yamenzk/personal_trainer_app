import { create } from 'zustand';
import { ChatMessage } from '@/types/api';
import * as api from '@/utils/api';

interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  send: (message: string) => Promise<void>;
  clear: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  fetch: async () => {
    const membershipId = localStorage.getItem('membershipId');
    if (!membershipId) return;

    const isInitialFetch = get().messages.length === 0;
    if (isInitialFetch) {
      set({ isLoading: true });
    }

    try {
      const response = await api.getChat(membershipId);
      set({ messages: response.data, error: null });
    } catch (error) {
      set({ error: 'Failed to load messages' });
    } finally {
      if (isInitialFetch) {
        set({ isLoading: false });
      }
    }
  },

  send: async (message: string) => {
    const membershipId = localStorage.getItem('membershipId');
    if (!membershipId) return;

    set({ isLoading: true, error: null });
    try {
      await api.sendChat(membershipId, message);
      // Refresh messages after sending
      await get().fetch();
    } catch (error) {
      set({ error: 'Failed to send message' });
    } finally {
      set({ isLoading: false });
    }
  },

  clear: () => {
    set({ messages: [], error: null });
  },
}));