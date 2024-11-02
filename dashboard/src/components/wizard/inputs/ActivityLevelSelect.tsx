// src/components/wizard/inputs/ActivityLevelSelect.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Coffee,
  Footprints,
  Activity,
  Rabbit,
  Dumbbell,
  Info
} from 'lucide-react';
import type { ActivityLevelSelectProps } from '@/types/types';

const levels = [
  {
    value: 'Sedentary' as const,
    title: 'Sedentary',
    description: 'Little to no exercise',
    details: 'Office work, minimal movement throughout the day',
    icon: Coffee,
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    intensity: 10,
  },
  {
    value: 'Light' as const,
    title: 'Lightly Active',
    description: 'Light exercise 1-3 days/week',
    details: 'Regular walking, light housework, casual cycling',
    icon: Footprints,
    color: 'green',
    gradient: 'from-green-500 to-emerald-600',
    intensity: 30,
  },
  {
    value: 'Moderate' as const,
    title: 'Moderately Active',
    description: 'Moderate exercise 3-5 days/week',
    details: 'Jogging, recreational sports, regular workouts',
    icon: Rabbit,
    color: 'orange',
    gradient: 'from-orange-500 to-amber-600',
    intensity: 60,
  },
  {
    value: 'Very Active' as const,
    title: 'Very Active',
    description: 'Hard exercise 6-7 days/week',
    details: 'Intense training, competitive sports, physical job',
    icon: Activity,
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
    intensity: 80,
  },
  {
    value: 'Extra Active' as const,
    title: 'Extra Active',
    description: 'Very hard exercise & physical job',
    details: 'Professional athlete, extremely demanding physical work',
    icon: Dumbbell,
    color: 'red',
    gradient: 'from-red-500 to-rose-600',
    intensity: 100,
  }
] as const;

export const ActivityLevelSelect: React.FC<ActivityLevelSelectProps> = ({ value, onChange }) => {
  const [hoveredLevel, setHoveredLevel] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Activity Meter */}
      <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-8">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"
          animate={{
            width: `${(levels.find(l => l.value === value)?.intensity || 0)}%`
          }}
          transition={{ type: "spring", bounce: 0.2 }}
        />
      </div>

      {/* Level Cards */}
      <div className="space-y-3">
        {levels.map((level) => (
          <motion.button
            key={level.value}
            onClick={() => onChange(level.value)}
            onHoverStart={() => setHoveredLevel(level.value)}
            onHoverEnd={() => setHoveredLevel(null)}
            className={cn(
              "relative w-full p-4 rounded-xl border transition-all duration-300",
              "group hover:shadow-lg",
              value === level.value
                ? "border-transparent ring-2 ring-offset-2 dark:ring-offset-gray-800"
                : "border-gray-200 dark:border-gray-700 hover:border-transparent",
              value === level.value
                ? `ring-${level.color}-500`
                : "hover:ring-2 hover:ring-gray-200 dark:hover:ring-gray-700"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Background Gradient */}
            <div className={cn(
              "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
              `bg-gradient-to-br ${level.gradient}`,
              (value === level.value || hoveredLevel === level.value) && "opacity-5"
            )} />

            <div className="relative flex items-start space-x-4">
              {/* Icon */}
              <div className={cn(
                "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center",
                "transition-all duration-300",
                value === level.value
                  ? `bg-gradient-to-br ${level.gradient} shadow-lg`
                  : "bg-gray-100 dark:bg-gray-800"
              )}>
                <level.icon className={cn(
                  "w-6 h-6 transition-colors duration-300",
                  value === level.value
                    ? "text-white"
                    : `text-${level.color}-500`
                )} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={cn(
                    "font-medium transition-colors duration-300",
                    value === level.value
                      ? `text-${level.color}-500`
                      : "text-gray-900 dark:text-gray-100"
                  )}>
                    {level.title}
                  </h3>
                  {value === level.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`w-6 h-6 rounded-full bg-gradient-to-br ${level.gradient} flex items-center justify-center`}
                    >
                      <Info className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {level.description}
                </p>
              </div>
            </div>

            {/* Details Panel */}
            <AnimatePresence>
              {(value === level.value || hoveredLevel === level.value) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {level.details}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
};