// src/components/wizard/inputs/WorkoutLocationSelect.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Building2,
  DumbbellIcon,
  Users,
  Clock,
  MapPin,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WorkoutLocationSelectProps } from '@/types/types';

const locations = [
  {
    value: 'Home' as const,
    title: 'Home Workout',
    description: 'Train with minimal equipment at home',
    icon: Home,
    gradient: 'from-orange-500 to-pink-500',
    benefits: [
      {
        icon: Clock,
        text: 'Flexible schedule'
      },
      {
        icon: MapPin,
        text: 'No commute needed'
      }
    ],
    equipment: [
      'Resistance bands',
      'Dumbbells (optional)',
      'Exercise mat',
      'Pull-up bar (optional)'
    ]
  },
  {
    value: 'Gym' as const,
    title: 'Gym Access',
    description: 'Train at a fully equipped facility',
    icon: Building2,
    gradient: 'from-blue-500 to-purple-500',
    benefits: [
      {
        icon: DumbbellIcon,
        text: 'Full equipment access'
      },
      {
        icon: Users,
        text: 'Professional environment'
      }
    ],
    equipment: [
      'All gym equipment',
      'Professional machines',
      'Free weights',
      'Cardio equipment'
    ]
  }
] as const;

export const WorkoutLocationSelect: React.FC<WorkoutLocationSelectProps> = ({ 
  value, 
  onChange 
}) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  return (
    <div className="space-y-6">
      {/* Location Cards */}
      <div className="space-y-4">
        {locations.map((location) => {
          const isSelected = value === location.value;
          const isExpanded = expandedCard === location.value;

          return (
            <motion.div
              key={location.value}
              initial={false}
              animate={{ height: isExpanded ? 'auto' : 'auto' }}
              className={cn(
                "relative overflow-hidden rounded-2xl",
                "border transition-colors duration-300",
                isSelected 
                  ? "ring-2 ring-offset-2 dark:ring-offset-white-900"
                  : "hover:border-gray-300 dark:hover:border-white-700",
                isSelected 
                  ? `ring-${location.gradient.split('-')[1]}-500`
                  : "ring-transparent"
              )}
            >
              {/* Card Content */}
              <div 
                className={cn(
                  "relative overflow-hidden",
                  "cursor-pointer transition-all duration-300",
                  isSelected && "bg-gray-50 dark:bg-gray-800/50"
                )}
              >
                {/* Background Gradient */}
                <div className={cn(
                  "absolute inset-0 opacity-0 transition-opacity duration-300",
                  `bg-gradient-to-br ${location.gradient}`,
                  (isSelected || isExpanded) && "opacity-5"
                )} />

                {/* Main Button Section */}
                <button
                  onClick={() => {
                    onChange(location.value);
                    setExpandedCard(location.value);
                  }}
                  className="relative w-full p-6 text-left"
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={cn(
                      "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
                      "transition-all duration-300",
                      isSelected
                        ? `bg-gradient-to-br ${location.gradient}`
                        : "bg-gray-100 dark:bg-gray-800"
                    )}>
                      <location.icon className={cn(
                        "w-6 h-6 transition-colors",
                        isSelected
                          ? "text-white"
                          : "text-gray-500 dark:text-gray-400"
                      )} />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        "font-medium transition-colors",
                        isSelected
                          ? `bg-gradient-to-r ${location.gradient} bg-clip-text text-transparent`
                          : "text-gray-900 dark:text-gray-100"
                      )}>
                        {location.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {location.description}
                      </p>
                    </div>

                    {/* Selection Indicator */}
                    <div className={cn(
                      "flex-shrink-0 w-5 h-5 rounded-full border-2",
                      "transition-colors duration-300",
                      isSelected
                        ? `bg-gradient-to-br ${location.gradient} border-transparent`
                        : "border-gray-300 dark:border-gray-600"
                    )}>
                      {isSelected && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mt-4 flex items-center space-x-4">
                    {location.benefits.map((benefit, index) => (
                      <div 
                        key={index}
                        className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
                      >
                        <benefit.icon className="w-4 h-4" />
                        <span>{benefit.text}</span>
                      </div>
                    ))}
                  </div>
                </button>

                {/* Expandable Section */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                            Available Equipment
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {location.equipment.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};