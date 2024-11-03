// src/pages/MealPlans.tsx
import { useState } from 'react';
import { Card, CardHeader, Tabs, Tab, Button, Divider } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useClientData } from '../hooks/useClientData';
import { usePlans } from '../hooks/usePlans';
import FoodCard from '../components/meal/FoodCard';
import NutritionSummary from '../components/meal/NutritionSummary';

export default function MealPlans() {
  const { loading, error, client, plans, references } = useClientData();
  const { activePlan, completedPlans, currentDay } = usePlans(plans);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [selectedPlan, setSelectedPlan] = useState<'active' | 'history'>('active');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-foreground/60">Loading your meal plans...</p>
        </div>
      </div>
    );
  }

  if (error || !client || !references) {
    return (
      <div className="text-center text-danger">
        {error || 'Failed to load meal plans'}
      </div>
    );
  }

  const currentPlan = selectedPlan === 'active' ? activePlan : completedPlans[0];
  const dayPlan = currentPlan?.days[`day_${selectedDay}`];
  
  // Group foods by meal
  const meals = dayPlan?.foods.reduce((acc, food) => {
    if (!acc[food.meal]) {
      acc[food.meal] = [];
    }
    acc[food.meal].push(food);
    return acc;
  }, {} as Record<string, typeof dayPlan.foods>) ?? {};

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Tabs
          selectedKey={selectedPlan}
          onSelectionChange={(key) => setSelectedPlan(key as 'active' | 'history')}
        >
          <Tab key="active" title="Current Plan" />
          <Tab 
            key="history" 
            title="History"
            isDisabled={completedPlans.length === 0}
          />
        </Tabs>
      </motion.div>
  
      {currentPlan ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <div className="w-full flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{currentPlan.plan_name}</h2>
                  <p className="text-sm text-foreground/60">
                    {currentPlan.start} - {currentPlan.end}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={() => setSelectedDay(prev => Math.max(1, prev - 1))}
                    isDisabled={selectedDay === 1}
                  >
                    <ChevronLeft size={20} />
                  </Button>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10">
                    <Calendar size={18} className="text-primary" />
                    <span>Day {selectedDay}</span>
                  </div>
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={() => setSelectedDay(prev => Math.min(7, prev + 1))}
                    isDisabled={selectedDay === 7}
                  >
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(meals).map(([mealName, foods]) => (
                <div key={mealName} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold">{mealName}</h3>
                    <Divider className="flex-1" />
                  </div>
                  <div className="space-y-4">
                    {foods.map((food) => (
                      <FoodCard
                        key={food.ref}
                        foodRef={food.ref}
                        amount={food.amount}
                        meal={food.meal}
                        nutrition={food.nutrition}
                        details={references.foods[food.ref]}
                        dailyTargets={currentPlan.targets}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
  
            <div className="lg:sticky lg:top-20">
              <NutritionSummary
                totals={dayPlan?.totals ?? {
                  energy: { value: 0, unit: 'kcal' },
                  protein: { value: 0, unit: 'g' },
                  carbs: { value: 0, unit: 'g' },
                  fat: { value: 0, unit: 'g' }
                }}
                targets={currentPlan.targets}
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center py-12"
        >
          <p className="text-foreground/60">No meal plan available</p>
        </motion.div>
      )}
    </div>
  );
  
}