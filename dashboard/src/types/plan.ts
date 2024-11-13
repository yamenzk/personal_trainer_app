// src/types/plan.ts

import { Exercise } from './workout';
import { Food } from './nutrition';
import { NutritionInfo } from './nutrition';

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
  completed?: boolean;
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


export interface Referral {
  name: string;
  client_name: string;
  image: string;
}

export interface ContextualTipProps {
  plan: Plan;
  selectedDay: number | null;
  completedWorkouts: number;
  totalWorkouts: number;
  streak: number;
}

export interface PlanHeroProps {
  plan: Plan;
  selectedDay: number | null;
  currentDay: number | null;
  onDaySelect: (day: number) => void;
  selectedPlan: 'active' | 'history';
  onPlanTypeChange: (key: 'active' | 'history') => void;
  completedPlansCount: number;
  completedPlans: Plan[];
  historicalPlanIndex: number;
  onHistoricalPlanSelect: (index: number) => void;
}

export interface UsePlansReturn {
  activePlan: Plan | null;
  completedPlans: Plan[];
  scheduledPlans: Plan[];
  currentDay: number;
}