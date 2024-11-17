
import { useState, useEffect } from 'react';
import { getAnnouncement } from '@/utils/api';

export function useAnnouncement() {
  const [announcement, setAnnouncement] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const cachedAnnouncement = sessionStorage.getItem('announcement');
    
    if (cachedAnnouncement) {
      setAnnouncement(JSON.parse(cachedAnnouncement));
      return;
    }

    const fetchAnnouncement = async () => {
      if (loading) return;
      
      setLoading(true);
      try {
        const response = await getAnnouncement();
        if (!mounted) return;
        
        setAnnouncement(response.data);
        sessionStorage.setItem('announcement', JSON.stringify(response.data));
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to fetch announcement');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchAnnouncement();

    return () => {
      mounted = false;
    };
  }, []);

  return { announcement, loading, error };
}