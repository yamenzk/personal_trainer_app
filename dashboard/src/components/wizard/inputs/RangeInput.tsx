// src/components/wizard/inputs/RangeInput.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Minus,
  Plus
} from 'lucide-react';
import type { RangeInputProps } from '@/types/types';

const content = {
  meals: {
    title: 'meals per day',
    unit: 'meals/day',
    descriptions: {
      3: 'Standard frequency for regular meals',
      4: 'Optimal spacing for better metabolism',
      5: 'Higher frequency for nutrient timing',
      6: 'Advanced meal timing for specific goals'
    }
  },
  workouts: {
    title: 'workouts per week',
    unit: 'workouts/week',
    descriptions: {
      3: 'Great for beginners and busy schedules',
      4: 'Balanced frequency for steady progress',
      5: 'High intensity for faster results',
      6: 'Advanced training for peak performance'
    }
  }
} as const;

export const RangeInput: React.FC<RangeInputProps> = ({
  value,
  onChange,
  min,
  max,
  step,
  type = 'meals'
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const currentContent = content[type];
  const stops = Array.from(
    { length: ((max - min) / step) + 1 },
    (_, i) => min + (i * step)
  );

  return (
    <div className="space-y-8">
      {/* Current Value Display */}
      <div className="relative flex justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            "relative w-32 h-32 rounded-full",
            "bg-gradient-to-br from-blue-500 to-purple-500"
          )}
        >
          <div className="absolute inset-1 rounded-full bg-white dark:bg-gray-900" />
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <motion.span 
              className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
              key={value}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {value}
            </motion.span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentContent.unit}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Description */}
      <motion.div
        key={value}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-gray-500 dark:text-gray-400"
      >
        {currentContent.descriptions[value as keyof typeof currentContent.descriptions]}
      </motion.div>

      {/* Range Slider */}
      <div className="relative pt-6 px-3">
        {/* Track */}
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          {/* Filled Track */}
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            style={{ width: `${percentage}%` }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />

          {/* Stop Markers */}
          {stops.map((stop) => {
            const stopPercentage = ((stop - min) / (max - min)) * 100;
            const isActive = stop <= value;
            
            return (
              <motion.div
                key={stop}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 -translate-x-1/2",
                  "w-4 h-4 rounded-full border-2 border-white dark:border-gray-900",
                  "transition-colors duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-500"
                    : "bg-gray-200 dark:bg-gray-700"
                )}
                style={{ left: `${stopPercentage}%` }}
                whileHover={{ scale: 1.2 }}
                onClick={() => onChange(stop)}
              />
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => value > min && onChange(value - step)}
            className={cn(
              "p-3 rounded-xl",
              "bg-gray-100 dark:bg-gray-800",
              "text-gray-500 dark:text-gray-400",
              "hover:bg-gray-200 dark:hover:bg-gray-700",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            disabled={value <= min}
          >
            <Minus className="w-5 h-5" />
          </motion.button>

          {/* Value Label */}
          <div className="flex-1 text-center">
            <span className="text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              {`${value} ${currentContent.title}`}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => value < max && onChange(value + step)}
            className={cn(
              "p-3 rounded-xl",
              "bg-gray-100 dark:bg-gray-800",
              "text-gray-500 dark:text-gray-400",
              "hover:bg-gray-200 dark:hover:bg-gray-700",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            disabled={value >= max}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Quick Select Chips */}
      <div className="grid grid-cols-4 gap-2">
        {stops.map((stop) => (
          <motion.button
            key={stop}
            onClick={() => onChange(stop)}
            className={cn(
              "py-2 px-4 rounded-lg text-sm font-medium",
              "transition-colors duration-200",
              value === stop
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
              "hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {stop}
          </motion.button>
        ))}
      </div>
    </div>
  );
};