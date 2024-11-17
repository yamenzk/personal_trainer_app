// src/hooks/useClientData.ts
import { useEffect, useRef } from 'react';
import { useClientStore } from '@/stores/clientStore';

export function useClientData(options = { forceRefresh: false }) {
  const { 
    client, membership, plans, references, 
    isLoading, error, fetch, needsRefresh, 
    isInitialized, checkVersion, offlineMode
  } = useClientStore();
  
  const checkingRef = useRef(false);

  useEffect(() => {
    const checkData = async () => {
      if (checkingRef.current) return;
      checkingRef.current = true;

      try {
        // If we have data and we're offline, use cached data
        if (client && offlineMode) {
          return;
        }

        // If we have data but not initialized, just mark as initialized
        if (client && !isInitialized) {
          useClientStore.setState({ isInitialized: true });
          return;
        }

        // Regular online checks
        if (!client || options.forceRefresh) {
          await fetch(options.forceRefresh);
        } else if (needsRefresh()) {
          const needsUpdate = await checkVersion();
          if (needsUpdate) {
            await fetch();
          }
        }
      } catch (err) {
        // If network error and we have cached data, enable offline mode
        if (err instanceof Error && err.message.includes('network') && client) {
          useClientStore.setState({ offlineMode: true });
        }
      } finally {
        checkingRef.current = false;
      }
    };

    checkData();
  }, [fetch, needsRefresh, isInitialized, options.forceRefresh, checkVersion, client, offlineMode]);

  return {
    loading: isLoading,
    error,
    client,
    membership,
    plans,
    references,
    offlineMode,
    refreshData: () => fetch(true)
  };
}