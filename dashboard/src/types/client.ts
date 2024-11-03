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
    client_name: string;
    date_of_birth: string;
    age: string;
    gender: 'Male' | 'Female';
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
    equipment: 'Gym' | 'Home';
    activity_level: 'Sedentary' | 'Light' | 'Moderate' | 'Very Active' | 'Extra Active';
    height: number;
    request_weight: number;
    adjust_factor: number;
    factor: number;
    adjust: number;
    last_update: string | null;
    doctype: string;
    weight: Weight[];
    current_weight: number;
  }