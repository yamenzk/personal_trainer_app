// useReferrals.ts

import { useState, useEffect } from 'react';
import { Referral } from '@/types';

export const useReferrals = (clientId: string) => {
  const [referrals, setReferrals] = useState<Array<Referral>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await fetch(`/api/v2/method/personal_trainer_app.api.get_referrals?client_id=${clientId}`);
        const data = await response.json();
        setReferrals(data.data || []);
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