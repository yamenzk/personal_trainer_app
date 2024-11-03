// src/hooks/useClientData.ts
import { useState, useEffect } from 'react';
import { ApiResponse } from '../types/api';
import { Client } from '@/types/client';
import { Membership } from '@/types/membership';
import { Plan } from '@/types/plan';
import { getMembership } from '../utils/api';

interface UseClientDataReturn {
  loading: boolean;
  error: string | null;
  client: Client | null;
  membership: Membership | null;
  plans: Plan[];
  references: ApiResponse<any>['data']['references'] | null;
  refreshData: () => Promise<void>;
}

export function useClientData(): UseClientDataReturn {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse<any>['data'] | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const membershipId = localStorage.getItem('membershipId');
      if (!membershipId) {
        throw new Error('No membership ID found');
      }
      
      const response = await getMembership(membershipId);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    loading,
    error,
    client: data?.client ?? null,
    membership: data?.membership ?? null,
    plans: data?.plans ?? [],
    references: data?.references ?? null,
    refreshData: fetchData
  };
}