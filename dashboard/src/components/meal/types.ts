
import { Food } from "@/types/meal";
import type { LucideIcon } from "lucide-react";

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

// ...add any other shared types from MealPlans.tsx...