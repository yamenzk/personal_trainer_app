// src/components/ui/loading.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Loader2 className={`animate-spin ${className}`} />
);

export const LoadingScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div className="flex flex-col items-center space-y-4">
      <LoadingSpinner className="w-8 h-8 text-blue-500" />
      <p className="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

export const LoadingOverlay: React.FC = () => (
  <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
    <LoadingSpinner className="w-8 h-8 text-blue-500" />
  </div>
);