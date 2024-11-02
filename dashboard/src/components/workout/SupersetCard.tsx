// src/components/workout/SupersetCard.tsx
import React from 'react';
import { Dumbbell, Clock, ArrowDownUp } from 'lucide-react';
import type { Exercise, ExerciseReference } from '@/types/api';

interface SupersetCardProps {
  exercises: Exercise[];
  exerciseDetails: Record<string, ExerciseReference>;
  onExerciseClick: (exercise: Exercise, index: number) => void;
}

export const SupersetCard: React.FC<SupersetCardProps> = ({
  exercises,
  exerciseDetails,
  onExerciseClick,
}) => {
  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
      {/* Superset Header */}
      <div className="mb-4">
        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
          Superset
        </span>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Perform these exercises back to back
        </div>
      </div>

      {/* Exercises Flow */}
      <div className="space-y-3">
        {exercises.map((exercise, index) => {
          const details = exerciseDetails[exercise.ref];
          return (
            <React.Fragment key={`${exercise.ref}-${index}`}>
              {/* Exercise Card */}
              <div 
                onClick={() => onExerciseClick(exercise, index)}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{exercise.ref}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Dumbbell className="w-4 h-4 mr-1" />
                        {exercise.sets} × {exercise.reps}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {exercise.rest}s
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Arrow connector */}
              {index < exercises.length - 1 && (
                <div className="flex justify-center">
                  <ArrowDownUp className="w-5 h-5 text-purple-400 dark:text-purple-500" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};