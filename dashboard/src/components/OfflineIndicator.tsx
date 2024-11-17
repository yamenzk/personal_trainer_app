
import { WifiOff } from 'lucide-react';
import { Button } from '@nextui-org/react';
import { useClientStore } from '@/stores/clientStore';

export const OfflineIndicator = () => {
  const { offlineMode, initializeOfflineData } = useClientStore();

  if (!offlineMode) return null;

  return (
    <Button
      startContent={<WifiOff size={16} />}
      variant="flat"
      color="warning"
      size="sm"
      onClick={() => initializeOfflineData()}
      className="fixed bottom-4 right-4 z-50 gap-1 px-3 shadow-lg animate-in fade-in duration-300"
    >
      Offline Mode - Click to retry
    </Button>
  );
};