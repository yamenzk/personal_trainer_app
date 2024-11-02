// src/components/wizard/inputs/GoalSelect.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Scale,
  Dumbbell,
  TrendingUp,
  Target,
  Info,
  ChevronRight,
  Gauge
} from 'lucide-react';
import type { GoalSelectProps } from '@/types/types';

const goals = [
  {
    value: 'Weight Loss',
    title: 'Weight Loss',
    description: 'Reduce body fat and get leaner',
    icon: Scale,
    gradient: 'from-rose-500 to-orange-500',
    detail: 'Focus on caloric deficit with high protein intake for muscle preservation',
    features: [
      'Customized caloric deficit',
      'High protein diet plans',
      'Cardio integration',
      'Progress tracking'
    ]
  },
  {
    value: 'Muscle Building',
    title: 'Build Muscle',
    description: 'Gain muscle mass and strength',
    icon: Dumbbell,
    gradient: 'from-blue-500 to-cyan-500',
    detail: 'Progressive overload training with caloric surplus for muscle growth',
    features: [
      'Progressive overload training',
      'Optimal protein intake',
      'Recovery protocols',
      'Strength progression'
    ]
  },
  {
    value: 'Weight Gain',
    title: 'Healthy Weight Gain',
    description: 'Increase weight sustainably',
    icon: TrendingUp,
    gradient: 'from-green-500 to-emerald-500',
    detail: 'Balanced nutrition approach with gradual caloric surplus',
    features: [
      'Structured meal plans',
      'Healthy caloric surplus',
      'Balanced macros',
      'Weight monitoring'
    ]
  },
  {
    value: 'Maintenance',
    title: 'Maintain & Tone',
    description: 'Keep current fitness level',
    icon: Target,
    gradient: 'from-purple-500 to-pink-500',
    detail: 'Focus on body recomposition while maintaining current weight',
    features: [
      'Body recomposition',
      'Maintenance calories',
      'Toning workouts',
      'Fitness consistency'
    ]
  }
] as const;

export const GoalSelect: React.FC<GoalSelectProps> = ({ value, onChange }) => {
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const selectedGoal = goals.find(g => g.value === value);

  return (
    <div className="space-y-6">
      {/* Selected Goal Summary */}
      {selectedGoal && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4"
        >
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-2 rounded-xl",
              `bg-gradient-to-br ${selectedGoal.gradient}`
            )}>
              <Gauge className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Goal</p>
              <h3 className="font-semibold">{selectedGoal.title}</h3>
            </div>
          </div>
        </motion.div>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <motion.div
              key={goal.value}
              className={cn(
                "relative overflow-hidden rounded-2xl transition-all duration-300",
                "border dark:border-gray-800",
                value === goal.value 
                  ? `ring-2 ring-offset-2 dark:ring-offset-gray-900 ring-${goal.gradient.split('-')[1]}-500`
                  : "hover:border-gray-300 dark:hover:border-gray-700"
              )}
            >        
            <button
              onClick={() => {
                onChange(goal.value);
                setExpandedGoal(expandedGoal === goal.value ? null : goal.value);
              }}
              className="w-full text-left"
            >
              {/* Background Gradients */}
              <div className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-300",
                `bg-gradient-to-br ${goal.gradient}`,
                value === goal.value ? "opacity-5" : "group-hover:opacity-5"
              )} />

              {/* Content */}
              <div className="relative p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                      "transition-all duration-300",
                      value === goal.value
                        ? `bg-gradient-to-br ${goal.gradient}`
                        : "bg-gray-100 dark:bg-gray-800"
                    )}>
                      <goal.icon className={cn(
                        "w-6 h-6 transition-colors",
                        value === goal.value
                          ? "text-white"
                          : "text-gray-500 dark:text-gray-400"
                      )} />
                    </div>

                    <h3 className={cn(
                      "text-lg font-semibold transition-colors",
                      value === goal.value
                        ? `bg-gradient-to-r ${goal.gradient} bg-clip-text text-transparent`
                        : "text-gray-900 dark:text-gray-100"
                    )}>
                      {goal.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {goal.description}
                    </p>
                  </div>

                  <motion.div
                    animate={{ rotate: expandedGoal === goal.value ? 90 : 0 }}
                    className="flex-shrink-0 p-2 ml-4"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </div>

                {/* Expandable Details */}
                <AnimatePresence>
                  {expandedGoal === goal.value && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          {goal.detail}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {goal.features.map((feature, index) => (
                            <div 
                              key={index}
                              className={cn(
                                "px-3 py-2 rounded-lg text-sm",
                                "bg-gray-50 dark:bg-gray-800",
                                "text-gray-600 dark:text-gray-300"
                              )}
                            >
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};