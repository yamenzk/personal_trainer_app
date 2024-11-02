// src/pages/MealPlans/index.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { 
  PieChart,
  Utensils,
  Flame,
  Beef,
  Wheat,
  Droplet
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { LoadingScreen } from '@/components/ui/loading';
import { PageHeader } from '@/components/layout/PageHeader';
import type { FoodItem, FoodReference } from '@/types/api';
import { FoodDetailModal } from '@/components/food/FoodDetailModal';

interface DayTabProps {
  date: Date;
  isActive: boolean;
  onClick: () => void;
}

const DayTab: React.FC<DayTabProps> = ({ date, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center py-2 px-4 rounded-xl transition-colors ${
      isActive 
        ? 'bg-blue-500 text-white' 
        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
    }`}
  >
    <span className="text-xs font-medium">
      {date.toLocaleDateString('en-US', { weekday: 'short' })}
    </span>
    <span className="text-lg font-semibold">
      {date.getDate()}
    </span>
  </button>
);

const MacroCircle: React.FC<{
  percentage: number;
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}> = ({ percentage, label, value, color, icon }) => (
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
        {icon}
        <span className="text-sm font-semibold mt-1">{Math.round(value)}g</span>
      </div>
    </div>
    <span className="mt-2 text-sm font-medium">{label}</span>
  </div>
);

const MealCard: React.FC<{
  title: string;
  foods: FoodItem[];
  references: Record<string, FoodReference>;
  onFoodClick: (food: FoodItem) => void;
}> = ({ title, foods, references, onFoodClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalNutrition = useMemo(() => {
    return foods.reduce((acc, food) => ({
      energy: acc.energy + (food?.nutrition?.energy?.value || 0),
      protein: acc.protein + (food?.nutrition?.protein?.value || 0),
      carbs: acc.carbs + (food?.nutrition?.carbs?.value || 0),
      fat: acc.fat + (food?.nutrition?.fat?.value || 0)
    }), { energy: 0, protein: 0, carbs: 0, fat: 0 });
  }, [foods]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
      {/* Meal Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Utensils className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">{title}</h3>
            <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span>{foods.length} items</span>
              <span>•</span>
              <div className="flex items-center">
                <Flame className="w-4 h-4 mr-1 text-orange-500" />
                {Math.round(totalNutrition.energy)} kcal
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* Food List */}
      {isExpanded && (
        <div className="border-t border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {foods.map((food, index) => {
            const foodRef = references[food.ref];
            return (
              <button
                key={`${food.ref}-${index}`}
                onClick={() => onFoodClick(food)}
                className="w-full p-4 flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <img
                  src={foodRef.image}
                  alt={foodRef.title}
                  className="w-16 h-16 rounded-lg object-cover bg-gray-100 dark:bg-gray-700 flex-shrink-0"
                />
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="font-medium truncate">{foodRef.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {food.amount}g
                  </p>
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="flex items-center text-xs text-orange-500">
                      <Flame className="w-3.5 h-3.5 mr-0.5" />
                      <span>{Math.round(food.nutrition.energy.value)} kcal</span>
                    </div>
                    <div className="flex items-center text-xs text-red-500">
                      <Beef className="w-3.5 h-3.5 mr-0.5" />
                      <span>{Math.round(food.nutrition.protein.value)}g</span>
                    </div>
                    <div className="flex items-center text-xs text-green-500">
                      <Wheat className="w-3.5 h-3.5 mr-0.5" />
                      <span>{Math.round(food.nutrition.carbs.value)}g</span>
                    </div>
                    <div className="flex items-center text-xs text-yellow-500">
                      <Droplet className="w-3.5 h-3.5 mr-0.5" />
                      <span>{Math.round(food.nutrition.fat.value)}g</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const MealPlans: React.FC = () => {
  const { plans, references } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  // Initialize selected plan to active plan or latest plan
  useEffect(() => {
    if (plans.length > 0) {
      const activePlan = plans.find(plan => plan.status === 'Active');
      if (activePlan) {
        setSelectedPlanId(activePlan.plan_name);
        setSelectedDate(new Date(activePlan.start));
      } else {
        const latestPlan = plans.reduce((latest, current) => 
          new Date(current.start) > new Date(latest.start) ? current : latest
        );
        setSelectedPlanId(latestPlan.plan_name);
        setSelectedDate(new Date(latestPlan.start));
      }
    }
  }, [plans]);

  const selectedPlan = useMemo(() => 
    plans.find(plan => plan.plan_name === selectedPlanId),
    [plans, selectedPlanId]
  );

  if (!selectedPlan || !references) return <LoadingScreen />;

  const startDate = new Date(selectedPlan.start);
  const dayNumber = Math.floor((selectedDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const dayKey = `day_${dayNumber + 1}` as keyof typeof selectedPlan.days;
  const selectedDayPlan = selectedPlan.days[dayKey];

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });

  // Group foods by meal
  const mealGroups = selectedDayPlan?.foods.reduce((acc, food) => {
    if (!acc[food.meal]) {
      acc[food.meal] = [];
    }
    acc[food.meal].push(food);
    return acc;
  }, {} as Record<string, FoodItem[]>) ?? {};

  // Calculate daily totals
  const dailyTotals = selectedDayPlan?.totals ?? {
    energy: { value: 0, unit: 'kcal' },
    protein: { value: 0, unit: 'g' },
    carbs: { value: 0, unit: 'g' },
    fat: { value: 0, unit: 'g' }
  };

  const totalMacros = dailyTotals.protein.value + dailyTotals.carbs.value + dailyTotals.fat.value;
  const macroPercentages = {
    protein: (dailyTotals.protein.value / totalMacros) * 100,
    carbs: (dailyTotals.carbs.value / totalMacros) * 100,
    fat: (dailyTotals.fat.value / totalMacros) * 100,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Plan Selector */}
      <PageHeader
        title="Meal Plan"
        selectedPlan={selectedPlan}
        plans={plans}
        onPlanChange={setSelectedPlanId}
      />

      {/* Week Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto py-2 scrollbar-hide">
        {weekDates.map((date) => (
          <DayTab
            key={date.toISOString()}
            date={date}
            isActive={date.toDateString() === selectedDate.toDateString()}
            onClick={() => setSelectedDate(date)}
          />
        ))}
      </div>

      {/* Daily Nutrition Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium">Daily Nutrition</h2>
          <div className="flex items-center space-x-2 text-sm">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-gray-600 dark:text-gray-300">
              {Math.round(dailyTotals.energy.value)} kcal
            </span>
          </div>
        </div>
        <div className="flex justify-between">
          <MacroCircle
            label="Protein"
            value={dailyTotals.protein.value}
            percentage={macroPercentages.protein}
            color="#EF4444"
            icon={<Beef className="w-5 h-5 text-red-500" />}
          />
          <MacroCircle
            label="Carbs"
            value={dailyTotals.carbs.value}
            percentage={macroPercentages.carbs}
            color="#22C55E"
            icon={<Wheat className="w-5 h-5 text-green-500" />}
          />
          <MacroCircle
            label="Fats"
            value={dailyTotals.fat.value}
            percentage={macroPercentages.fat}
            color="#F59E0B "
            icon={<Droplet className="w-5 h-5 text-yellow-500" />}
          />
        </div>

        {/* Targets Comparison */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Target Calories</span>
              <span className="font-medium">{selectedPlan.targets.energy} kcal</span>
            </div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Water Target</span>
              <span className="font-medium">{selectedPlan.targets.water} ml</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meals List */}
      {Object.entries(mealGroups).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(mealGroups).map(([meal, foods]) => (
            <MealCard
              key={meal}
              title={meal}
              foods={foods}
              references={references.foods}
              onFoodClick={setSelectedFood}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No meals planned for this day
          </p>
        </div>
      )}

      {/* Food Detail Modal */}
      {selectedFood && (
        <FoodDetailModal
          food={selectedFood}
          foodReference={references.foods[selectedFood.ref]}
          isOpen={!!selectedFood}
          onClose={() => setSelectedFood(null)}
        />
      )}
    </div>
  );
};

export default MealPlans;