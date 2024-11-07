import { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  CircularProgress,
  Chip,
  Switch,
  Modal,
  ModalContent,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import {
  Utensils,
  Calendar,
  Clock,
  Coffee,
  UtensilsCrossed,
  Cookie,
  Sandwich,
  History,
  ChevronLeft,
  ChevronRight,
  Flame,
  Beef,
  Wheat,
  Droplet,
  Moon,
  Zap,
  Apple,
  Scale,
  Info,
  X,
  AlertTriangle,
} from "lucide-react";
import { format, addDays, isToday } from "date-fns";
import { useClientData } from '../hooks/useClientData';
import { usePlans } from '../hooks/usePlans';
import { cn } from "@/lib/utils";
import type { Food, FoodReference, NutritionInfo } from "@/types/meal";

export default function MealPlans() {
  const { loading, error, client, plans, references, refreshData } = useClientData();
  const { activePlan, completedPlans, currentDay } = usePlans(plans ?? []);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [selectedPlan, setSelectedPlan] = useState<'active' | 'history'>('active');
  const [historicalPlanIndex, setHistoricalPlanIndex] = useState(0);
  const [selectedFood, setSelectedFood] = useState<{
    food: Food;
    foodRef: FoodReference;
    meal: string;
  } | null>(null);
  
  const daysContainerRef = useRef<HTMLDivElement>(null);
  const initialScrollApplied = useRef(false);

  // Auto-scroll to current day
  useEffect(() => {
    if (!initialScrollApplied.current && daysContainerRef.current && currentDay) {
      const container = daysContainerRef.current;
      const dayElements = container.children;
      
      if (dayElements.length > 0) {
        const dayElement = dayElements[currentDay - 1] as HTMLElement;
        if (dayElement) {
          const containerWidth = container.clientWidth;
          const elementWidth = dayElement.offsetWidth;
          const elementLeft = dayElement.offsetLeft;
          const scrollPosition = elementLeft - (containerWidth / 2) + (elementWidth / 2);

          setTimeout(() => {
            container.scrollTo({
              left: Math.max(0, scrollPosition),
              behavior: 'smooth'
            });
            initialScrollApplied.current = true;
          }, 100);
        }
      }
    }
  }, [currentDay, daysContainerRef.current]);

  // Internal Components
  const DayButton = ({
    dayIndex,
    date,
    meals,
    isSelected,
    isCurrent,
    onClick,
  }: {
    dayIndex: number;
    date: Date;
    meals: Array<{ time: string; title: string }>;
    isSelected: boolean;
    isCurrent: boolean;
    onClick: () => void;
  }) => {
    return (
      <Button
        className={cn(
          "w-[90px] h-[90px] p-3",
          "flex flex-col items-center justify-between",
          "transition-all duration-300",
          "bg-content/5 hover:bg-content/10",
          "relative",
          isSelected && "bg-gradient-to-br from-primary-500 to-secondary-500 text-white scale-105 shadow-lg",
          isCurrent && !isSelected && "bg-primary-500/10 hover:bg-primary-500/20",
        )}
        variant="flat"
        onPress={onClick}
      >
        {/* Date Info */}
        <div className="text-center">
          <p className={cn(
            "text-[11px] uppercase tracking-wider",
            isCurrent && "text-primary-500",
            isSelected && "text-white/90"
          )}>
            {format(date, 'EEE')}
          </p>
          <p className={cn(
            "text-xl font-bold",
            isCurrent && !isSelected && "text-primary-500"
          )}>
            {format(date, 'd')}
          </p>
        </div>

        {/* Meal Dots */}
        <div className="flex gap-0.5">
          {meals.length > 0 ? (
            meals.slice(0, 4).map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  isSelected 
                    ? "bg-white"
                    : isCurrent
                      ? "bg-primary-500"
                      : "bg-foreground/20"
                )}
              />
            ))
          ) : (
            <Moon className="w-4 h-4 text-foreground/40" />
          )}
        </div>

        {/* Current Day Indicator */}
        {isCurrent && (
          <div className="absolute top-1 right-1">
            <div className="w-2 h-2 rounded-full bg-primary-500" />
          </div>
        )}
      </Button>
    );
  };

  const MacroProgress = ({
    icon: Icon,
    label,
    current,
    target,
    unit,
    color,
  }: {
    icon: any;
    label: string;
    current: number;
    target: number;
    unit: string;
    color: "primary" | "success" | "warning" | "danger";
  }) => {
    const percentage = (current / target) * 100;
    
    return (
      <Card className="p-4 bg-content/5 border-none">
        <div className="flex items-center gap-3">
          <CircularProgress
            value={percentage}
            color={color}
            showValueLabel={false}
            className="w-12 h-12"
            strokeWidth={4}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 text-${color}`} />
              <span className="text-sm text-foreground/60">{label}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold">{Math.round(current)}</span>
              <span className="text-sm text-foreground/60">/ {target}{unit}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const FoodCard = ({
    food,
    foodRef,
    meal,
    onPress,
  }: {
    food: Food;
    foodRef: FoodReference;
    meal: string;
    onPress: () => void;
  }) => {
    const mealIcons = {
      'Breakfast': Coffee,
      'Lunch': Sandwich,
      'Dinner': UtensilsCrossed,
      'Snack': Cookie,
    };

    const Icon = mealIcons[meal as keyof typeof mealIcons] || Utensils;

    return (
      <Card 
        isPressable
        onPress={onPress}
        className="border-none bg-content/5"
      >
        <div className="flex gap-4 p-4">
          <img
            src={foodRef.image}
            alt={foodRef.title}
            className="w-20 h-20 rounded-xl object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{foodRef.title}</h4>
                <p className="text-sm text-foreground/60">{meal}</p>
              </div>
              <Chip
                size="sm"
                startContent={<Scale size={14} />}
                className="bg-content/10"
              >
                {food.amount}g
              </Chip>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-4">
              <div className="text-center">
                <Flame className="w-4 h-4 text-primary-500 mx-auto" />
                <p className="text-xs mt-1">{Math.round(food.nutrition.energy.value)}kcal</p>
              </div>
              <div className="text-center">
                <Beef className="w-4 h-4 text-success-500 mx-auto" />
                <p className="text-xs mt-1">{Math.round(food.nutrition.protein.value)}g</p>
              </div>
              <div className="text-center">
                <Wheat className="w-4 h-4 text-warning-500 mx-auto" />
                <p className="text-xs mt-1">{Math.round(food.nutrition.carbs.value)}g</p>
              </div>
              <div className="text-center">
                <Droplet className="w-4 h-4 text-danger-500 mx-auto" />
                <p className="text-xs mt-1">{Math.round(food.nutrition.fat.value)}g</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const FoodDetailsModal = ({
    isOpen,
    onClose,
    food,
    foodRef,
    meal,
  }: {
    isOpen: boolean;
    onClose: () => void;
    food: Food;
    foodRef: FoodReference;
    meal: string;
  }) => {
    const [selectedTab, setSelectedTab] = useState("overview");

    return (
      <Modal
        size="2xl"
        radius="lg"
        isOpen={isOpen}
        onClose={onClose}
        hideCloseButton
        className="bg-background/98"
        classNames={{
          backdrop: "bg-[#000000]/80 backdrop-blur-md",
        }}
        scrollBehavior="inside"
      >
        <ModalContent>
          <div className="flex flex-col h-[90vh]">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-content/10">
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{foodRef.title}</h2>
                  <p className="text-sm text-foreground/60">{foodRef.category}</p>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  onPress={onClose}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="px-4">
                <Tabs
                  selectedKey={selectedTab}
                  onSelectionChange={(key) => setSelectedTab(key.toString())}
                  color="primary"
                  variant="underlined"
                  classNames={{
                    tabList: "gap-6",
                    cursor: "w-full bg-primary-500",
                    tab: "max-w-fit px-2 h-12",
                  }}
                >
                  <Tab
                    key="overview"
                    title={
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        <span className="text-sm">Overview</span>
                      </div>
                    }
                  />
                  <Tab
                    key="nutrition"
                    title={
                      <div className="flex items-center gap-2">
                        <Apple className="w-4 h-4" />
                        <span className="text-sm">Nutrition</span>
                      </div>
                    }
                  />
                </Tabs>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {selectedTab === "overview" ? (
                <div className="space-y-6">
                  {/* Image */}
                  <Card className="w-full aspect-video overflow-hidden border-none">
                    <img
                      src={foodRef.image}
                      alt={foodRef.title}
                      className="w-full h-full object-cover"
                    />
                  </Card>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 bg-content/5 border-none">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary-500/10">
                          <Scale className="w-5 h-5 text-primary-500" />
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60">Serving Size</p>
                          <p className="text-lg font-semibold">{food.amount}g</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-content/5 border-none">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-warning-500/10">
                          <Clock className="w-5 h-5 text-warning-500" />
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60">Meal Time</p>
                          <p className="text-lg font-semibold">{meal}</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Description */}
                  <Card className="p-4 bg-content/5 border-none">
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {foodRef.description}
                    </p>
                  </Card>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Nutrition Facts */}
                  <Card className="p-6 bg-content/5 border-none">
                    <h3 className="text-lg font-semibold mb-4">Nutrition Facts</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between pb-2 border-b border-content/10">
                        <span className="font-medium">Calories</span>
                        <span>{Math.round(food.nutrition.energy.value)} kcal</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-content/10">
                        <span className="font-medium">Protein</span>
                        <span>{Math.round(food.nutrition.protein.value)}g</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-content/10">
                        <span className="font-medium">Carbohydrates</span>
                        <span>{Math.round(food.nutrition.carbs.value)}g</span>
                      </div>
                      <div className="flex justify-between pb-2">
                        <span className="font-medium">Fat</span>
                        <span>{Math.round(food.nutrition.fat.value)}g</span>
                      </div>
                    </div>
                  </Card>

                  {/* Per 100g Comparison */}
                  <Card className="p-6 bg-content/5 border-none">
                    <h3 className="text-lg font-semibold mb-4">Per 100g</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between pb-2 border-b border-content/10">
                        <span className="font-medium">Calories</span>
                        <span>{Math.round(foodRef.nutrition_per_100g.energy.value)} kcal</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-content/10">
                        <span className="font-medium">Protein</span>
                        <span>{Math.round(foodRef.nutrition_per_100g.protein.value)}g</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-content/10">
                        <span className="font-medium">Carbohydrates</span>
                        <span>{Math.round(foodRef.nutrition_per_100g.carbs.value)}g</span>
                      </div>
                      <div className="flex justify-between pb-2">
                        <span className="font-medium">Fat</span>
                        <span>{Math.round(foodRef.nutrition_per_100g.fat.value)}g</span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </ModalContent>
      </Modal>
    );
  };

  const MealTimeline = ({
    meals,
    foodRefs,
    onFoodClick,
  }: {
    meals: { [key: string]: Food[] };
    foodRefs: { [key: string]: FoodReference };
    onFoodClick: (food: Food, foodRef: FoodReference, meal: string) => void;
  }) => {
    const timelineRef = useRef<HTMLDivElement>(null);
    const [currentTime] = useState(new Date());

    const mealTimes = {
      'Breakfast': '7:00 AM',
      'Morning Snack': '10:30 AM',
      'Lunch': '1:00 PM',
      'Afternoon Snack': '4:00 PM',
      'Dinner': '7:00 PM',
      'Evening Snack': '9:30 PM',
    };

    const mealIcons = {
      'Breakfast': Coffee,
      'Morning Snack': Cookie,
      'Lunch': Sandwich,
      'Afternoon Snack': Cookie,
      'Dinner': UtensilsCrossed,
      'Evening Snack': Cookie,
    };

    return (
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-content/10" />
        
        <div className="space-y-6" ref={timelineRef}>
          {Object.entries(meals).map(([meal, foods], index) => {
            const Icon = mealIcons[meal as keyof typeof mealIcons] || Utensils;
            const time = mealTimes[meal as keyof typeof mealTimes] || '';
            
            const totalNutrition = foods.reduce((acc, food) => ({
              energy: { value: acc.energy.value + food.nutrition.energy.value, unit: 'kcal' },
              protein: { value: acc.protein.value + food.nutrition.protein.value, unit: 'g' },
              carbs: { value: acc.carbs.value + food.nutrition.carbs.value, unit: 'g' },
              fat: { value: acc.fat.value + food.nutrition.fat.value, unit: 'g' },
            }), {
              energy: { value: 0, unit: 'kcal' },
              protein: { value: 0, unit: 'g' },
              carbs: { value: 0, unit: 'g' },
              fat: { value: 0, unit: 'g' },
            });

            return (
              <motion.div
                key={meal}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-16"
              >
                {/* Time Indicator */}
                <div className="absolute left-0 flex items-center h-full">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      "bg-content/5"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-foreground/60 mt-1">{time}</span>
                  </div>
                </div>

                {/* Meal Content */}
                <div className="space-y-4">
                  {/* Meal Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{meal}</h3>
                    <div className="flex items-center gap-2">
                      <Chip size="sm" className="bg-primary-500/10">
                        <Flame className="w-3 h-3 text-primary-500" />
                        <span className="ml-1">{Math.round(totalNutrition.energy.value)} kcal</span>
                      </Chip>
                    </div>
                  </div>

                  {/* Food Cards */}
                  <div className="grid gap-4">
                    {foods.map((food, foodIndex) => (
                      <motion.div
                        key={`${food.ref}-${foodIndex}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: foodIndex * 0.1 }}
                      >
                        <FoodCard
                          food={food}
                          foodRef={foodRefs[food.ref]}
                          meal={meal}
                          onPress={() => onFoodClick(food, foodRefs[food.ref], meal)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  // Loading state
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

  // Error state
  if (error || !client || !references) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Card className="max-w-md w-full p-6 text-center space-y-4">
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
        </Card>
      </div>
    );
  }

  const currentPlan = selectedPlan === 'active' ? activePlan : completedPlans[historicalPlanIndex];
  if (!currentPlan) return null;

  const dayKey = `day_${selectedDay}`;
  const dayPlan = currentPlan?.days[dayKey];
  
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

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Hero Section */}
        <Card className="border-none">
          <div className="p-6 space-y-6">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <Switch
                    size="sm"
                    color="secondary"
                    startContent={<Zap className="w-3 h-3" />}
                    endContent={<History className="w-3 h-3" />}
                    isSelected={selectedPlan === 'history'}
                    onValueChange={(isSelected) => {
                      setSelectedPlan(isSelected ? 'history' : 'active');
                      if (!isSelected) setSelectedDay(currentDay);
                    }}
                    isDisabled={completedPlans.length === 0}
                  >
                    <span className="text-xs">
                      {selectedPlan === 'history' ? 'History Mode' : 'Current Week'}
                    </span>
                  </Switch>
                </div>

                {selectedPlan === 'history' && (
                  <div className="flex items-center gap-2">
                    <Button
                      isIconOnly
                      variant="flat"
                      isDisabled={historicalPlanIndex === completedPlans.length - 1}
                      onPress={() => setHistoricalPlanIndex(prev => prev + 1)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <Card className="px-4 py-2 bg-content/5 border-none">
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          Week {completedPlans.length - historicalPlanIndex} of {completedPlans.length}
                        </p>
                      </div>
                    </Card>

                    <Button
                      isIconOnly
                      variant="flat"
                      isDisabled={historicalPlanIndex === 0}
                      onPress={() => setHistoricalPlanIndex(prev => prev - 1)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-500" />
                <h3 className="text-base font-semibold">
                  {format(new Date(currentPlan.start), 'MMM d')} - {format(addDays(new Date(currentPlan.start), 6), 'MMM d, yyyy')}
                </h3>
              </div>
            </div>

            {/* Days Carousel */}
            <div className="relative">
              {/* Shadow Indicators */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-2 overflow-x-auto hide-scrollbar py-2 -mx-2 px-2"
                ref={daysContainerRef}
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {Array.from({ length: 7 }, (_, i) => {
                  const dayIndex = i + 1;
                  const date = addDays(new Date(currentPlan.start), i);
                  const dayFoods = currentPlan.days[`day_${dayIndex}`]?.foods || [];
                  const meals = Object.entries(
                    dayFoods.reduce((acc, food) => {
                      if (!acc[food.meal]) acc[food.meal] = [];
                      acc[food.meal].push(food);
                      return acc;
                    }, {} as Record<string, Food[]>)
                  ).map(([meal]) => ({
                    time: meal,
                    title: meal,
                  }));

                  return (
                    <div
                      key={dayIndex}
                      className="flex-none"
                      style={{ scrollSnapAlign: 'center' }}
                    >
                      <DayButton
                        dayIndex={dayIndex}
                        date={date}
                        meals={meals}
                        isSelected={dayIndex === selectedDay}
                        isCurrent={selectedPlan === 'active' && dayIndex === currentDay}
                        onClick={() => setSelectedDay(dayIndex)}
                      />
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Macro Progress */}
            <div className="grid grid-cols-4 gap-4">
              <MacroProgress
                icon={Flame}
                label="Calories"
                current={dailyNutrients.energy.value}
                target={parseFloat(currentPlan.targets.energy)}
                unit="kcal"
                color="primary"
              />
              <MacroProgress
                icon={Beef}
                label="Protein"
                current={dailyNutrients.protein.value}
                target={parseFloat(currentPlan.targets.proteins)}
                unit="g"
                color="success"
              />
              <MacroProgress
                icon={Wheat}
                label="Carbs"
                current={dailyNutrients.carbs.value}
                target={parseFloat(currentPlan.targets.carbs)}
                unit="g"
                color="warning"
              />
              <MacroProgress
                icon={Droplet}
                label="Fats"
                current={dailyNutrients.fat.value}
                target={parseFloat(currentPlan.targets.fats)}
                unit="g"
                color="danger"
              />
            </div>
          </div>
        </Card>
        {/* Timeline Section */}
        {Object.keys(mealGroups).length > 0 ? (
          <div className="space-y-6">
            {/* Water Target Card */}
            <Card className="border-none bg-gradient-to-r from-primary-500/10 to-secondary-500/10">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/20">
                    <Droplet className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Daily Water Target</p>
                    <p className="text-lg font-semibold">
                      {(parseFloat(currentPlan.targets.water) / 1000).toFixed(1)}L
                    </p>
                  </div>
                </div>
                <CircularProgress
                  value={75}
                  color="primary"
                  showValueLabel
                  size="lg"
                  classNames={{
                    svg: "w-14 h-14 drop-shadow",
                    indicator: "stroke-primary-500",
                    track: "stroke-white/10",
                    value: "text-lg font-semibold text-primary-500",
                  }}
                />
              </div>
            </Card>

            {/* Meal Timeline */}
            <MealTimeline
              meals={mealGroups}
              foodRefs={references.foods}
              onFoodClick={(food, foodRef, meal) => setSelectedFood({ food, foodRef, meal })}
            />
          </div>
        ) : (
          // Rest Day Card
          <Card className="border-none p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-primary-500/10">
                <Moon className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No Meals Scheduled</h3>
                <p className="text-foreground/60">This is a rest day in your meal plan.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-none bg-content/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Apple className="w-4 h-4 text-success-500" />
                  <span className="text-sm font-medium">Healthy Choices</span>
                </div>
                <p className="text-sm text-foreground/60">
                  Focus on nutritious, light meals if hungry
                </p>
              </Card>

              <Card className="border-none bg-content/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Droplet className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-medium">Stay Hydrated</span>
                </div>
                <p className="text-sm text-foreground/60">
                  Keep up with your water intake
                </p>
              </Card>

              <Card className="border-none bg-content/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-warning-500" />
                  <span className="text-sm font-medium">Next Day Prep</span>
                </div>
                <p className="text-sm text-foreground/60">
                  Prepare for tomorrow's meal plan
                </p>
              </Card>
            </div>
          </Card>
        )}

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
}