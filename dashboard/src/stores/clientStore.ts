import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMembership, getMembershipVersion } from '@/utils/api';
import { Client, Plan, Membership, References } from '@/types';
import debounce from 'lodash/debounce';
import { DebouncedFunc } from 'lodash';

interface ClientState {
  client: Client | null;
  membership: Membership | null;
  plans: Plan[];
  references: References | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  isInitialized: boolean;
  fetch: (force?: boolean) => Promise<void>;
  clear: () => void;
  needsRefresh: () => boolean;
  mediaCache: {
    images: Record<string, string>;
    videos: Record<string, string>;
  };
  preloadImages: (urls: string[]) => Promise<void>;
  clearMediaCache: () => void;
  version: string | null;
  offlineMode: boolean;
  checkVersion: DebouncedFunc<() => Promise<boolean>>;
  initializeOfflineData: () => Promise<void>;
  setOfflineMode: (status: boolean) => void;
  isPrepared: boolean;
  contentState: 'initializing' | 'loading' | 'ready' | 'error';
  setContentState: (state: 'initializing' | 'loading' | 'ready' | 'error') => void;
  refetchData: () => Promise<void>;
  refreshIfNeeded: () => Promise<void>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const IMAGE_CACHE_LIMIT = 100;

export const useClientStore = create<ClientState>()(
  persist(
    (set, get) => ({
      client: null,
      membership: null,
      plans: [],
      references: null,
      isLoading: false,
      error: null,
      lastFetched: null,
      isInitialized: false,
      mediaCache: {
        images: {},
        videos: {}
      },
      version: null,
      offlineMode: false,
      isPrepared: false,
      contentState: 'initializing',
      setContentState: (state) => set({ contentState: state }),

      preloadImages: async (urls: string[]) => {
        set({ contentState: 'loading' });
        const state = get();
        const newImages = { ...state.mediaCache.images };
        
        if (!urls || !Array.isArray(urls)) {
          set({ contentState: 'ready' });
          return;
        }
        
        try {
          // First, filter out already cached images
          const uncachedUrls = urls.filter(url => !newImages[url]);
          
          if (uncachedUrls.length === 0) {
            set({ contentState: 'ready' });
            return;
          }

          await Promise.all(
            uncachedUrls.map(url => {
              return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                  if (img.width > 0) {
                    newImages[url] = url;
                  }
                  resolve(url);
                };
                img.onerror = reject;
                img.src = url;
              });
            })
          );
          
          set(state => ({
            mediaCache: {
              ...state.mediaCache,
              images: newImages
            },
            isPrepared: true,
            contentState: 'ready'
          }));
        } catch (err) {
          console.warn('Failed to preload some images:', err);
          set({ 
            isPrepared: true,
            contentState: 'ready'
          });
        }
      },
      
      clearMediaCache: () => {
        set(state => ({
          mediaCache: { images: {}, videos: {} },
          contentState: 'loading'
        }));
      },

      checkVersion: debounce(async () => {
        try {
          const membershipId = localStorage.getItem('membershipId');
          if (!membershipId) return false;

          const { version } = await getMembershipVersion(membershipId);
          const currentVersion = get().version;
          
          const needsUpdate = version !== currentVersion;
          console.log('Version check:', { server: version, current: currentVersion, needsUpdate });
          return needsUpdate;
        } catch (err) {
          console.error('Version check failed:', err);
          if (get().client) {
            set({ offlineMode: true });
          }
          return false;
        }
      }, 1000), // 1 second debounce

      setOfflineMode: (status: boolean) => {
        set({ offlineMode: status });
      },

      refetchData: async () => {
        await get().fetch(true);
      },

      refreshIfNeeded: async () => {
        try {
          const needsUpdate = await get().checkVersion();
          console.log('Refresh check:', { needsUpdate });
          if (needsUpdate) {
            await get().fetch(true);
          }
        } catch (err) {
          console.error('Refresh check failed:', err);
          if (!navigator.onLine && get().client) {
            set({ offlineMode: true });
          }
        }
      },

      fetch: async (force = false) => {
        const state = get();
        
        // Return early if network is offline
        if (!navigator.onLine) {
          set({ offlineMode: true });
          return;
        }

        const membershipId = localStorage.getItem('membershipId');

        if (!membershipId) {
          set({ error: 'No membership ID found' });
          return;
        }

        // Remove duplicate version check here since we already did it above
        if (state.isLoading) return;

        set({ isLoading: true, error: null, contentState: 'loading' });

        try {
          const response = await getMembership(membershipId);
          
          if (!response?.data) {
            throw new Error('Invalid response data');
          }

          // Set version before other checks to ensure it's always updated
          const newVersion = response.data.version;
          
          if (!response.data?.membership?.active) {
            localStorage.removeItem('membershipId');
            set({ 
              client: null,
              membership: null,
              plans: [],
              references: null,
              lastFetched: null,
              version: newVersion, // Set version even on failure
              error: 'Membership is not active',
              isInitialized: true,
              offlineMode: false
            });
            return;
          }

          const imageUrls = new Set<string>();
          
          Object.values(response.data.references?.exercises || {}).forEach(exercise => {
            if (exercise?.thumbnail) imageUrls.add(exercise.thumbnail);
            if (exercise?.starting) imageUrls.add(exercise.starting);
            if (exercise?.ending) imageUrls.add(exercise.ending);
          });

          const mediaCache = {
            images: {} as Record<string, string>,
            videos: {} as Record<string, string>
          };

          await Promise.all(
            Array.from(imageUrls).map(async (url) => {
              try {
                const img = new Image();
                await new Promise((resolve, reject) => {
                  img.onload = resolve;
                  img.onerror = reject;
                  img.src = url;
                });
                mediaCache.images[url] = url;
              } catch (err) {
                console.warn(`Failed to preload image: ${url}`);
              }
            })
          );

          set({
            client: response.data.client,
            membership: response.data.membership,
            plans: response.data.plans,
            references: response.data.references,
            lastFetched: Date.now(),
            version: newVersion, // Ensure version is set here
            error: null,
            isInitialized: true,
            offlineMode: false,
            mediaCache,
            contentState: 'ready'
          });

        } catch (err) {
          console.error('Fetch error:', err);
          if (state.client) {
            set({ offlineMode: true, isLoading: false });
            return;
          }
          
          localStorage.removeItem('membershipId');
          set({ 
            client: null,
            membership: null,
            plans: [],
            references: null,
            lastFetched: null,
            version: null, // Reset version on complete failure
            isInitialized: true,
            offlineMode: false,
            error: err instanceof Error ? err.message : 'An error occurred',
            contentState: 'error'
          });
        } finally {
          set({ isLoading: false });
        }
      },

      initializeOfflineData: async () => {
        const state = get();
        if (!state.client) return;

        try {
          const isLatest = await state.checkVersion();
          if (!isLatest) {
            await state.fetch(true);
          }
          set({ offlineMode: false });
        } catch (err) {
          set({ offlineMode: true });
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
          lastFetched: null,
          mediaCache: {
            images: {},
            videos: {}
          }
        });
      },

      needsRefresh: () => {
        const state = get();
        const now = Date.now();
        return !state.client || !state.lastFetched || (now - state.lastFetched >= CACHE_DURATION);
      },
    }),
    {
      name: 'client-storage',
      partialize: (state) => ({
        client: state.client,
        membership: state.membership,
        plans: state.plans,
        references: state.references,
        version: state.version, // Ensure version is included in persistence
        lastFetched: state.lastFetched,
        offlineMode: state.offlineMode,
        isPrepared: false,
        contentState: 'initializing',
      }),
    }
  )
);

// Export a standalone function for easy access
export const refetchClientData = () => useClientStore.getState().refetchData();
