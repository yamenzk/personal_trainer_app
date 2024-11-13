// src/hooks/useClientData.ts
import { useEffect } from 'react';
import { useClientStore } from '@/stores/clientStore';

export function useClientData() {
  const { 
    client, membership, plans, references, 
    isLoading, error, fetch, needsRefresh 
  } = useClientStore();

  useEffect(() => {
    if (needsRefresh()) {
      fetch();
    }
  }, [fetch, needsRefresh]);

  return {
    loading: isLoading,
    error,
    client,
    membership,
    plans,
    references,
    refreshData: fetch
  };
}