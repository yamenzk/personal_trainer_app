import { useEffect, useState } from 'react';
import { 
  Button, 
  Progress,
  Chip,
  Tooltip,
  Tabs,
  Tab,
  cn,
} from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Utensils,
  Calendar,
  Clock,
  Target,
  Scale,
  Apple,
  Beef,
  Wheat,
  Droplet,
  ScrollText,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Coffee,
  Cookie,
  Sandwich,
  UtensilsCrossed,
  Soup,
  CircleDollarSign,
  Info,
  Flame,
  BarChart3,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useClientData } from '../hooks/useClientData';
import { usePlans } from '../hooks/usePlans';
import { GlassCard } from '../components/shared/GlassCard';
import { useNavigate } from 'react-router-dom';
import { Food, FoodReference, NutritionInfo } from '../types/meal';
import { calculatePlanProgress } from '../utils/api';

// Types
interface MealCardProps {
  meal: string;
  foods: Food[];
  references: { [key: string]: FoodReference };
  dailyTargets: {
    proteins: string;
    carbs: string;
    fats: string;
    energy: string;
  };
}

interface FoodItemProps {
  food: Food;
  details: FoodReference;
  dailyTargets: {
    proteins: string;
    carbs: string;
    fats: string;
    energy: string;
  };
}

interface NutritionChartProps {
  current: NutritionInfo;
  target: {
    proteins: string;
    carbs: string;
    fats: string;
    energy: string;
  };
}

// Helper Components
const WeekDayButton = ({ 
  day, 
  date, 
  isSelected, 
  isCompleted, 
  isCurrent, 
  onClick,
  meals = 0,
}: {
  day: number;
  date: Date;
  isSelected: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  onClick: () => void;
  meals?: number;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "group relative flex flex-col items-center justify-center w-full gap-1",
      "h-24 rounded-xl transition-all duration-200",
      "hover:scale-105 active:scale-95",
      isSelected 
        ? "bg-primary-500/20 border-2 border-primary-500" 
        : isCompleted 
          ? "bg-success-500/10 border border-success-500/20" 
          : "bg-content/5 border border-border hover:border-content",
    )}
  >
    <span className="text-xs text-foreground/60 group-hover:text-foreground">
      {format(date, 'EEE')}
    </span>
    <span className={cn(
      "text-xl font-semibold",
      isCurrent ? "text-primary-500" : "text-foreground"
    )}>
      {format(date, 'd')}
    </span>
    <div className="flex items-center gap-1">
      {Array.from({ length: meals }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            isCompleted 
              ? "bg-success-500" 
              : isCurrent 
                ? "bg-primary-500" 
                : "bg-foreground/20"
          )}
        />
      ))}
    </div>
  </button>
);

