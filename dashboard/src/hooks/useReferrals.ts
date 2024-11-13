// useReferrals.ts

import { useState, useEffect } from 'react';
import { getReferrals } from '@/utils/api';
import { Referral } from '@/types';

export const useReferrals = (clientId: string) => {
  const [referrals, setReferrals] = useState<Array<Referral>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await getReferrals(clientId);
        setReferrals(response.data || []);
      } catch (error) {
        console.error('Failed to fetch referrals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [clientId]);

  return { referrals, loading };
};