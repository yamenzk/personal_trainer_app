// src/components/wizard/inputs/ExercisePerformanceInput.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Weight,
  Repeat,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  Trophy,
  History,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ExercisePerformanceInputProps } from '@/types/types';

export const ExercisePerformanceInput: React.FC<ExercisePerformanceInputProps> = ({
  value,
  onChange,
  previousRecord
}) => {
  const handleChange = (field: 'weight' | 'reps', amount: number) => {
    onChange({
      weight: field === 'weight' ? Math.max(0, (value?.weight || 0) + amount) : (value?.weight || 0),
      reps: field === 'reps' ? Math.max(0, (value?.reps || 0) + amount) : (value?.reps || 0)
    });
  };

  const isPR = previousRecord && value && 
    (value.weight > previousRecord.weight || value.reps > previousRecord.reps);

  return (
    <div className="space-y-6">
      {/* Performance Summary Card */}
      {value && value.weight > 0 && value.reps > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Performance
                </span>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {value.weight}kg × {value.reps} reps
              </div>
            </div>

            {isPR && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center space-x-2 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-full"
              >
                <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  New PR!
                </span>
              </motion.div>
            )}
          </div>

          {/* Previous Record */}
          {previousRecord && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <History className="w-4 h-4" />
                <span>Previous: {previousRecord.weight}kg × {previousRecord.reps} reps</span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Input Controls */}
      <div className="grid grid-cols-2 gap-4">
        {/* Weight Input */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Weight className="w-4 h-4" />
            <span>Weight (kg)</span>
          </div>
          
          <div className="relative">
            <input
              type="number"
              value={value?.weight || ''}
              onChange={(e) => handleChange('weight', parseFloat(e.target.value) - (value?.weight || 0))}
              className={cn(
                "w-full px-4 py-3 text-2xl font-bold text-center",
                "bg-white dark:bg-gray-800 rounded-xl",
                "border-2 border-gray-200 dark:border-gray-700",
                "focus:border-blue-500 dark:focus:border-blue-400",
                "focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20",
                "transition-all duration-200"
              )}
              placeholder="0"
            />
            <div className="absolute right-2 inset-y-0 flex flex-col items-center justify-center space-y-0.5">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleChange('weight', 2.5)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <ChevronUp className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleChange('weight', -2.5)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Quick Weight Selectors */}
          <div className="grid grid-cols-4 gap-2">
            {[2.5, 5, 10, 15].map((increment) => (
              <motion.button
                key={increment}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleChange('weight', increment)}
                className="p-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                +{increment}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Reps Input */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Repeat className="w-4 h-4" />
            <span>Repetitions</span>
          </div>
          
          <div className="relative">
            <input
              type="number"
              value={value?.reps || ''}
              onChange={(e) => handleChange('reps', parseInt(e.target.value) - (value?.reps || 0))}
              className={cn(
                "w-full px-4 py-3 text-2xl font-bold text-center",
                "bg-white dark:bg-gray-800 rounded-xl",
                "border-2 border-gray-200 dark:border-gray-700",
                "focus:border-purple-500 dark:focus:border-purple-400",
                "focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20",
                "transition-all duration-200"
              )}
              placeholder="0"
            />
            <div className="absolute right-2 inset-y-0 flex flex-col items-center justify-center space-y-0.5">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleChange('reps', 1)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <ChevronUp className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleChange('reps', -1)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Quick Reps Selectors */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 5, 10].map((increment) => (
              <motion.button
                key={increment}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleChange('reps', increment)}
                className="p-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                +{increment}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};