import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody, Button, Chip, Avatar, AvatarGroup } from "@nextui-org/react";
import { Coffee, UtensilsCrossed, Cookie, Apple, Moon, ChevronDown, Flame, Beef, Wheat, Droplet, Clock, LucideIcon, Dumbbell, Zap, Pill, Weight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Food, FoodReference } from "@/types";

// Helper function to generate random emoji pattern
const generateEmojiPattern = (emojis: string[]) => {
  return Array.from({ length: 12 }, () => ({
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 40 - 20,
    scale: 0.5 + Math.random() * 0.5,
    opacity: 0.07 + Math.random() * 0.08
  }));
};

export const mealStyles: Record<string, {
  gradient: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  accent: string;
  emojis: string[];
}> = {
  'Breakfast': {
    gradient: "from-amber-500/30 via-orange-500/30 to-yellow-500/30",
    icon: Coffee,
    iconBg: "bg-amber-500/30",
    iconColor: "text-amber-500",
    accent: "#f59e0b",
    emojis: ['☕️', '🥚', '🥐', '🥞', '🥓']
  },
  'Snack 1': {
    gradient: "from-emerald-500/30 via-green-500/30 to-lime-500/30",
    icon: Apple,
    iconBg: "bg-emerald-500/30",
    iconColor: "text-emerald-500",
    accent: "#10b981",
    emojis: ['🍎', '🍌', '🥜', '🫐', '🍇']
  },
  'Snack 2': {
    gradient: "from-violet-500/30 via-purple-500/30 to-fuchsia-500/30",
    icon: Cookie,
    iconBg: "bg-violet-500/30",
    iconColor: "text-violet-500",
    accent: "#8b5cf6",
    emojis: ['🍪', '🥨', '🥜', '🧃', '🫐']
  },
  'Snack 3': {
    gradient: "from-pink-500/30 via-rose-500/30 to-red-500/30",
    icon: Moon,
    iconBg: "bg-pink-500/30",
    iconColor: "text-pink-500",
    accent: "#ec4899",
    emojis: ['🥛', '🍪', '🫐', '🍌', '🥜']
  },
  'Lunch': {
    gradient: "from-blue-500/30 via-sky-500/30 to-cyan-500/30",
    icon: UtensilsCrossed,
    iconBg: "bg-blue-500/30",
    iconColor: "text-blue-500",
    accent: "#3b82f6",
    emojis: ['🥗', '🥩', '🍚', '🥑', '🥕']
  },
  'Dinner': {
    gradient: "from-indigo-500/30 via-blue-500/30 to-violet-500/30",
    icon: UtensilsCrossed,
    iconBg: "bg-indigo-500/30",
    iconColor: "text-indigo-500",
    accent: "#6366f1",
    emojis: ['🍗', '🥬', '🥔', '🥦', '🍖']
  },
  'Pre-workout': {
    gradient: "from-red-500/30 via-orange-500/30 to-yellow-500/30",
    icon: Dumbbell,
    iconBg: "bg-red-500/30",
    iconColor: "text-red-500",
    accent: "#ef4444",
    emojis: ['🏋️‍♂️', '🍌', '☕️', '🥤', '⚡️']
  },
  'Post-workout': {
    gradient: "from-teal-500/30 via-cyan-500/30 to-sky-500/30",
    icon: Zap,
    iconBg: "bg-teal-500/30",
    iconColor: "text-teal-500",
    accent: "#14b8a6",
    emojis: ['🥛', '🥝', '🍗', '🥑', '💪']
  },
  'Supplement': {
    gradient: "from-lime-500/30 via-green-500/30 to-emerald-500/30",
    icon: Pill,
    iconBg: "bg-lime-500/30",
    iconColor: "text-lime-500",
    accent: "#84cc16",
    emojis: ['💊', '🥤', '💪', '⚡️', '🏃‍♂️']
  }
};

interface MealCardProps {
  meal: string;
  foods: Food[];
  foodRefs: Record<string, FoodReference>;
  mealTime: string;
  onFoodClick: (food: Food) => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  meal,
  foods,
  foodRefs,
  mealTime,
  onFoodClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const style = mealStyles[meal] || mealStyles['Snack 1']; // Default fallback
  
  // Generate emoji pattern once using useMemo
  const emojiElements = useMemo(() => 
    generateEmojiPattern(style.emojis),
    [meal]
  );

