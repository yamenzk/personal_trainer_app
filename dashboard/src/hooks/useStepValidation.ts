import { useEffect, useState, useCallback } from 'react';

export function useStepValidation<T>(
  initialValue: T | undefined,
  onComplete: (value: T) => void,
  onValidationChange?: (isValid: boolean) => void
) {
  const [selected, setSelected] = useState<T | null>(initialValue || null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Handle initial value
  useEffect(() => {
    if (!isInitialized && initialValue) {
      setSelected(initialValue);
      setIsInitialized(true);
    }
  }, [initialValue, isInitialized]);

  // Handle validation and completion
  useEffect(() => {
    const isValid = selected !== null;
    onValidationChange?.(isValid);
  }, [selected, onValidationChange]);

  const handleSelect = useCallback((value: T) => {
    setSelected(value);
    onComplete(value);
  }, [onComplete]);

  return { selected, handleSelect };
}