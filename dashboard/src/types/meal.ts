// src/types/meal.ts
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