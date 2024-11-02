export interface Membership {
  name: string;
  package: string;
  client: string;
  start: string;
  end: string;
  active: number;
}

// Client types
export interface WeightEntry {
  weight: number;
  date: string;
}

export interface Client {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  image: string;
  enabled: number;
  client_name: string;
  date_of_birth: string;
  age: string;
  gender: string;
  mobile: string;
  email: string;
  nationality: string;
  referred_by: string | null;
  allow_preference_update: number;
  blocked_foods: string;
  goal: string;
  target_weight: number;
  meals: number;
  workouts: number;
  equipment: string;
  activity_level: string;
  height: number;
  request_weight: number;
  adjust_factor: number;
  factor: number;
  adjust: number;
  last_update: string | null;
  doctype: string;
  weight: WeightEntry[];
  current_weight: number;
}

// Plan types
export interface NutritionValue {
  value: number;
  unit: string;
}

export interface Nutrition {
  energy: NutritionValue;
  carbs: NutritionValue;
  protein: NutritionValue;
  fat: NutritionValue;
}

export interface PlanTargets {
  proteins: string;
  carbs: string;
  fats: string;
  energy: string;
  water: string;
}

export interface PlanConfig {
  equipment: string;
  goal: string;
  weekly_workouts: string;
  daily_meals: string;
}

export interface Exercise {
  ref: string;
  sets: number;
  reps: number;
  rest: number;
  logged: number; // Add this field
}

export interface RegularExercise {
  type: 'regular';
  exercise: Exercise;
}

export interface SupersetExercise {
  type: 'superset';
  exercises: Exercise[];
}

export interface FoodItem {
  meal: string;
  ref: string;
  amount: string;
  nutrition: Nutrition;
}

export interface DayTotals {
  energy: NutritionValue;
  protein: NutritionValue;
  carbs: NutritionValue;
  fat: NutritionValue;
}

export interface DayPlan {
  exercises: (RegularExercise | SupersetExercise)[];
  foods: FoodItem[];
  totals: DayTotals;
}

export interface Plan {
  plan_name: string;
  start: string;
  end: string;
  targets: PlanTargets;
  config: PlanConfig;
  status: 'Scheduled' | 'Active' | 'Completed';
  days: {
    [key: `day_${number}`]: DayPlan;
  };
}

// Reference types
export interface SecondaryMuscle {
  muscle: string;
}

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
  secondary_muscles: SecondaryMuscle[];
}

export interface FoodReference {
  title: string;
  image: string;
  category: string;
  description: string;
  nutrition_per_100g: Nutrition;
}

export interface PerformanceEntry {
  weight: number;
  reps: number;
  date: string;
  logged?: boolean;
}

export interface References {
  exercises: {
    [key: string]: ExerciseReference;
  };
  foods: {
    [key: string]: FoodReference;
  };
  performance: {
    [key: string]: PerformanceEntry[];
  };
}

// Main response type
export interface LoginResponse {
  data: {
    membership: Membership;
    client: Client;
    plans: Plan[];
    references: References;
  };
}

// API Error Response
export interface APIError {
  message: string;
  code?: string;
  details?: unknown;
}

// Response types
export type APIResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: APIError;
};

// Exercise Performance types
export interface ExercisePerformance {
  weight: number;
  reps: number;
}

// Utility types
export type DayNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type DayKey = `day_${DayNumber}`;
export type PlanDay = Plan['days'][DayKey];
export type ExerciseType = RegularExercise | SupersetExercise;
export type PlanStatus = Plan['status'];