  const mealTotals = foods.reduce((acc, food) => ({
    calories: acc.calories + food.nutrition.energy.value,
    protein: acc.protein + food.nutrition.protein.value,
    carbs: acc.carbs + food.nutrition.carbs.value,
    fat: acc.fat + food.nutrition.fat.value
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  // Helper function for consistent macro chips
  const MacroChip = ({ 
    icon: Icon, 
    value, 
    type, 
  }: { 
    icon: LucideIcon; 
    value: number; 
    type: 'primary' | 'warning' | 'danger';
    prefix?: string;
  }) => (
    <Chip
      size="sm"
      className={cn(
        "border border-content/20",
        type === 'primary' && "bg-primary-500/10 border-primary-500/20",
        type === 'warning' && "bg-warning-500/10 border-warning-500/20",
        type === 'danger' && "bg-danger-500/10 border-danger-500/20"
      )}
      startContent={
        <Icon className={cn(
          "w-3 h-3",
          type === 'primary' && "text-primary-500",
          type === 'warning' && "text-warning-500",
          type === 'danger' && "text-danger-500"
        )} />
      }
    >
      {Math.round(value)}g
    </Chip>
  );

  // Helper function to determine avatar color based on meal type
  const getAvatarColor = (mealType: string) => {
    switch(mealType) {
      case 'Breakfast': return 'warning';
      case 'Snack 1': return 'success'
      case 'Lunch': return 'primary';
      case 'Dinner': return 'primary';
      case 'Pre-workout': return 'danger';
      case 'Post-workout': return 'success';
      case 'Supplement': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <Card
      className={cn(
        "border-none overflow-hidden transition-all duration-300 w-full relative group",
        "bg-content-secondary/5 backdrop-blur-sm hover:bg-content-secondary/10"
      )}
    >
      {/* Enhanced gradient background with animation */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-90 transition-opacity duration-300 rounded-large",
        style.gradient,
        "group-hover:opacity-100"
      )} />
      
      {/* Emoji pattern background */}
      <div className="absolute inset-0 rounded-large overflow-hidden">
        {emojiElements.map((item, index) => (
          <div
            key={index}
            className="absolute transition-opacity duration-300"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
              opacity: item.opacity,
              fontSize: '24px'
            }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      {/* Animated glow effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-large"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${style.accent}, transparent 70%)`
        }}
      />

      <CardBody className="p-0 relative">
        {/* Main Card Content */}
        <div 
          className="p-4 space-y-4 cursor-pointer" 
          onClick={() => setIsExpanded(!isExpanded)}
          role="button"
          tabIndex={0}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg transition-all duration-300",
                style.iconBg
              )}>
                <style.icon className={cn("w-5 h-5", style.iconColor)} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{meal}</h3>
                {mealTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-foreground/50" />
                    <span className="text-sm text-foreground/50">{mealTime}</span>
                  </div>
                )}
              </div>
            </div>
            <Button
              isIconOnly
              variant="light"
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "w-8 h-8 transition-transform duration-300",
                isExpanded && "rotate-180"
              )}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Updated Food Previews with proper coloring */}
          <div className="flex items-center gap-3">
            <AvatarGroup
              max={5}
              size="md"
              className="flex-none"
              renderCount={(count) => (
                <Avatar
                  isBordered
                  color={getAvatarColor(meal)}
                  radius="full"
                  size="md"
                  fallback={<span className="text-xs font-medium">+{count}</span>}
                />
              )}
            >
              {foods.map((food) => (
                <Avatar
                  key={food.ref}
                  isBordered
                  color={getAvatarColor(meal)}
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

          {/* Nutrition Summary */}
          <div className="flex items-center justify-between gap-2">
            <Chip
              size="sm"
              className="bg-content/10 border border-content/20"
              startContent={<Flame className="w-3 h-3" />}
            >
              {Math.round(mealTotals.calories)} kcal
            </Chip>
            <div className="flex gap-1">
              <MacroChip
                icon={Beef}
                value={mealTotals.protein}
                type="primary"
              />
              <MacroChip
                icon={Wheat}
                value={mealTotals.carbs}
                type="warning"
              />
              <MacroChip
                icon={Droplet}
                value={mealTotals.fat}
                type="danger"
              />
            </div>
          </div>
        </div>

        {/* Expandable Food List */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden w-full"
            >
              <div className="p-4 space-y-3 bg-content/5 w-full">
                {foods.map((food) => (
                  <Card
                    key={food.ref}
                    isPressable
                    shadow="none"
                    className={cn(
                      "bg-content/5 hover:bg-content/10 w-full",
                      "transition-all duration-300"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onFoodClick(food);
                    }}
                  >
                    <CardBody className="p-3">
                      <div className="flex gap-4 w-full">
                        {/* Left side - Image */}
                        <Avatar
                          isBordered
                          color={getAvatarColor(meal)}
                          radius="lg"
                          src={foodRefs[food.ref]?.image}
                          className="w-14 h-14 flex-shrink-0"
                          classNames={{
                            img: "object-cover"
                          }}
                        />
                        
                        {/* Right side - Content */}
                        <div className="flex-1 min-w-0">
                          {/* Top row - Name and Weight */}
                          <div className="flex items-start justify-between w-full mb-2">
                            <h4 className="font-medium text-base truncate">
                              {foodRefs[food.ref]?.title}
                            </h4>
                            <Chip
                              size="sm"
                              className="bg-content/10 flex-shrink-0"
                              variant="flat"
                              startContent={<Weight className="w-3 h-3" />}
                            >
                              {food.amount}g
                            </Chip>
                          </div>

                          {/* Bottom row - Calories and Macros */}
                          <div className="flex items-center justify-between w-full">
                            <Chip
                              size="sm"
                              className="bg-content/10 border border-content/20"
                              startContent={<Flame className="w-3 h-3" />}
                            >
                              {Math.round(food.nutrition.energy.value)} kcal
                            </Chip>
                            <div className="flex gap-1">
                              <MacroChip
                                icon={Beef}
                                value={food.nutrition.protein.value}
                                type="primary"
                              />
                              <MacroChip
                                icon={Wheat}
                                value={food.nutrition.carbs.value}
                                type="warning"
                              />
                              <MacroChip
                                icon={Droplet}
                                value={food.nutrition.fat.value}
                                type="danger"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardBody>
    </Card>
  );
};

export const mealIcons: Record<string, LucideIcon> = {
  'Breakfast': Coffee,
  'Lunch': UtensilsCrossed,
  'Dinner': UtensilsCrossed,
  'Snack': Cookie,
  'Morning Snack': Apple,
  'Afternoon Snack': Cookie,
  'Evening Snack': Moon
};