const NutritionChart: React.FC<NutritionChartProps> = ({ current, target }) => {
  const calculatePercentage = (value: number, targetValue: string) => {
    return Math.min(100, (value / parseFloat(targetValue)) * 100);
  };

  const nutrients = [
    {
      name: 'Calories',
      current: current.energy.value,
      target: parseFloat(target.energy),
      unit: 'kcal',
      color: 'primary',
      icon: Flame
    },
    {
      name: 'Protein',
      current: current.protein.value,
      target: parseFloat(target.proteins),
      unit: 'g',
      color: 'success',
      icon: Beef
    },
    {
      name: 'Carbs',
      current: current.carbs.value,
      target: parseFloat(target.carbs),
      unit: 'g',
      color: 'warning',
      icon: Wheat
    },
    {
      name: 'Fat',
      current: current.fat.value,
      target: parseFloat(target.fats),
      unit: 'g',
      color: 'danger',
      icon: Droplet
    }
  ];

  return (
    <div className="space-y-4">
      {nutrients.map((nutrient) => (
        <div key={nutrient.name} className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg bg-${nutrient.color}-500/10`}>
                <nutrient.icon className={`w-4 h-4 text-${nutrient.color}-500`} />
              </div>
              <span className="text-sm font-medium">{nutrient.name}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">
                {Math.round(nutrient.current)}
              </span>
              <span className="text-foreground/60">
                /{Math.round(nutrient.target)} {nutrient.unit}
              </span>
            </div>
          </div>
          <div className="relative h-2 w-full bg-content/10 rounded-full overflow-hidden">
            <div
              className={cn(
                "absolute h-full left-0 top-0 rounded-full transition-all duration-300",
                `bg-${nutrient.color}-500`
              )}
              style={{
                width: `${calculatePercentage(nutrient.current, nutrient.target.toString())}%`
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const getMealIcon = (meal: string) => {
  const mealLower = meal.toLowerCase();
  if (mealLower.includes('breakfast')) return Coffee;
  if (mealLower.includes('snack')) return Cookie;
  if (mealLower.includes('lunch')) return Sandwich;
  if (mealLower.includes('dinner')) return UtensilsCrossed;
  return Soup;
};

const FoodItem: React.FC<FoodItemProps> = ({ food, details, dailyTargets }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const calculatePercentage = (value: number, targetValue: string) => {
    return Math.round((value / parseFloat(targetValue)) * 100);
  };

  return (
    <GlassCard 
      gradient="from-content/5 to-background"
      className="transition-all duration-300 hover:shadow-lg"
    >
      <div className="p-4 space-y-4">
        {/* Food Header */}
        <div className="flex items-start gap-4">
          <img
            src={details.image}
            alt={details.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{details.title}</h4>
                <p className="text-sm text-foreground/60">{details.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <Chip 
                  size="sm" 
                  className="bg-primary-500/10"
                  startContent={<Scale size={14} className="text-primary-500" />}
                >
                  {food.amount}g
                </Chip>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-2 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Chip
                    className="bg-primary-500/10 justify-between"
                    startContent={<Flame size={14} className="text-primary-500" />}
                  >
                    <span className="text-sm">
                      {Math.round(food.nutrition.energy.value)} kcal
                    </span>
                  </Chip>
                  <Chip
                    className="bg-success-500/10 justify-between"
                    startContent={<Beef size={14} className="text-success-500" />}
                  >
                    <span className="text-sm">
                      {Math.round(food.nutrition.protein.value)}g protein
                    </span>
                  </Chip>
                  <Chip
                    className="bg-warning-500/10 justify-between"
                    startContent={<Wheat size={14} className="text-warning-500" />}
                  >
                    <span className="text-sm">
                      {Math.round(food.nutrition.carbs.value)}g carbs
                    </span>
                  </Chip>
                  <Chip
                    className="bg-danger-500/10 justify-between"
                    startContent={<Droplet size={14} className="text-danger-500" />}
                  >
                    <span className="text-sm">
                      {Math.round(food.nutrition.fat.value)}g fat
                    </span>
                  </Chip>
                </div>

                {details.description && (
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    {details.description}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};

const MealCard: React.FC<MealCardProps> = ({ 
  meal, 
  foods, 
  references,
  dailyTargets 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const Icon = getMealIcon(meal);

  // Calculate meal totals
  const totals = foods.reduce((acc, food) => ({
    energy: { 
      value: acc.energy.value + food.nutrition.energy.value,
      unit: food.nutrition.energy.unit 
    },
    protein: { 
      value: acc.protein.value + food.nutrition.protein.value,
      unit: food.nutrition.protein.unit 
    },
    carbs: { 
      value: acc.carbs.value + food.nutrition.carbs.value,
      unit: food.nutrition.carbs.unit 
    },
    fat: { 
      value: acc.fat.value + food.nutrition.fat.value,
      unit: food.nutrition.fat.unit 
    }
  }), {
    energy: { value: 0, unit: 'kcal' },
    protein: { value: 0, unit: 'g' },
    carbs: { value: 0, unit: 'g' },
    fat: { value: 0, unit: 'g' }
  });

  return (
    <GlassCard gradient="from-primary-500/5 to-background">
      <div className="space-y-4">
        {/* Meal Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-500/10">
              <Icon className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <h3 className="font-semibold">{meal}</h3>
              <p className="text-sm text-foreground/60">
                {foods.length} items • {Math.round(totals.energy.value)} kcal
              </p>
            </div>
          </div>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </Button>
        </div>

        {/* Meal Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-4">
                {/* Nutrition Summary */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-2 rounded-lg bg-primary-500/5">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-primary-500" />
                      <span className="text-xs text-foreground/60">Calories</span>
                    </div>
                    <p className="font-medium mt-1">
                      {Math.round(totals.energy.value)} kcal
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-success-500/5">
                    <div className="flex items-center gap-2">
                      <Beef className="w-4 h-4 text-success-500" />
                      <span className="text-xs text-foreground/60">Protein</span>
                    </div>
                    <p className="font-medium mt-1">
                      {Math.round(totals.protein.value)}g
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-warning-500/5">
                  <div className="flex items-center gap-2">
                      <Wheat className="w-4 h-4 text-warning-500" />
                      <span className="text-xs text-foreground/60">Carbs</span>
                    </div>
                    <p className="font-medium mt-1">
                      {Math.round(totals.carbs.value)}g
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-danger-500/5">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-danger-500" />
                      <span className="text-xs text-foreground/60">Fat</span>
                    </div>
                    <p className="font-medium mt-1">
                      {Math.round(totals.fat.value)}g
                    </p>
                  </div>
                </div>

                {/* Food List */}
                <div className="space-y-3">
                  {foods.map((food, index) => (
                    <FoodItem
                      key={`${food.ref}-${index}`}
                      food={food}
                      details={references[food.ref]}
                      dailyTargets={dailyTargets}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};

// Main Component
export default function MealPlans() {
  const navigate = useNavigate();
  const { loading, error, client, plans, references, refreshData } = useClientData();
  const { activePlan, completedPlans, currentDay } = usePlans(plans ?? []);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [selectedPlan, setSelectedPlan] = useState<'active' | 'history'>('active');

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          </div>
          <div className="text-foreground/60 font-medium">Loading your meal plan...</div>
        </div>
      </div>
    );
  }

  if (error || !client || !references) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <GlassCard className="max-w-md w-full p-6 text-center space-y-4 bg-danger/10">
          <div className="w-16 h-16 rounded-full bg-danger/20 text-danger mx-auto flex items-center justify-center">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-semibold text-danger">Error Loading Plans</h3>
          <p className="text-danger/80">{error || 'Failed to load meal data'}</p>
          <Button 
            color="danger" 
            variant="flat" 
            onPress={() => window.location.reload()}
          >
            Try Again
          </Button>
        </GlassCard>
      </div>
    );
  }

  const currentPlan = selectedPlan === 'active' ? activePlan : completedPlans[0];
  if (!currentPlan) return null;

  const dayKey = `day_${selectedDay}`;
  const dayPlan = currentPlan?.days[dayKey];
  const planProgress = calculatePlanProgress(currentPlan);

  // Group foods by meal
  const mealGroups = dayPlan?.foods.reduce((acc, food) => {
    if (!acc[food.meal]) {
      acc[food.meal] = [];
    }
    acc[food.meal].push(food);
    return acc;
  }, {} as Record<string, typeof dayPlan.foods>) ?? {};

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] 
          bg-gradient-to-b from-primary-500/20 via-secondary-500/20 to-transparent 
          blur-3xl opacity-50" 
        />
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      <div className="container mx-auto p-4 space-y-6">
        {/* Header Section */}
        <GlassCard gradient="from-primary-500/10 via-background to-secondary-500/10">
          <div className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">Meal Plan</h1>
                <p className="text-foreground/60">
                  {format(new Date(currentPlan.start), 'MMM d')} - {format(new Date(currentPlan.end), 'MMM d, yyyy')}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10">
                  <Target className="w-5 h-5 text-primary-500" />
                  <span className="font-medium">
                    {Math.round(planProgress)}% Complete
                  </span>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success-500/10">
                  <Utensils className="w-5 h-5 text-success-500" />
                  <span className="font-medium">
                    {currentPlan.config.daily_meals} meals/day
                  </span>
                </div>
              </div>
            </div>

            <Tabs 
              selectedKey={selectedPlan} 
              onSelectionChange={(key) => setSelectedPlan(key as 'active' | 'history')}
              aria-label="Plan selection"
              classNames={{
                tabList: "gap-4 w-full relative rounded-lg p-1 bg-content/5",
                cursor: "bg-primary-500/20 rounded-lg",
                tab: "rounded-lg px-4 py-2 text-sm font-medium",
                tabContent: "group-data-[selected=true]:text-primary-500"
              }}
            >
              <Tab 
                key="active" 
                title={
                  <div className="flex items-center gap-2">
                    <Utensils size={16} />
                    <span>Current Plan</span>
                    {activePlan && (
                      <Chip size="sm" variant="flat" color="success">
                        {Math.round(planProgress)}%
                      </Chip>
                    )}
                  </div>
                }
              />
              <Tab 
                key="history" 
                title={
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>History</span>
                    {completedPlans.length > 0 && (
                      <Chip size="sm" variant="flat">
                        {completedPlans.length} plan{completedPlans.length !== 1 ? 's' : ''}
                      </Chip>
                    )}
                  </div>
                }
                isDisabled={completedPlans.length === 0}
              />
            </Tabs>
          </div>
        </GlassCard>

        {/* Week Calendar */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {Array.from({ length: 7 }, (_, i) => {
            const day = i + 1;
            const date = addDays(new Date(currentPlan.start), i);
            const dayMeals = Object.keys(currentPlan.days[`day_${day}`]?.foods.reduce((acc, food) => {
              acc[food.meal] = true;
              return acc;
            }, {} as Record<string, boolean>) ?? {}).length;
            
            return (
              <div className="flex-1 min-w-[100px]" key={day}>
                <WeekDayButton
                  day={day}
                  date={date}
                  isSelected={day === selectedDay}
                  isCompleted={false} // You might want to add a completion status for meals
                  isCurrent={day === currentDay}
                  onClick={() => setSelectedDay(day)}
                  meals={dayMeals}
                />
              </div>
            );
          })}
        </div>

        {/* Daily Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Meals List */}
          <div className="lg:col-span-2 space-y-4">
            {Object.entries(mealGroups).map(([meal, foods]) => (
              <MealCard
                key={meal}
                meal={meal}
                foods={foods}
                references={references.foods}
                dailyTargets={currentPlan.targets}
              />
            ))}
          </div>

          {/* Nutrition Summary */}
          <div className="space-y-4">
            <GlassCard gradient="from-content/5 to-background">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/10">
                    <ScrollText className="w-5 h-5 text-primary-500" />
                  </div>
                  <h3 className="text-lg font-semibold">Daily Summary</h3>
                </div>

                <NutritionChart
                  current={dayPlan?.totals ?? {
                    energy: { value: 0, unit: 'kcal' },
                    protein: { value: 0, unit: 'g' },
                    carbs: { value: 0, unit: 'g' },
                    fat: { value: 0, unit: 'g' }
                  }}
                  target={currentPlan.targets}
                />
              </div>
            </GlassCard>

            {/* Tips Card */}
            <GlassCard gradient="from-warning-500/5 to-background">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning-500/10">
                    <Info className="w-5 h-5 text-warning-500" />
                  </div>
                  <h3 className="font-semibold">Tips</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-foreground/70">
                    • Try to space your meals 3-4 hours apart
                  </p>
                  <p className="text-sm text-foreground/70">
                    • Drink water between meals to stay hydrated
                  </p>
                  <p className="text-sm text-foreground/70">
                    • Include protein with each meal
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}