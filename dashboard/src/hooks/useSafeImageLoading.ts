import { useState, useEffect, useRef } from 'react';
import { useClientStore } from '@/stores/clientStore';

interface UseSafeImageLoadingReturn {
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export function useSafeImageLoading(
  imageUrl: string | undefined,
  onLoad?: () => void
): UseSafeImageLoadingReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const isMounted = useRef(true);
  const mediaCache = useClientStore(state => state.mediaCache);

  const loadImage = async (url: string) => {
    if (!url) {
      setIsLoading(false);
      return;
    }

    // If image is in cache, load immediately
    if (mediaCache.images[url]) {
      setIsLoading(false);
      onLoad?.();
      return;
    }

    try {
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });

      if (isMounted.current) {
        setIsLoading(false);
        onLoad?.();
      }
    } catch (err) {
      if (isMounted.current) {
        setIsLoading(false);
        setError('Failed to load image');
        console.error('Image loading error:', err);
      }
    }
  };

  const retry = () => {
    if (retryCount < 3 && imageUrl) {
      setRetryCount(prev => prev + 1);
      setIsLoading(true);
      setError(null);
      loadImage(imageUrl);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    
    if (imageUrl) {
      loadImage(imageUrl);
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted.current = false;
    };
  }, [imageUrl, retryCount]);

  return { isLoading, error, retry };
}