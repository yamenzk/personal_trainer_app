// src/hooks/useClientData.ts
import { useEffect, useRef } from 'react';
import { useClientStore } from '@/stores/clientStore';

export function useClientData(options = { forceRefresh: false }) {
  const { 
    client, membership, plans, references, 
    isLoading, error, fetch, refreshIfNeeded,
    isInitialized, offlineMode
  } = useClientStore();
  
  const checkingRef = useRef(false);

  useEffect(() => {
    const checkData = async () => {
      if (checkingRef.current) return;
      checkingRef.current = true;

      try {
        if (client && offlineMode) return;

        if (!client || options.forceRefresh) {
          await fetch(options.forceRefresh);
        } else {
          await refreshIfNeeded();
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes('network') && client) {
          useClientStore.setState({ offlineMode: true });
        }
      } finally {
        checkingRef.current = false;
      }
    };

    checkData();
  }, [fetch, refreshIfNeeded, isInitialized, options.forceRefresh, client, offlineMode]);

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