// src/components/wizard/inputs/GenderSelect.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  PersonStanding,
  Triangle
} from 'lucide-react';
import type { GenderSelectProps } from '@/types/types';

const genderOptions = [
  {
    value: 'Male' as const,
    label: 'Male',
    icon: PersonStanding,
    gradient: 'from-blue-500 via-blue-400 to-blue-600',
    bgGradient: 'from-blue-500/5 via-blue-400/5 to-blue-600/5'
  },
  {
    value: 'Female' as const,
    label: 'Female',
    icon: Triangle,
    gradient: 'from-pink-500 via-purple-400 to-purple-600',
    bgGradient: 'from-pink-500/5 via-purple-400/5 to-purple-600/5'
  }
] as const;

export const GenderSelect: React.FC<GenderSelectProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {genderOptions.map((gender) => (
        <motion.button
          key={gender.value}
          onClick={() => onChange(gender.value)}
          className={cn(
            "group relative flex flex-col items-center p-6 rounded-2xl",
            "transition-all duration-300",
            value === gender.value 
              ? "ring-2 ring-offset-2 dark:ring-offset-gray-800"
              : "hover:bg-gray-50 dark:hover:bg-gray-800/50",
            value === gender.value
              ? `ring-${gender.gradient.split('-')[1]}-500`
              : "ring-transparent"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Background Gradient */}
          <div className={cn(
            "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300",
            `bg-gradient-to-br ${gender.bgGradient}`,
            value === gender.value && "opacity-100"
          )} />

          {/* Icon Container */}
          <div className={cn(
            "relative w-16 h-16 rounded-xl flex items-center justify-center mb-4",
            "transition-all duration-300",
            value === gender.value
              ? `bg-gradient-to-br ${gender.gradient}`
              : "bg-gray-100 dark:bg-gray-800"
          )}>
            <gender.icon 
              className={cn(
                "w-8 h-8 transition-colors duration-300",
                value === gender.value
                  ? "text-white"
                  : "text-gray-500 dark:text-gray-400"
              )} 
            />
          </div>

          {/* Label */}
          <span className={cn(
            "relative text-lg font-medium transition-colors duration-300",
            value === gender.value
              ? `bg-gradient-to-r ${gender.gradient} bg-clip-text text-transparent`
              : "text-gray-700 dark:text-gray-300"
          )}>
            {gender.label}
          </span>

          {/* Selection Ring Animation */}
          {value === gender.value && (
            <motion.div
              layoutId="genderSelection"
              className="absolute inset-0 rounded-2xl"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            >
              <div className={cn(
                "absolute inset-0 rounded-2xl",
                "animate-border-width",
                `bg-gradient-to-r ${gender.gradient}`,
                "opacity-20"
              )} />
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
};