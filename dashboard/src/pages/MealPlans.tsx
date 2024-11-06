import { useState, useEffect, useRef } from 'react';
import {
  Button,
  Progress,
  Chip,
  Tooltip,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Utensils,
  Calendar,
  Clock,
  Scale,
  Apple,
  Beef,
  Wheat,
  Droplet,
  Coffee,
  Cookie,
  Sandwich,
  UtensilsCrossed,
  Soup,
  Info,
  Flame,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Zap,
  ArrowRight,
  ScrollText,
  Moon,
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useClientData } from '../hooks/useClientData';
import { usePlans } from '../hooks/usePlans';
import { GlassCard } from '../components/shared/GlassCard';
import { calculatePlanProgress } from '../utils/api';
import { cn } from '@/utils/cn';

// WeekDayButton Component for navigation
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
      {meals === 0 && (
        <Moon size={14} className="text-foreground/40" />
      )}
    </div>
  </button>
);

// Rest Period Card Component
const RestPeriodCard = () => (
  <GlassCard
    variant="gradient"
    gradient="from-secondary-500/10 via-background to-warning-500/10"
    className="mt-6"
    style={{ border: '0'}}
  >
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-warning-500/10">
          <Moon className="w-6 h-6 text-warning-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Cheat Day</h3>
          <p className="text-foreground/60">No meals scheduled for this day.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-content/5">
          <div className="flex items-center gap-2 mb-2">
            <Cookie className="w-4 h-4 text-success-500" />
            <span className="text-sm font-medium">Light Snacking</span>
          </div>
          <p className="text-sm text-foreground/60">
            Consider healthy snacks if hungry
          </p>
        </div>

        <div className="p-4 rounded-xl bg-content/5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium">Next Meal</span>
          </div>
          <p className="text-sm text-foreground/60">
            Prepare for your next scheduled meal
          </p>
        </div>

        <div className="p-4 rounded-xl bg-content/5">
          <div className="flex items-center gap-2 mb-2">
            <Droplet className="w-4 h-4 text-secondary-500" />
            <span className="text-sm font-medium">Stay Hydrated</span>
          </div>
          <p className="text-sm text-foreground/60">
            Remember to drink plenty of water
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-warning-500/5">
        <Info className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/70">
          Rest periods between meals help with digestion and maintain stable blood sugar levels.
          Use this time to stay hydrated and prepare for your next meal.
        </p>
      </div>
    </div>
  </GlassCard>
);

// Nutrition Chart Component
const NutritionChart = ({ 
  current, 
  target 
}: { 
  current: { value: number; unit: string }; 
  target: string;
}) => {
  const percentage = Math.min(100, (current.value / parseFloat(target)) * 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        {/* <span className="text-foreground/60">Progress</span> */}
        {/* <span>{Math.round(percentage)}%</span> */}
      </div>
      <div className="h-2 bg-content/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-foreground/60">
          {Math.round(current.value)}{current.unit}
        </span>
        <span className="text-foreground">
          {Math.round(parseFloat(target))}{current.unit}
        </span>
      </div>
    </div>
  );
};

