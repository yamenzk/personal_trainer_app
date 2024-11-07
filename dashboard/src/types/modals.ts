import { ExerciseBase, ExerciseReference } from "./workout";

export interface PerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (weight: number, reps: number) => Promise<void>;
  exerciseName: string;
  targetReps: number;
  previousPerformance?: {
    weight: number;
    reps: number;
    date: string;
  }[];
}

export interface ExerciseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: ExerciseBase;
  details: ExerciseReference;
  isLogged: boolean;
  performance?: {
    weight: number;
    reps: number;
    date: string;
  }[];
}
