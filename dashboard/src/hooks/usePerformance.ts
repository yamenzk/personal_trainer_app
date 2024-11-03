// src/hooks/usePerformance.ts
import { useMemo } from 'react';
import { ApiResponse } from '../types/api';
import { Plan } from '../types/plan';
import { Exercise } from '../types/workout';

type PerformanceData = ApiResponse<any>['data']['references']['performance'];

interface UsePerformanceReturn {
  getExercisePerformance: (exerciseRef: string) => Array<{
    weight: number;
    reps: number;
    date: string;
  }>;
  getBestWeight: (exerciseRef: string) => number;
  getBestReps: (exerciseRef: string) => number;
  isExerciseLogged: (exerciseRef: string, exerciseDay: string) => boolean;
}

export function usePerformance(
  performanceData: PerformanceData, 
  currentPlan?: Plan
): UsePerformanceReturn {
  return useMemo(() => ({
    getExercisePerformance: (exerciseRef: string) => 
      performanceData[exerciseRef] ?? [],
    
    getBestWeight: (exerciseRef: string) => {
      const performances = performanceData[exerciseRef] ?? [];
      return Math.max(...performances.map(p => p.weight), 0);
    },
    
    getBestReps: (exerciseRef: string) => {
      const performances = performanceData[exerciseRef] ?? [];
      return Math.max(...performances.map(p => p.reps), 0);
    },

    isExerciseLogged: (exerciseRef: string, exerciseDay: string) => {
      if (!currentPlan?.days[exerciseDay]) return false;

      const dayExercises = currentPlan.days[exerciseDay].exercises;
      for (const ex of dayExercises) {
        if (ex.type === 'regular' && ex.exercise.ref === exerciseRef) {
          return ex.exercise.logged === 1;
        } else if (ex.type === 'superset') {
          const supersetExercise = ex.exercises.find((e) => e.ref === exerciseRef);
          if (supersetExercise) {
            return supersetExercise.logged === 1;
          }
        }
      }
      return false;
    }
  }), [performanceData, currentPlan]);
}