// Meal Card Component
const MealCard = ({
  title,
  timing,
  calories,
  foods,
  color = "primary",
  references
}: {
  title: string;
  timing: string;
  calories: number;
  foods: Array<any>;
  color?: string;
  references: any;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = {
    'Breakfast': Coffee,
    'Morning Snack': Cookie,
    'Lunch': Sandwich,
    'Afternoon Snack': Cookie,
    'Dinner': UtensilsCrossed,
    'Evening Snack': Soup,
  }[title] || Utensils;

  return (
    <GlassCard
      variant="frosted"
      className="overflow-hidden transition-all duration-300"
    >
      <div className="p-6 space-y-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl bg-${color}-500/10`}>
              <Icon className={`w-5 h-5 text-${color}-500`} />
            </div>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-foreground/60">{timing}</p>
            </div>
          </div>
          <Chip
            className={`bg-${color}-500/10`}
            startContent={<Flame size={14} className={`text-${color}-500`} />}
          >
            {calories} kcal
          </Chip>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 pt-4"
            >
              {foods.map((food, index) => {
                const foodRef = references.foods[food.ref];
                return (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-content/5"
                  >
                    <img
                      src={foodRef.image}
                      alt={foodRef.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium truncate">{foodRef.title}</h4>
                          <p className="text-sm text-foreground/60">{foodRef.category}</p>
                        </div>
                        <Chip 
                          size="sm"
                          className="bg-content/10"
                          startContent={<Scale size={14} />}
                        >
                          {food.amount}g
                        </Chip>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mt-3">
                        <div className="text-center">
                          <Flame className="w-4 h-4 text-primary-500 mx-auto mb-1" />
                          <p className="text-xs">{Math.round(food.nutrition.energy.value)}kcal</p>
                        </div>
                        <div className="text-center">
                          <Beef className="w-4 h-4 text-success-500 mx-auto mb-1" />
                          <p className="text-xs">{Math.round(food.nutrition.protein.value)}g</p>
                        </div>
                        <div className="text-center">
                          <Wheat className="w-4 h-4 text-warning-500 mx-auto mb-1" />
                          <p className="text-xs">{Math.round(food.nutrition.carbs.value)}g</p>
                        </div>
                        <div className="text-center">
                          <Droplet className="w-4 h-4 text-danger-500 mx-auto mb-1" />
                          <p className="text-xs">{Math.round(food.nutrition.fat.value)}g</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};

// Main MealPlans Component
export default function MealPlans() {
  const { loading, error, client, plans, references, refreshData } = useClientData();
  const { activePlan, completedPlans, currentDay } = usePlans(plans ?? []);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [selectedPlan, setSelectedPlan] = useState<'active' | 'history'>('active');
  const [historicalPlanIndex, setHistoricalPlanIndex] = useState(0);
  const daysContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedDay === null && currentDay) {
      setSelectedDay(currentDay);
    }
  }, [currentDay, selectedDay]);

  useEffect(() => {
    if (currentDay) {
      setSelectedDay(currentDay);
      
      // Wait for the next tick to ensure DOM is updated
      setTimeout(() => {
        if (daysContainerRef.current) {
          const container = daysContainerRef.current;
          const dayElement = container.children[currentDay - 1] as HTMLElement;
          
          if (dayElement) {
            // Calculate the center position
            const containerWidth = container.clientWidth;
            const elementWidth = dayElement.offsetWidth;
            const elementLeft = dayElement.offsetLeft;
            
            // Center the element
            const scrollPosition = elementLeft - (containerWidth / 2) + (elementWidth / 2);
            
            container.scrollTo({
              left: Math.max(0, scrollPosition),
              behavior: 'smooth'
            });
          }
        }
      }, 100);
    }
  }, [currentDay]);

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          </div>``
          <div className="text-foreground/60 font-medium">Loading your meal plan...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !client || !references) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <GlassCard className="max-w-md w-full p-6 text-center space-y-4 bg-danger/10">
          <div className="w-16 h-16 rounded-full bg-danger/20 text-danger mx-auto flex items-center justify-center">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-semibold text-danger">Error Loading Plan</h3>
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

  const currentPlan = selectedPlan === 'active' ? activePlan : completedPlans[historicalPlanIndex];
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

  const dailyNutrients = dayPlan?.totals ?? {
    energy: { value: 0, unit: 'kcal' },
    protein: { value: 0, unit: 'g' },
    carbs: { value: 0, unit: 'g' },
    fat: { value: 0, unit: 'g' }
  };

  const mealTimings = {
    'Breakfast': '7:00 AM - 9:00 AM',
    'Morning Snack': '10:30 AM - 11:30 AM',
    'Lunch': '1:00 PM - 2:30 PM',
    'Afternoon Snack': '4:00 PM - 5:00 PM',
    'Dinner': '7:00 PM - 8:30 PM',
    'Evening Snack': '9:30 PM - 10:30 PM'
  };

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      <div className="container mx-auto space-y-6">
        {/* Hero Section */}
        <GlassCard
          variant="gradient"
          gradient="from-primary-500/20 via-transparent to-secondary-500/20"
          intensity="heavy"
        >
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary-500 text-white shadow-lg shadow-primary-500/20">
                  <Calendar className="w-6 h-6" />
                </div>
                
                {selectedPlan === 'active' ? (
                  <div>
                    <h1 className="text-xl font-bold">
                      {format(new Date(currentPlan.start), 'MMM d')} - {format(addDays(new Date(currentPlan.start), 6), 'MMM d')}
                    </h1>
                    <p className="text-sm text-foreground/60">
                      {format(new Date(currentPlan.start), 'yyyy')}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      isDisabled={historicalPlanIndex === completedPlans.length - 1}
                      onPress={() => setHistoricalPlanIndex(prev => prev + 1)}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <div className="flex items-center gap-2">
                      <GlassCard 
                        variant="frosted"
                        className="px-4 py-2 bg-primary-500/5"
                      >
                        <div className="flex items-center flex-col gap-2">
                          <Calendar className="w-4 h-4 text-primary-500" />
                          <span className="text-sm">
                            {format(new Date(currentPlan.start), 'MMM d')} - {format(new Date(currentPlan.end), 'MMM d')}
                          </span>
                          <span className="text-sm">
                            {currentPlan.config.daily_meals} meals/day
                          </span>
                        </div>
                      </GlassCard>
                    </div>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      isDisabled={historicalPlanIndex === 0}
                      onPress={() => setHistoricalPlanIndex(prev => prev - 1)}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                )}
              </div>

              {/* Plan Type Selector */}
              <div className="flex gap-2 p-1 rounded-xl bg-content/5 backdrop-blur-xl">
                <Button
                  size="sm"
                  variant={selectedPlan === 'active' ? 'solid' : 'light'}
                  onPress={() => {
                    setSelectedPlan('active');
                    setSelectedDay(currentDay);
                  }}
                  className={cn(
                    "rounded-lg shadow-lg",
                    selectedPlan === 'active' && "bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
                  )}
                  startContent={<Zap size={16} className={selectedPlan === 'active' ? "text-white" : ""} />}
                >
                  Current Week
                </Button>
                <Button
                  size="sm"
                  variant={selectedPlan === 'history' ? 'solid' : 'light'}
                  onPress={() => setSelectedPlan('history')}
                  isDisabled={completedPlans.length === 0}
                  className={cn(
                    "rounded-lg shadow-lg",
                    selectedPlan === 'history' && "bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
                  )}
                  startContent={<Clock size={16} className={selectedPlan === 'history' ? "text-white" : ""} />}
                >
                  History ({completedPlans.length})
                </Button>
              </div>
            </div>

            {/* Progress Indicator */}

            {/* Week Calendar */}
            <div className="relative">
              {/* Shadow Indicators */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />

              {/* Scrollable Days */}
              <div
                ref={daysContainerRef}
                className="flex gap-3 overflow-x-auto pb-4 pt-2 scrollbar-hide -mx-2"
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {Array.from({ length: 7 }, (_, i) => {
                  const day = i + 1;
                  const date = addDays(new Date(currentPlan.start), i);
                  const dayFoods = currentPlan.days[`day_${day}`]?.foods || [];
                  const uniqueMeals = new Set(dayFoods.map(f => f.meal)).size;
                  
                  return (
                    <div
                      key={day}
                      className="flex-none w-[150px]"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      <WeekDayButton
                        day={day}
                        date={date}
                        isSelected={day === selectedDay}
                        isCompleted={false}
                        isCurrent={selectedPlan === 'active' && day === currentDay}
                        onClick={() => setSelectedDay(day)}
                        meals={uniqueMeals}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Nutrition Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-primary-500/5 space-y-1">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-primary-500" />
                  <p className="text-sm text-foreground/60">Calories</p>
                </div>
                <NutritionChart
                  current={dailyNutrients.energy}
                  target={currentPlan.targets.energy}
                />
              </div>

              <div className="p-4 rounded-xl bg-success-500/5 space-y-1">
                <div className="flex items-center gap-2">
                  <Beef className="w-4 h-4 text-success-500" />
                  <p className="text-sm text-foreground/60">Protein</p>
                </div>
                <NutritionChart
                  current={dailyNutrients.protein}
                  target={currentPlan.targets.proteins}
                />
              </div>

              <div className="p-4 rounded-xl bg-warning-500/5 space-y-1">
                <div className="flex items-center gap-2">
                  <Wheat className="w-4 h-4 text-warning-500" />
                  <p className="text-sm text-foreground/60">Carbs</p>
                </div>
                <NutritionChart
                  current={dailyNutrients.carbs}
                  target={currentPlan.targets.carbs}
                />
              </div>

              <div className="p-4 rounded-xl bg-danger-500/5 space-y-1">
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-danger-500" />
                  <p className="text-sm text-foreground/60">Fats</p>
                </div>
                <NutritionChart
                  current={dailyNutrients.fat}
                  target={currentPlan.targets.fats}
                />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Meals Section */}
        <div className="space-y-4">
          {Object.keys(mealGroups).length > 0 ? (
            Object.entries(mealGroups).map(([meal, foods], index) => (
              <motion.div
                key={meal}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MealCard
                  title={meal}
                  timing={mealTimings[meal as keyof typeof mealTimings]}
                  calories={foods.reduce((sum, food) => sum + food.nutrition.energy.value, 0)}
                  foods={foods}
                  color={
                    index % 4 === 0 ? 'primary' :
                    index % 4 === 1 ? 'secondary' :
                    index % 4 === 2 ? 'success' : 
                    'warning'
                  }
                  references={references}
                />
              </motion.div>
            ))
          ) : (
            <RestPeriodCard />
          )}
        </div>
      </div>
    </div>
  );
}