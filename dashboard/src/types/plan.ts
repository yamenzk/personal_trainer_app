// src/types/plan.ts
import { Exercise } from "./workout";
import { Food } from "./meal";
import { NutritionInfo } from "./meal";

export interface PlanTargets {
    proteins: string;
    carbs: string;
    fats: string;
    energy: string;
    water: string;
  }
  
  export interface PlanConfig {
    equipment: 'Gym' | 'Home';
    goal: string;
    weekly_workouts: string;
    daily_meals: string;
  }
  
  export interface DayPlan {
    exercises: Exercise[];
    foods: Food[];
    totals: NutritionInfo;
    completed?: boolean; // Added to track day completion
  }
  
  export interface Plan {
    plan_name: string;
    start: string;
    end: string;
    targets: PlanTargets;
    config: PlanConfig;
    status: 'Scheduled' | 'Active' | 'Completed';
    days: {
      [key: string]: DayPlan;
    };
  }