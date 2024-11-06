// src/types/client.ts
export interface Weight {
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
  client_name: string | null;
  date_of_birth: string;
  age: string;
  gender: 'Male' | 'Female';
  mobile: string | null;
  email: string;
  nationality: string;
  referred_by: string | null;
  allow_preference_update: number;
  blocked_foods: string | null;
  goal: 'Weight Loss' | 'Weight Gain' | 'Muscle Building' | 'Maintenance';
  target_weight: number;
  meals: number;
  workouts: number;
  equipment: 'Gym' | 'Home';
  activity_level: 'Sedentary' | 'Light' | 'Moderate' | 'Very Active' | 'Extra Active';
  height: number;
  request_weight: number;
  adjust_factor: number;
  factor: number;
  adjust: number;
  last_update: string | null;
  
  // Achievement and Stats Tracking
  total_exercises_completed: number;
  total_sets_played: number;
  total_reps_played: number;
  total_calories_burned: number;
  
  // Muscle Group Stats
  total_chest_exercises: number;
  total_shoulders_exercises: number;
  total_biceps_exercises: number;
  total_hamstrings_exercises: number;
  total_traps_exercises: number;
  total_triceps_exercises: number;
  total_lats_exercises: number;
  total_glutes_exercises: number;
  
  // One-time Achievements
  personal_record_setter: number;
  stress_buster: number;
  bmi_boss: number;
  first_kilo_lost: number;
  halfway_there: number;
  total_transformation: number;
  level_up: number;
  first_step: number;
  rise_and_grind: number;
  night_owl: number;

  doctype: string;
  weight: Weight[];
  current_weight: number;
}
