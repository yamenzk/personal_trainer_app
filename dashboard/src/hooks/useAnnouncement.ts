import { useEffect, useCallback } from 'react';
import { useAnnouncementStore } from '@/stores/announcementStore';

export function useAnnouncement() {
  const { 
    announcement, 
    isDismissed,
    isLoading, 
    error, 
    fetch, 
    dismiss,
    checkForUpdates 
  } = useAnnouncementStore();

  const checkForNewAnnouncement = useCallback(async () => {
    if (document.visibilityState === 'visible') {
      await checkForUpdates();
    }
  }, [checkForUpdates]);

  useEffect(() => {
    // Initial fetch
    if (!announcement) {
      fetch();
    }

    // Set up periodic checks
    const checkInterval = setInterval(checkForNewAnnouncement, 5 * 60 * 1000); // Check every 5 minutes
    
    // Check when tab becomes visible
    document.addEventListener('visibilitychange', checkForNewAnnouncement);
    
    return () => {
      clearInterval(checkInterval);
      document.removeEventListener('visibilitychange', checkForNewAnnouncement);
    };
  }, [fetch, checkForNewAnnouncement, announcement]);

  return { 
    announcement: isDismissed ? null : announcement, 
    loading: isLoading, 
    error,
    dismiss 
  };
}