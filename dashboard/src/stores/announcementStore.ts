import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getAnnouncement, getAnnouncementVersion } from '@/utils/api';

interface Announcement {
  title: string;
  description: string;
  bg_class: string;
  modified: string;
}

interface AnnouncementState {
  announcement: Announcement | null;
  version: string | null;
  isDismissed: boolean;
  isLoading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  dismiss: () => void;
  checkForUpdates: () => Promise<boolean>;
}

export const useAnnouncementStore = create<AnnouncementState>()(
  persist(
    (set, get) => ({
      announcement: null,
      version: null,
      isDismissed: false,
      isLoading: false,
      error: null,

      fetch: async () => {
        set({ isLoading: true });
        try {
          const response = await getAnnouncement();
          if (response.data) {
            const currentVersion = get().version;
            const newVersion = response.data.modified;
            
            set({
              announcement: response.data,
              version: newVersion,
              isDismissed: currentVersion === newVersion ? get().isDismissed : false,
              error: null
            });
          }
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to fetch announcement' });
        } finally {
          set({ isLoading: false });
        }
      },

      dismiss: () => {
        set({ isDismissed: true });
      },

      checkForUpdates: async () => {
        try {
          const { version } = await getAnnouncementVersion();
          const currentVersion = get().version;
          
          if (!currentVersion || version !== currentVersion) {
            await get().fetch();
            return true;
          }
          return false;
        } catch (err) {
          console.error('Failed to check announcement version:', err);
          return false;
        }
      }
    }),
    {
      name: 'announcement-storage',
      version: 1,
      partialize: (state) => ({
        announcement: state.announcement,
        version: state.version,
        isDismissed: state.isDismissed,
      }),
    }
  )
);