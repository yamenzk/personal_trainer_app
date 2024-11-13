// src/types/nutrition.ts

import { LucideIcon } from 'lucide-react';
import { Plan } from './plan';

export interface Nutrition {
  value: number;
  unit: string;
}

export interface NutritionInfo {
  energy: Nutrition;
  carbs: Nutrition;
  protein: Nutrition;
  fat: Nutrition;
}

export interface Food {
  meal: string;
  ref: string;
  amount: string;
  nutrition: NutritionInfo;
}

export interface FoodReference {
  title: string;
  image: string;
  category: string;
  description: string;
  nutrition_per_100g: NutritionInfo;
}

export interface MealTime {
  time: string;
  meal: string;
}

export type NutritionTipType = 'nutrition' | 'hydration' | 'portion' | 'timing' | 'mindset' | 'planning';

export interface NutritionTip {
  icon: LucideIcon;
  title: string;
  message: string;
  type: NutritionTipType;
  emoji: string;
}

export interface WithMealContent {
  type: 'meal';
  content: [string, Food[]];
}

export interface WithTipContent {
  type: 'tip';
  content: NutritionTip;
}

export type MealOrTipItem = WithMealContent | WithTipContent;

export interface GroceryListModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: Plan;
    foodRefs: Record<string, any>;
    isPastPlan?: boolean;
    weekNumber?: number;
  }

  export interface FoodDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    food: Food;
    foodRef: FoodReference;
    meal: string;
  }

  export interface MealContextualTipProps {
    plan: Plan;
    selectedDay: number | null;
  }

  export interface MealPlanHeroProps {
    plan: Plan;
    selectedDay: number | null;
    onDaySelect: (day: number) => void;
    selectedPlan: 'active' | 'history';
    onPlanTypeChange: (key: 'active' | 'history') => void;
    completedPlansCount: number;
    completedPlans: Plan[];
    historicalPlanIndex: number;
    onHistoricalPlanSelect: (index: number) => void;
    foodRefs: Record<string, any>; // Add this new prop
  }

  export interface NutritionTipProps {
    plan: Plan;
    selectedDay: number | null;
  }