// src/components/food/FoodDetailModal.tsx
import React from 'react';
import { 
    X, 
    Scale, 
    Apple, 
    PieChart, 
    Info,
    Flame, // For calories
    Beef, // For protein
    Wheat, // For carbs
    Droplet // For fats
  } from 'lucide-react';
import type { FoodReference, NutritionValue } from '@/types/api';

interface FoodDetailModalProps {
  food: {
    ref: string;
    amount: string;
    nutrition: {
      energy: NutritionValue;
      protein: NutritionValue;
      carbs: NutritionValue;
      fat: NutritionValue;
    };
  };
  foodReference: FoodReference;
  isOpen: boolean;
  onClose: () => void;
}

const NutritionBar: React.FC<{
  label: string;
  value: number;
  maxValue: number;
  color: string;
}> = ({ label, value, maxValue, color }) => {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-300">{label}</span>
        <span className="font-medium">{value}g</span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${Math.min(100, percentage)}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
};

const MacroCircle: React.FC<{
  percentage: number;
  label: string;
  value: number;
  color: string;
}> = ({ percentage, label, value, color }) => (
  <div className="flex flex-col items-center">
    <div className="relative w-20 h-20">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r="36"
          strokeWidth="8"
          fill="none"
          className="text-gray-100 dark:text-gray-700"
          stroke="currentColor"
        />
        <circle
          cx="40"
          cy="40"
          r="36"
          strokeWidth="8"
          fill="none"
          stroke={color}
          strokeDasharray={`${percentage * 2.26} 1000`}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-lg font-semibold">{value}g</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
    <span className="mt-2 text-sm font-medium">{label}</span>
  </div>
);

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  food,
  foodReference,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const totalMacros = 
    food.nutrition.protein.value + 
    food.nutrition.carbs.value + 
    food.nutrition.fat.value;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl shadow-xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 bg-gray-700 top-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header with image */}
          <div className="relative h-48 rounded-t-3xl overflow-hidden">
            <img
              src={foodReference.image}
              alt={foodReference.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h2 className="text-2xl font-bold text-white">
                {foodReference.title}
              </h2>
              <p className="text-white/80 mt-1">
                {foodReference.category}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Scale className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Portion</p>
                  <p className="font-medium">{food.amount}g</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <PieChart className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Calories</p>
                  <p className="font-medium">{Math.round(food.nutrition.energy.value)} kcal</p>
                </div>
              </div>
            </div>

            {/* Macronutrient Distribution */}
            <div>
              <h3 className="text-lg font-medium mb-4">Macronutrients</h3>
              <div className="flex justify-around">
                <MacroCircle
                  label="Protein"
                  value={Math.round(food.nutrition.protein.value)}
                  percentage={(food.nutrition.protein.value / totalMacros) * 100}
                  color="#ef4444"
                />
                <MacroCircle
                  label="Carbs"
                  value={Math.round(food.nutrition.carbs.value)}
                  percentage={(food.nutrition.carbs.value / totalMacros) * 100}
                  color="#22c55e"
                />
                <MacroCircle
                  label="Fats"
                  value={Math.round(food.nutrition.fat.value)}
                  percentage={(food.nutrition.fat.value / totalMacros) * 100}
                  color="#eab308"
                />
              </div>
            </div>

            {/* Nutrition Bars */}
            {/* <div>
              <h3 className="text-lg font-medium mb-4">Nutrition Details</h3>
              <div className="space-y-4">
                <NutritionBar
                  label="Protein"
                  value={Math.round(food.nutrition.protein.value)}
                  maxValue={totalMacros}
                  color="#3B82F6"
                />
                <NutritionBar
                  label="Carbohydrates"
                  value={Math.round(food.nutrition.carbs.value)}
                  maxValue={totalMacros}
                  color="#10B981"
                />
                <NutritionBar
                  label="Fats"
                  value={Math.round(food.nutrition.fat.value)}
                  maxValue={totalMacros}
                  color="#F59E0B"
                />
              </div>
            </div> */}

            {/* Food Description */}
            <div className="flex items-start space-x-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <Info className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium">About this food</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {foodReference.description}
                </p>
              </div>
            </div>

            {/* Base Nutrition */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium mb-2">Nutrition per 100g</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Energy</p>
                  <p className="font-medium">
                    {foodReference.nutrition_per_100g.energy.value} kcal
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Protein</p>
                  <p className="font-medium">
                    {foodReference.nutrition_per_100g.protein.value}g
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Carbohydrates</p>
                  <p className="font-medium">
                    {foodReference.nutrition_per_100g.carbs.value}g
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Fats</p>
                  <p className="font-medium">
                    {foodReference.nutrition_per_100g.fat.value}g
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};