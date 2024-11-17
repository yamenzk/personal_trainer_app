// src/types/workout.ts

export interface ExerciseBase {
  ref: string;
  sets: number;
  reps: number;
  rest: number;
  logged: number;
}

export interface RegularExercise {
  type: 'regular';
  exercise: ExerciseBase;
}

export interface SupersetExercise {
  type: 'superset';
  exercises: ExerciseBase[];
}

export type Exercise = RegularExercise | SupersetExercise;

export interface ExerciseReference {
  category: string;
  equipment: string;
  force: string;
  mechanic: string;
  level: string;
  primary_muscle: string;
  thumbnail: string;
  starting: string;
  ending: string;
  video?: string;
  _videoUrl?: string;
  instructions: string;
  secondary_muscles: Array<{ muscle: string }>;
}

export interface ExercisePerformance {
  weight: number;
  reps: number;
  date: string;
}

export interface PerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (weight: number, reps: number) => Promise<void>;
  exerciseName: string;
  targetReps: number;
  previousPerformance?: ExercisePerformance[];
}

export interface ExerciseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: ExerciseBase;
  details: ExerciseReference;
  isLogged: boolean;
  performance?: ExercisePerformance[];
}

export interface ExercisePerformance {
  weight: number;
  reps: number;
  date: string;
}

export interface ExerciseCardProps {
  exercise: ExerciseBase;
  references: { [key: string]: ExerciseReference };
  performance?: { [key: string]: ExercisePerformance[] };
  isLogged?: boolean;
  isSuperset?: boolean;
  onLogSet?: () => void;
  onViewDetails: () => void;
  selectedPlan: 'active' | 'history';
  exerciseNumber?: number;
  isChangingPlan?: boolean;
}

export type TipType = 'hydration' | 'form' | 'etiquette' | 'mindset' | 'recovery' | 'nutrition' | 'safety';

export interface WorkoutTip {
  icon: any;
  title: string;
  message: string;
  type: TipType;
  emoji: string;
}

export interface TipCardProps {
  tip: WorkoutTip;
}

export type PerformanceData = Array<{
  weight: number;
  reps: number;
  date: string;
}>;