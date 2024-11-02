// src/components/ui/modal.tsx
import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children,
  showCloseButton = true
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 overflow-y-auto pb-20">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-[24px] shadow-xl overflow-hidden">
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/80 dark:hover:bg-white/100 transition-colors z-10"
              >
                <X className="w-5 h-5 text-white dark:text-gray-600" />
              </button>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};