// src/types/workout.ts
export interface ExerciseBase {
  ref: string;
  sets: number;
  reps: number;
  rest: number;
  logged: number; // Added logged property
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
  video: string;
  instructions: string;
  secondary_muscles: Array<{ muscle: string }>;
}