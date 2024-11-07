import { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  CardBody,
  CircularProgress,
  Chip,
  Switch,
  Modal,
  ModalContent,
  Tabs,
  Tab,
  Avatar,
  AvatarGroup,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Coffee,
  UtensilsCrossed,
  Cookie,
  History,
  Flame,
  Beef,
  Wheat,
  Droplet,
  Moon,
  Zap,
  ChevronLeft,
  ChevronRight,
  Apple,
  Info,
  X,
  AlertTriangle,
  ChefHat,
  ScrollText,
  Scale,
  ChevronDown,
} from "lucide-react";
import { format, addDays, isToday } from "date-fns";
import { useClientData } from '../hooks/useClientData';
import { usePlans } from '../hooks/usePlans';
import { cn } from "@/lib/utils";
import type { Food, FoodReference } from "@/types/meal";
import { CSSTransition } from 'react-transition-group';

// Compact Plan Hero similar to workout page
const PlanHero = ({
  plan,
  selectedDay,
  currentDay,
  onDaySelect,
  selectedPlan,
  onPlanTypeChange,
  completedPlansCount,
  completedPlans,
  historicalPlanIndex,
  onHistoricalPlanSelect,
}: {
  plan: any;
  selectedDay: number;
  currentDay: number | null;
  onDaySelect: (day: number) => void;
  selectedPlan: 'active' | 'history';
  onPlanTypeChange: (type: 'active' | 'history') => void;
  completedPlansCount: number;
  completedPlans: any[];
  historicalPlanIndex: number;
  onHistoricalPlanSelect: (index: number) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialScrollApplied = useRef(false);
  const startDate = new Date(plan.start);

  useEffect(() => {
    if (!initialScrollApplied.current && scrollRef.current && currentDay) {
      const container = scrollRef.current;
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
  }, [currentDay]);

  const DayButton = ({ dayIndex }: { dayIndex: number }) => {
    const date = addDays(startDate, dayIndex - 1);
    const dayKey = `day_${dayIndex}`;
    const dayData = plan.days[dayKey];
    const mealCount = dayData?.foods?.length || 0;
    const isSelected = selectedDay === dayIndex;
    const isCurrent = isToday(date);

    return (
      <Button
        className={cn(
          "w-[90px] h-[90px] p-3",
          "flex flex-col items-center justify-between",
          "transition-all duration-300",
          "bg-secondary-content/5 hover:bg-secondary-content/10",
          isSelected && "bg-gradient-to-br from-primary-500 to-secondary-500 text-white scale-105 shadow-lg",
          isCurrent && !isSelected && "bg-primary-500/10 hover:bg-primary-500/20"
        )}
        variant="flat"
        onPress={() => onDaySelect(dayIndex)}
      >
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

        <Chip
          size="sm"
          className={cn(
            "h-5 px-2",
            isSelected
              ? "bg-white/20 text-white"
              : mealCount > 0
                ? "bg-primary-500/20 text-primary-500"
                : "bg-secondary-content/10"
          )}
        >
          <div className="flex items-center gap-1">
            {mealCount > 0 ? (
              <>
                <ChefHat className="w-3 h-3" />
                <span className="text-xs">{mealCount}</span>
              </>
            ) : (
              <Moon className="w-3 h-3" />
            )}
          </div>
        </Chip>

        {isCurrent && (
          <div className="absolute -top-0 -right-0">
            <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
          </div>
        )}
      </Button>
    );
  };

  const dailyNutrients = plan.days[`day_${selectedDay}`]?.totals ?? {
    energy: { value: 0 },
    protein: { value: 0 },
    carbs: { value: 0 },
    fat: { value: 0 }
  };

  const targets = {
    energy: parseFloat(plan.targets.energy),
    protein: parseFloat(plan.targets.proteins),
    carbs: parseFloat(plan.targets.carbs),
    fat: parseFloat(plan.targets.fats),
    water: parseFloat(plan.targets.water)
  };

  return (
    <Card isBlurred className="border-none bg-secondary-content/80 dark:bg-transparent">
      <CardBody className="p-4 space-y-4">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch
              size="sm"
              color="secondary"
              startContent={<History className="w-3 h-3" />}
              endContent={<Zap className="w-3 h-3" />}
              isSelected={selectedPlan === 'history'}
              onValueChange={(isSelected) => onPlanTypeChange(isSelected ? 'history' : 'active')}
              isDisabled={completedPlansCount === 0}
            />
            
            {selectedPlan === 'history' && (
              <div className="flex items-center gap-2">
                <Button
                  isIconOnly
                  variant="flat"
                  isDisabled={historicalPlanIndex === completedPlans.length - 1}
                  onPress={() => onHistoricalPlanSelect(historicalPlanIndex + 1)}
                  className="bg-secondary-content/5"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Chip size="sm">
                  Week {completedPlans.length - historicalPlanIndex} of {completedPlans.length}
                </Chip>
                <Button
                  isIconOnly
                  variant="flat"
                  isDisabled={historicalPlanIndex === 0}
                  onPress={() => onHistoricalPlanSelect(historicalPlanIndex - 1)}
                  className="bg-secondary-content/5"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <CircularProgress
            value={(dailyNutrients.energy.value / targets.energy) * 100}
            color="primary"
            classNames={{
              svg: "w-12 h-12 drop-shadow",
              indicator: "stroke-primary-500",
              track: "stroke-white/10",
              value: "text-sm font-semibold text-primary-500",
            }}
            aria-label="Progress"
            showValueLabel={true}
            valueLabel={`${Math.round((dailyNutrients.energy.value / targets.energy) * 100)}%`}
          />
        </div>

        {/* Date and Days Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-500" />
            <h3 className="text-base font-semibold">
              {format(startDate, 'MMM d')} - {format(addDays(startDate, 6), 'MMM d')}
            </h3>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-secondary-content/5 p-3 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary-500/10">
              <Beef className="w-4 h-4 text-primary-500" />
            </div>
            <div>
              <p className="text-xs text-foreground/60">Protein</p>
              <p className="text-sm font-semibold">
                {Math.round(dailyNutrients.protein.value)}/{Math.round(targets.protein)}g
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-secondary-content/5 p-3 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-warning-500/10">
              <Wheat className="w-4 h-4 text-warning-500" />
            </div>
            <div>
              <p className="text-xs text-foreground/60">Carbs</p>
              <p className="text-sm font-semibold">
                {Math.round(dailyNutrients.carbs.value)}/{Math.round(targets.carbs)}g
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-secondary-content/5 p-3 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-danger-500/10">
              <Droplet className="w-4 h-4 text-danger-500" />
            </div>
            <div>
              <p className="text-xs text-foreground/60">Fats</p>
              <p className="text-sm font-semibold">
                {Math.round(dailyNutrients.fat.value)}/{Math.round(targets.fat)}g
              </p>
            </div>
          </div>
        </div>

        {/* Days Selector */}
        <div className="relative -mx-4 px-4">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />

          <motion.div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto hide-scrollbar py-2 -mx-2 px-2"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i + 1} className="flex-none" style={{ scrollSnapAlign: 'center' }}>
                <DayButton dayIndex={i + 1} />
              </div>
            ))}
          </motion.div>
        </div>
      </CardBody>
    </Card>
  );
};

// Compact Meal Card Component
const MealCard = ({ 
  meal, 
  foods, 
  foodRefs,
  mealTime,
  onFoodClick 
}: { 
  meal: string; 
  foods: Food[]; 
  foodRefs: { [key: string]: FoodReference }; 
  mealTime: string;
  onFoodClick: (food: Food) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const mealIcons: { [key: string]: any } = {
    'Breakfast': Coffee,
    'Lunch': UtensilsCrossed,
    'Dinner': UtensilsCrossed,
    'Snack': Cookie,
    'Morning Snack': Apple,
    'Afternoon Snack': Cookie,
    'Evening Snack': Moon
  };

  const Icon = mealIcons[meal] || UtensilsCrossed;
  
  // Calculate meal totals
  const mealTotals = foods.reduce((acc, food) => ({
    calories: acc.calories + food.nutrition.energy.value,
    protein: acc.protein + food.nutrition.protein.value,
    carbs: acc.carbs + food.nutrition.carbs.value,
    fat: acc.fat + food.nutrition.fat.value
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <Card 
      className={cn(
        "border-none overflow-hidden transition-all duration-300",
        "bg-content-secondary/70 backdrop-blur-sm hover:bg-content-secondary/80"
      )}
      isPressable
      isBlurred
      onPress={() => setIsExpanded(!isExpanded)}
    >
      <CardBody className="p-0">
        {/* Header Section */}
        <div className="relative p-4">
          {/* Background gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5" />
          
          {/* Main Content */}
          <div className="relative space-y-4">
            {/* Top Row - Title and Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary-500/10">
                  <Icon className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">{meal}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-foreground/50" />
                    <span className="text-sm text-foreground/50">{mealTime}</span>
                  </div>
                </div>
              </div>
              <Button
                isIconOnly
                variant="light"
                className="w-8 h-8"
                onPress={() => setIsExpanded(!isExpanded)}
              >
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-300",
                    isExpanded && "rotate-180"
                  )}
                />
              </Button>
            </div>

            {/* Middle Row - Food Previews */}
            <div className="flex items-center gap-3">
              <AvatarGroup
                max={5}
                size="md"
                
                className="flex-none"
                renderCount={(count) => (
                  <Avatar
                    isBordered
                    radius="full"
                    size="md"
                    fallback={
                      <span className="text-xs font-medium">+{count}</span>
                    }
                  />
                )}
              >
                {foods.map((food) => (
                  <Avatar
                   isBordered
                   color="primary"
                    key={food.ref}
                    radius="full"
                    src={foodRefs[food.ref]?.image}
                    className="w-12 h-12"
                    classNames={{
                      img: "object-cover"
                    }}
                  />
                ))}
              </AvatarGroup>
            </div>

            {/* Bottom Row - Macros */}
            <div className="flex items-center justify-between gap-2">
              <Chip
                size="sm"
                className="bg-secondary-content/10 border border-secondary-content/20"
                startContent={<Flame className="w-3 h-3" />}
              >
                {Math.round(mealTotals.calories)} kcal
              </Chip>
              <div className="flex gap-1">
                <Chip
                  size="sm"
                  className="bg-primary-500/10 border border-primary-500/20"
                  startContent={<Beef className="w-3 h-3 text-primary-500" />}
                >
                  {Math.round(mealTotals.protein)}g
                </Chip>
                <Chip
                  size="sm"
                  className="bg-warning-500/10 border border-warning-500/20"
                  startContent={<Wheat className="w-3 h-3 text-warning-500" />}
                >
                  {Math.round(mealTotals.carbs)}g
                </Chip>
                <Chip
                  size="sm"
                  className="bg-danger-500/10 border border-danger-500/20"
                  startContent={<Droplet className="w-3 h-3 text-danger-500" />}
                >
                  {Math.round(mealTotals.fat)}g
                </Chip>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Food List */}
        <motion.div
          animate={isExpanded ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          initial={false}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="p-4 space-y-3">
            {foods.map((food) => (
              <Card
                key={food.ref}
                isPressable
                isBlurred
                shadow="none"
                onPress={() => onFoodClick(food)}
                className={cn(
                  "bg-content-secondary/80 hover:bg-content-secondary/100",
                  "transition-all duration-300"
                )}
              >
                <CardBody className="p-3">
                  <div className="flex items-center gap-4">
                    {/* Food Image */}
                    <Avatar
                      radius="lg"
                      src={foodRefs[food.ref]?.image}
                      className="w-14 h-14"
                      classNames={{
                        img: "object-cover"
                      }}
                    />

                    {/* Food Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium text-base truncate">
                          {foodRefs[food.ref]?.title}
                        </h4>
                        <Chip
                          size="sm"
                          className="bg-secondary-content/10 flex-none"
                          variant="flat"
                        >
                          {food.amount}g
                        </Chip>
                      </div>

                      {/* Food Macros */}
                      <div className="flex flex-wrap gap-1.5">
                        <Chip
                          size="sm"
                          variant="flat"
                          className="bg-secondary-content/5 border border-secondary-content/10"
                          startContent={<Flame className="w-3 h-3" />}
                        >
                          {Math.round(food.nutrition.energy.value)} kcal
                        </Chip>
                        <div className="flex gap-1">
                          <Chip
                            size="sm"
                            variant="flat"
                            className="bg-primary-500/5 border border-primary-500/10"
                          >
                            P: {Math.round(food.nutrition.protein.value)}g
                          </Chip>
                          <Chip
                            size="sm"
                            variant="flat"
                            className="bg-warning-500/5 border border-warning-500/10"
                          >
                            C: {Math.round(food.nutrition.carbs.value)}g
                          </Chip>
                          <Chip
                            size="sm"
                            variant="flat"
                            className="bg-danger-500/5 border border-danger-500/10"
                          >
                            F: {Math.round(food.nutrition.fat.value)}g
                          </Chip>
                        </div>
                      </div>
                    </div>

                    {/* View Details Arrow */}
                    <Button
                      isIconOnly
                      variant="light"
                      className="w-8 h-8"
                      onPress={() => onFoodClick(food)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </motion.div>
      </CardBody>
    </Card>
  );
};

// Improved Food Details Modal similar to Exercise Modal
const FoodDetailsModal = ({
  isOpen,
  onClose,
  food,
  foodRef,
  meal
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
      size="full"
      radius="lg"
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      className="bg-white/50 dark:bg-black/50"
      backdrop="blur"
      classNames={{
        base: "h-[100dvh] max-h-[100dvh]",
      }}
      scrollBehavior="inside"
    >
      <ModalContent>
        <div className="flex flex-col h-[100dvh]">
          {/* Fixed Header */}
          <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md pb-2">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex gap-4">
                <Avatar isBordered color="secondary" src={foodRef.image} />
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold truncate">{foodRef.title}</h2>
                  <p className="text-sm text-foreground/60">{meal}</p>
                </div>
              </div>
              <Button
                isIconOnly
                variant="light"
                onPress={onClose}
                className="min-w-unit-8 w-unit-8 h-unit-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="px-4 flex justify-center">
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key.toString())}
                color="secondary"
                variant="solid"
                radius="full"
                classNames={{
                  tabList: "bg-secondary-content/60",
                  cursor: "w-full",
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
                      <ChefHat className="w-4 h-4" />
                      <span className="text-sm">Nutrition</span>
                    </div>
                  }
                />
              </Tabs>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {selectedTab === "overview" && (
              <div className="space-y-6 p-4">
                {/* Image Section */}
                <div className="relative bg-black">
                  <img
                    src={foodRef.image}
                    alt={foodRef.title}
                    className="w-full h-auto object-contain mx-auto"
                    style={{ maxHeight: "40vh" }}
                  />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Card className="p-3 bg-secondary-content/5 border-none">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary-500/10">
                        <Scale className="w-4 h-4 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-xs text-foreground/60">Serving</p>
                        <p className="font-medium">{food.amount}g</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-3 bg-secondary-content/5 border-none">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-secondary-500/10">
                        <Flame className="w-4 h-4 text-secondary-500" />
                      </div>
                      <div>
                        <p className="text-xs text-foreground/60">Energy</p>
                        <p className="font-medium">{Math.round(food.nutrition.energy.value)} kcal</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-3 bg-secondary-content/5 border-none">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-success-500/10">
                        <Clock className="w-4 h-4 text-success-500" />
                      </div>
                      <div>
                        <p className="text-xs text-foreground/60">Meal</p>
                        <p className="font-medium">{meal}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-3 bg-secondary-content/5 border-none">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-warning-500/10">
                        <ScrollText className="w-4 h-4 text-warning-500" />
                      </div>
                      <div>
                        <p className="text-xs text-foreground/60">Nutrients</p>
                        <p className="font-medium">Details →</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Description */}
                {foodRef.description && (
                  <Card className="p-4 bg-secondary-content/5 border-none">
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {foodRef.description}
                    </p>
                  </Card>
                )}
              </div>
            )}

            {selectedTab === "nutrition" && (
              <div className="space-y-6 p-4">
                {/* Per Serving */}
                <Card className="p-4 bg-secondary-content/5 border-none">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-primary-500" />
                    Per Serving ({food.amount}g)
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-content/10">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-primary-500" />
                        <span>Calories</span>
                      </div>
                      <span className="font-medium">{Math.round(food.nutrition.energy.value)} kcal</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-content/10">
                      <div className="flex items-center gap-2">
                        <Beef className="w-4 h-4 text-success-500" />
                        <span>Protein</span>
                      </div>
                      <span className="font-medium">{Math.round(food.nutrition.protein.value)}g</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-content/10">
                      <div className="flex items-center gap-2">
                        <Wheat className="w-4 h-4 text-warning-500" />
                        <span>Carbohydrates</span>
                      </div>
                      <span className="font-medium">{Math.round(food.nutrition.carbs.value)}g</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-content/10">
                      <div className="flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-danger-500" />
                        <span>Fat</span>
                      </div>
                      <span className="font-medium">{Math.round(food.nutrition.fat.value)}g</span>
                    </div>
                  </div>
                </Card>

                {/* Per 100g */}
                <Card className="p-4 bg-secondary-content/5 border-none">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-secondary-500" />
                    Per 100g
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-content/10">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-primary-500" />
                        <span>Calories</span>
                      </div>
                      <span className="font-medium">
                        {Math.round(foodRef.nutrition_per_100g.energy.value)} kcal
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-content/10">
                      <div className="flex items-center gap-2">
                        <Beef className="w-4 h-4 text-success-500" />
                        <span>Protein</span>
                      </div>
                      <span className="font-medium">
                        {Math.round(foodRef.nutrition_per_100g.protein.value)}g
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-content/10">
                      <div className="flex items-center gap-2">
                        <Wheat className="w-4 h-4 text-warning-500" />
                        <span>Carbohydrates</span>
                      </div>
                      <span className="font-medium">
                        {Math.round(foodRef.nutrition_per_100g.carbs.value)}g
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-content/10">
                      <div className="flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-danger-500" />
                        <span>Fat</span>
                      </div>
                      <span className="font-medium">
                        {Math.round(foodRef.nutrition_per_100g.fat.value)}g
                      </span>
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

// Main MealPlans Component
export default function MealPlans() {
  const { loading, error, client, plans, references } = useClientData();
  const { activePlan, completedPlans, currentDay } = usePlans(plans ?? []);
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

  const mealTimes = {
    'Breakfast': '7:00 AM',
    'Morning Snack': '10:30 AM',
    'Lunch': '1:00 PM',
    'Afternoon Snack': '4:00 PM',
    'Dinner': '7:00 PM',
    'Evening Snack': '9:30 PM'
  };

  // Calculate meal macros
  const getMealMacros = (foods: Food[]) => {
    return foods.reduce((acc, food) => ({
      protein: acc.protein + food.nutrition.protein.value,
      carbs: acc.carbs + food.nutrition.carbs.value,
      fat: acc.fat + food.nutrition.fat.value,
      calories: acc.calories + food.nutrition.energy.value
    }), { protein: 0, carbs: 0, fat: 0, calories: 0 });
  };

  return (
    <div className="min-h-screen w-full bg-background pb-8">
      <div className="container mx-auto py-6 space-y-6">
        {/* Plan Hero */}
        <PlanHero
          plan={currentPlan}
          selectedDay={selectedDay || 1}
          currentDay={currentDay}
          onDaySelect={setSelectedDay}
          selectedPlan={selectedPlan}
          onPlanTypeChange={setSelectedPlan}
          completedPlansCount={completedPlans.length}
          completedPlans={completedPlans}
          historicalPlanIndex={historicalPlanIndex}
          onHistoricalPlanSelect={setHistoricalPlanIndex}
        />

        {/* Meals Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-secondary-content/10" />
            <h2 className="text-xl font-semibold text-foreground/80 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-primary-500" />
              Daily Menu
            </h2>
            <div className="h-px flex-1 bg-secondary-content/10" />
          </div>

          <div className="space-y-4">
            {Object.keys(mealGroups).length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {Object.entries(mealGroups).map(([meal, foods]) => (
                  <MealCard
                    key={meal}
                    meal={meal}
                    foods={foods}
                    foodRefs={references.foods}
                    mealTime={mealTimes[meal as keyof typeof mealTimes] || ''}
                    onFoodClick={(food: Food) => {
                      setSelectedFood({
                        food,
                        foodRef: references.foods[food.ref],
                        meal
                      });
                    }}
                  />
                ))}
              </div>
            ) : (
              <Card isBlurred className="border-none bg-content-secondary/70">
                <CardBody className="p-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-3 rounded-xl bg-primary-500/10">
                      <Moon className="w-8 h-8 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Rest Day</h3>
                      <p className="text-foreground/60">
                        No specific meals planned for today. Feel free to enjoy your favorite healthy foods while maintaining your goals.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>

        {/* Daily Water Target Card */}
        {Object.keys(mealGroups).length > 0 && (
          <Card className="border-none bg-gradient-to-r from-primary-500/5 to-secondary-500/5">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
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
                <div className="flex gap-2">
                  <Chip
                    variant="flat"
                    className="bg-primary-500/10"
                    startContent={<Info className="w-3 h-3" />}
                  >
                    Stay Hydrated
                  </Chip>
                </div>
              </div>
            </CardBody>
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

        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
            <div className="relative flex flex-col items-center gap-4">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              </div>
              <div className="text-foreground/60 font-medium">Loading your meal plan...</div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
            <Card className="max-w-md w-full p-6 text-center space-y-4 border-none">
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
        )}
      </div>
    </div>
  );
}