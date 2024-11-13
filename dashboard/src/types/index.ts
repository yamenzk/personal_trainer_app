// src/types/index.ts

import { FoodReference } from './nutrition';
import { ExerciseReference } from './workout';

export * from './api';
export * from './base';
export * from './client';
export * from './nutrition';
export * from './onboarding';
export * from './plan';
export * from './workout';

export interface PerformanceEntry {
  weight: number;
  reps: number;
  date: string;
}

export interface References {
  exercises: { [key: string]: ExerciseReference };
  foods: { [key: string]: FoodReference };
  performance: { [key: string]: Array<PerformanceEntry> };
}