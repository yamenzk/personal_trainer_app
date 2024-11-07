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
} from "lucide-react";
import { format, addDays, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Plan } from "@/types/plan";
import { Food, FoodReference, NutritionInfo } from "@/types/meal";

// Enhanced DayButton Component
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

// Macro Progress Card Component
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

// Food Card Component
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

// Food Details Modal
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

export {
    DayButton,
    MacroProgress,
    FoodCard,
    FoodDetailsModal,
  };