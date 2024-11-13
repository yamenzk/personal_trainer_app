// MealPlans.tsx

import { useState, useEffect } from "react";
import { Card, CardBody, Chip, cn, Progress } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Droplet, Waves, Lightbulb, ChevronDown } from "lucide-react";
import { usePlans } from '../hooks/usePlans';
import { format } from "date-fns";
import { useClientStore } from '@/stores/clientStore';
import { Food, FoodReference, Client, Plan } from '@/types';

// Component imports
import { MealPlanHero } from "@/components/meal/MealPlanHero";
import { PageTransition } from "@/components/shared/PageTransition";
import { MealCard } from "@/components/meal/MealCard";
import { TipCard } from "@/components/meal/TipCard";
import { NoMealsCard } from "@/components/meal/NoMealsCard";
import { FoodDetailsModal } from "@/components/meal/FoodDetailsModal";
import { MealPlanSkeleton } from "@/components/meal/MealPlanSkeleton";
import { insertNutritionTips, mealTimes } from "@/components/meal/utils";
import { MealContextualTip } from "@/components/meal/MealContextualTip";




// MealPlansContent component remains mostly the same, but uses imported components
const MealPlansContent = ({
  plans,
  references,
  currentDay,
}: {
  client: Client;
  plans: Plan[];
  references: any;
  currentDay: number | null;
}) => {
  const { activePlan, completedPlans } = usePlans(plans);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'active' | 'history'>('active');
  const [historicalPlanIndex, setHistoricalPlanIndex] = useState(0);
  const [selectedFood, setSelectedFood] = useState<{
    food: Food;
    foodRef: FoodReference;
    meal: string;
  } | null>(null);

  useEffect(() => {
    if (selectedDay === null && currentDay) {
      setSelectedDay(currentDay);
    }
  }, [currentDay, selectedDay]);

  const currentPlan = selectedPlan === 'active' ? activePlan : completedPlans[historicalPlanIndex];
  if (!currentPlan) return null;

  const dayKey = `day_${selectedDay}`;
  const dayPlan = currentPlan?.days[dayKey];
  
  const mealGroups = dayPlan?.foods?.reduce((acc: Record<string, Food[]>, food: Food) => {
    if (!acc[food.meal]) {
      acc[food.meal] = [];
    }
    acc[food.meal].push(food);
    return acc;
  }, {}) ?? {};

  const hasMeals = Object.keys(mealGroups).length > 0;
  const mealsWithTips = insertNutritionTips(Object.entries(mealGroups));

  return (
    <div className="min-h-screen w-full bg-transparent relative overflow-hidden">
      <div className="container mx-auto">
        {/* Hero Section - Full Width */}
        <div className="flex flex-col gap-4">
          <MealPlanHero
            plan={currentPlan}
            selectedDay={selectedDay || 1}
            onDaySelect={setSelectedDay}
            selectedPlan={selectedPlan}
            onPlanTypeChange={setSelectedPlan}
            completedPlansCount={completedPlans.length}
            completedPlans={completedPlans}
            historicalPlanIndex={historicalPlanIndex}
            onHistoricalPlanSelect={setHistoricalPlanIndex}
            foodRefs={references.foods} // Add this new prop
          />
          <MealContextualTip
            plan={currentPlan}
            selectedDay={selectedDay}
          />
        </div>

        {/* Centered Content Container */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <div className="px-4 mb-6">
              <WaterTargetCard waterTarget={currentPlan.targets.water} />
            </div>
            {/* Section Title */}
            {hasMeals && (
              <div className="px-4">
                <div className="flex items-center gap-4 my-6">
                  <div className="h-px flex-1 bg-content-secondary/10" />
                  <h2 className="text-xl font-semibold text-foreground/80 flex items-center gap-2">
                    <ChefHat className="w-5 h-5" />
                    Today's Menu
                  </h2>
                  <div className="h-px flex-1 bg-success/10" />
                </div>
              </div>
            )}

            {/* Meals and Tips */}
            <div className="space-y-4">
              <AnimatePresence>
                {hasMeals ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="space-y-6">
                      {mealsWithTips.map((item, index) => (
                        <motion.div
                          key={`${item.type}-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {item.type === 'tip' ? (
                            <div className="px-4">
                              <TipCard tip={item.content} />
                            </div>
                          ) : (
                            <div className="px-4">
                              <MealCard
                                meal={item.content[0]}
                                foods={item.content[1]}
                                foodRefs={references.foods}
                                mealTime={mealTimes[item.content[0]] || ''}
                                onFoodClick={(food: Food) => {
                                  setSelectedFood({
                                    food,
                                    foodRef: references.foods[food.ref],
                                    meal: item.content[0]
                                  });
                                }}
                              />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-meals"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="px-4"
                  >
                    <NoMealsCard />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Food Details Modal */}
        {selectedFood && (
          <FoodDetailsModal
            isOpen={!!selectedFood}
            onClose={() => setSelectedFood(null)}
            food={selectedFood.food}
            foodRef={selectedFood.foodRef}
            meal={selectedFood.meal}
          />
        )}
      </div>
    </div>
  );
};

const WaterTargetCard = ({ waterTarget }: { waterTarget: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const waterLiters = (parseFloat(waterTarget) / 1000).toFixed(1);
  const glasses = Math.round((parseFloat(waterTarget) / 250));
  
  // Calculate recommended consumption based on time of day
  const getCurrentTimeProgress = () => {
    const now = new Date();
    const currentHour = now.getHours();
    // Assume drinking period is between 7AM and 10PM (15 hours)
    const startHour = 7;
    const endHour = 22;
    const totalHours = endHour - startHour;
    
    if (currentHour < startHour) return 0;
    if (currentHour >= endHour) return 1;
    
    const progress = (currentHour - startHour) / totalHours;
    return progress;
  };

  const recommendedAmount = (parseFloat(waterTarget) * getCurrentTimeProgress()).toFixed(0);
  const recommendedLiters = (parseFloat(recommendedAmount) / 1000).toFixed(1);
  const currentTime = format(new Date(), 'h:mm a');

  return (
    <Card 
      isPressable
      onPress={() => setIsExpanded(!isExpanded)}
      className={cn(
        "border-none w-full transition-all duration-500",
        "bg-gradient-to-br from-blue-500/50 via-blue-500/50 to-sky-500",
        "hover:shadow-lg hover:from-blue-500/60 hover:to-sky-500/60",
        "group"
      )}
    >
      <CardBody className={cn(
        "p-5",
        "transition-all duration-300",
        isExpanded ? "pb-6" : "pb-5"
      )}>
        {/* Background animations */}
        <div className="absolute inset-0 overflow-hidden rounded-large">
          <motion.div
            className="absolute inset-x-0 bottom-0 h-32 opacity-20"
            style={{
              background: "linear-gradient(to bottom, #38bdf8, #0ea5e900)"
            }}
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
          {/* Enhanced bubble animations when expanded */}
          {isExpanded && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-blue-500/20"
                  style={{
                    width: Math.random() * 20 + 10,
                    height: Math.random() * 20 + 10,
                    left: `${Math.random() * 100}%`,
                    filter: "blur(1px)"
                  }}
                  initial={{ 
                    y: 200, 
                    opacity: 0,
                    scale: 0.8
                  }}
                  animate={{
                    y: [-20, -100],
                    opacity: [0, 1, 0],
                    scale: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: Math.random() * 3 + 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </>
          )}
        </div>

        <div className="relative">
          {/* Header - Always visible */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Enhanced icon animation */}
              <motion.div
                className={cn(
                  "p-2 rounded-lg bg-blue-500/20",
                  "transition-all duration-300 group-hover:bg-blue-500/30"
                )}
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  animate={{
                    y: [0, -1, 0],
                    rotate: [0, -3, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut"
                  }}
                >
                  <Droplet className="w-5 h-5 text-blue-500" />
                </motion.div>
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold">Daily Water Target</h3>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Waves className="w-4 h-4" />
                  <span className="text-sm">{waterLiters}L</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Chip
                variant="flat"
                className="bg-blue-500/10"
                startContent={<Waves className="w-3 h-3" />}
              >
                {glasses} glasses
              </Chip>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-white-500" />
              </motion.div>
            </div>
          </div>

          {/* Expandable Content */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {/* Progress section */}
                <div className="space-y-3 mt-4">
                  <Progress
                    aria-label="Water progress"
                    value={getCurrentTimeProgress() * 100}
                    className="h-3"
                    classNames={{
                      indicator: "bg-gradient-to-r from-blue-500 to-cyan-400",
                      track: "bg-blue-500/10",
                    }}
                  />
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1.5 text-default-600">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>By {currentTime} aim for {recommendedLiters}L</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-default-600">
                      <div className="w-2 h-2 rounded-full bg-blue-500/40" />
                      <span>Daily target: {waterLiters}L</span>
                    </div>
                  </div>
                </div>

                {/* Tip section */}
                <div className="mt-4 flex items-start gap-2 p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
                  <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-default-600">
                    Try spreading your water intake throughout the day. Aim for {(parseFloat(waterTarget) / (15 * 1000)).toFixed(1)}L every hour between 7AM and 10PM.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardBody>
    </Card>
  );
};

// Main export remains the same
export default function MealPlans() {
  const client = useClientStore(state => state.client);
  const plans = useClientStore(state => state.plans);
  const references = useClientStore(state => state.references);
  const isLoading = useClientStore(state => state.isLoading);
  const error = useClientStore(state => state.error);
  const { currentDay } = usePlans(plans ?? []);

  return (
    <PageTransition
      loading={isLoading}
      error={error}
      skeleton={<MealPlanSkeleton />}
    >
      {client && references && (
        <MealPlansContent
          client={client}
          plans={plans ?? []}
          references={references}
          currentDay={currentDay}
        />
      )}
    </PageTransition>
  );
}