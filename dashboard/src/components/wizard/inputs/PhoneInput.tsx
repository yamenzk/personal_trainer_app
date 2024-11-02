// src/components/wizard/inputs/PhoneInput.tsx
import React from 'react';
import { Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PhoneInputProps } from '@/types/types';


export const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange }) => {
  const formatPhoneNumber = (input: string) => {
    if (!input) return '';
    const cleaned = input.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute left-4 inset-y-0 flex items-center">
          <Phone className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="tel"
          value={formatPhoneNumber(value || '')}
          onChange={(e) => {
            const newNumber = e.target.value.replace(/\D/g, '');
            onChange(newNumber);
          }}
          className={cn(
            "w-full pl-12 pr-4 py-4 text-lg",
            "bg-white dark:bg-gray-800 rounded-xl",
            "border-2 transition-colors duration-200",
            "border-gray-200 dark:border-gray-700",
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          )}
          placeholder="Enter your phone number"
        />
      </div>

      {/* Format Example */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Example: XXX XXX XXXX
      </div>
    </div>
  );
};