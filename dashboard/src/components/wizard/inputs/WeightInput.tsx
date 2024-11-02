// src/components/wizard/inputs/WeightInput.tsx
import React, { useState} from 'react';
import { motion} from 'framer-motion';
import { cn } from '@/lib/utils';
import { Scale, ChevronUp, ChevronDown } from 'lucide-react';
import type { WeightInputProps } from '@/types/types';

export const WeightInput: React.FC<WeightInputProps> = ({ value, onChange }) => {
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [focused, setFocused] = useState(false);
  const [recentValues] = useState(() => {
    // Generate some reasonable recent values based on the current value
    const baseValue = value || 70;
    return [
      baseValue - 10,
      baseValue - 5,
      baseValue,
      baseValue + 5,
      baseValue + 10
    ].filter(v => v > 0);
  });

  const handleUnitChange = (newUnit: 'kg' | 'lb') => {
    setUnit(newUnit);
    if (value) {
      const newValue = newUnit === 'lb' 
        ? value * 2.20462
        : value / 2.20462;
      onChange(Math.round(newValue * 10) / 10);
    }
  };

  const incrementValue = (increment: number) => {
    if (value !== undefined) {
      onChange(Math.round((value + increment) * 10) / 10);
    }
  };

  return (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {(['kg', 'lb'] as const).map((unitOption) => (
          <motion.button
            key={unitOption}
            onClick={() => handleUnitChange(unitOption)}
            className={cn(
              "relative px-6 py-2 text-sm font-medium rounded-lg",
              unit === unitOption
                ? "text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {unit === unitOption && (
              <motion.div
                layoutId="unitBackground"
                className="absolute inset-0 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative">{unitOption.toUpperCase()}</span>
          </motion.button>
        ))}
      </div>

      {/* Main Input */}
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2">
          <Scale className={cn(
            "w-6 h-6 transition-colors",
            focused ? "text-blue-500" : "text-gray-400"
          )} />
        </div>

        <div className="relative">
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={cn(
              "w-full pl-14 pr-20 py-4 text-2xl font-medium",
              "bg-white dark:bg-gray-800 rounded-xl",
              "border-2 transition-colors duration-300",
              focused
                ? "border-blue-500"
                : "border-gray-200 dark:border-gray-700",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            )}
            placeholder="0.0"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            {unit}
          </div>
        </div>

        {/* Increment/Decrement Buttons */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 flex flex-col space-y-0.5">
          <button
            onClick={() => incrementValue(unit === 'kg' ? 0.1 : 0.2)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => incrementValue(unit === 'kg' ? -0.1 : -0.2)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Select Values */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          <span className="text-sm text-gray-500">Quick Select</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        <div className="grid grid-cols-5 gap-2">
          {recentValues.map((recentValue, index) => {
            const displayValue = unit === 'lb' 
              ? Math.round(recentValue * 2.20462)
              : recentValue;
            
            return (
              <motion.button
                key={index}
                onClick={() => onChange(recentValue)}
                className={cn(
                  "p-3 rounded-xl text-sm font-medium",
                  "border-2 transition-all duration-300",
                  value === recentValue
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {displayValue}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Visual Scale */}
      <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600"
          initial={false}
          animate={{
            width: `${((value || 0) / (unit === 'kg' ? 150 : 330)) * 100}%`
          }}
          transition={{ type: "spring", bounce: 0.2 }}
        />
        

              </div>
        
              {/* Weight Range Indicator */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Healthy Range</span>
                  <span className="font-medium">
                    {unit === 'kg' ? '50 - 100 kg' : '110 - 220 lb'}
                  </span>
                </div>
              </div>
            </div>
          );
        };