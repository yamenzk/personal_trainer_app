import { Card, Button, Chip, Switch } from "@nextui-org/react";
import { motion, LayoutGroup } from "framer-motion";
import { format, addDays } from "date-fns";
import { History, Zap, Calendar, ChevronLeft, ChevronRight, Flame, Beef, Wheat, Droplet, ShoppingBasket } from "lucide-react";
import { useState, useRef, useEffect } from "react"; 
import { cn } from "@/utils/cn";
import type { MealPlanHeroProps } from "@/types";
import { GroceryListModal } from "./GroceryListModal";
import React from "react";


// Replace MacroCard with MacroStat inline component
const MacroStat = ({ icon: Icon, value, unit, color }: any) => (
  <span className="flex items-center gap-1.5 text-foreground/60">
    <Icon className={`w-4 h-4 text-${color}-500`} />
    <span>
      {value}{unit}
    </span>
  </span>
);

// Update DayCard to match workout style but without completion state
const DayCard = ({ dayIndex, date, isSelected, onSelect }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Card
      isPressable
      onPress={() => onSelect(dayIndex)}
      className={cn(
        "w-[68px]",
        "flex flex-col items-center justify-between",
        "transition-all duration-300",
        "relative overflow-hidden",
        isSelected && "bg-gradient-to-br from-primary-500 via-primary-400 to-secondary-500 border-none",
        !isSelected && "bg-content/5 border-content/10"
      )}
    >
      <div className="flex flex-col items-center gap-1 p-2">
        <span className={cn(
          "text-xs font-medium",
          isSelected ? "text-white/90" : "text-foreground/60"
        )}>
          {format(date, 'EEE')}
        </span>
        <span className={cn(
          "text-xl font-bold",
          isSelected ? "text-white" : "text-foreground"
        )}>
          {format(date, 'd')}
        </span>
      </div>
    </Card>
  </motion.div>
);

export const MealPlanHero: React.FC<MealPlanHeroProps> = React.memo(({
  plan,
  selectedDay,
  onDaySelect,
  selectedPlan,
  onPlanTypeChange,
  completedPlansCount,
  completedPlans,
  historicalPlanIndex,
  onHistoricalPlanSelect,
  foodRefs,
  isChangingPlan,
}) => {
  const [showGroceryList, setShowGroceryList] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);
  
  // Add null checks for plan and targets
  const targets = plan?.targets || {
    energy: 0,
    proteins: 0,
    carbs: 0,
    fats: 0
  };

  // Add initialization effect with null checks
  useEffect(() => {
    if (
      !initRef.current && 
      selectedPlan === 'active' && 
      !selectedDay && 
      plan?.start
    ) {
      const today = new Date();
      const todayString = format(today, 'yyyy-MM-dd');
      const planStart = new Date(plan.start);

      for (let i = 1; i <= 7; i++) {
        const currentDate = addDays(planStart, i - 1);
        const currentDateString = format(currentDate, 'yyyy-MM-dd');

        if (currentDateString === todayString) {
          onDaySelect(i);
          initRef.current = true;
          break;
        }
      }
    }
  }, [selectedPlan, plan, selectedDay, onDaySelect]);

  // Add scroll effect
  useEffect(() => {
    if (!selectedDay || !scrollRef.current) return;
    
    const scrollContainer = scrollRef.current;
    const selectedElement = scrollContainer.children[selectedDay - 1] as HTMLElement;
    
    if (selectedElement) {
      requestAnimationFrame(() => {
        const containerWidth = scrollContainer.clientWidth;
        const elementWidth = selectedElement.offsetWidth;
        const scrollLeft = selectedElement.offsetLeft - (containerWidth / 2) + (elementWidth / 2);
        
        scrollContainer.scrollTo({
          left: Math.max(0, scrollLeft),
          behavior: 'smooth'
        });
      });
    }
  }, [selectedDay]);

  // Reset initialization when plan changes
  useEffect(() => {
    if (plan?.start) {
      initRef.current = false;
    }
  }, [plan?.start]);

  // Add null check for plan
  if (!plan) return null;

  return (
    <LayoutGroup>
      <Card 
        className={cn(
          "border-none bg-content2 rounded-none shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)] rounded-b-4xl overflow-visible",
          "transition-all duration-300 ease-in-out",
          isChangingPlan && "opacity-50 pointer-events-none"
        )}
      >
        {isChangingPlan && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/5 backdrop-blur-sm rounded-b-4xl">
            <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
          </div>
        )}
        <div className="p-6 space-y-4">
          {/* Top Row: Week Indicator and Mode Switch */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedPlan === 'history' ? (
                <>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    isDisabled={historicalPlanIndex === (completedPlans?.length ?? 0) - 1}
                    onPress={() => onHistoricalPlanSelect(historicalPlanIndex + 1)}
                    className="bg-content/5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <Chip size="sm" className="bg-content/10 border border-content/20">
                    Week {(completedPlans?.length ?? 0) - historicalPlanIndex}
                  </Chip>

                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    isDisabled={historicalPlanIndex === 0}
                    onPress={() => onHistoricalPlanSelect(historicalPlanIndex - 1)}
                    className="bg-content/5"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Chip 
                  size="sm" 
                  className="bg-secondary-500/10 border border-secondary-500/20"
                  startContent={<Zap className="w-3 h-3 text-secondary-500" />}
                >
                  Current Week
                </Chip>
              )}
            </div>

            <Switch
              classNames={{
                wrapper: cn(
                  selectedPlan === 'active' 
                    ? "bg-secondary-500" 
                    : "bg-primary-500"
                ),
              }}
              size="sm"
              startContent={<History className="w-3 h-3" />}
              endContent={<Zap className="w-3 h-3" />}
              isSelected={selectedPlan === 'history'}
              onValueChange={(isSelected) => onPlanTypeChange(isSelected ? 'history' : 'active')}
              isDisabled={!completedPlansCount}
            >
              <span className="text-sm font-medium">
                {selectedPlan === 'history' ? 'History' : 'Current'}
              </span>
            </Switch>
          </div>

          {/* Header Section with Stats */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-bold tracking-tight">
                  {format(new Date(plan.start), 'MMM d')} - {format(addDays(new Date(plan.start), 6), 'MMM d')}
                  <Chip
                    size="sm"
                    variant="flat"
                    className={cn(
                      "cursor-pointer hover:bg-content2 transition-colors",
                      "border border-content1/30",
                      "mx-2",
                      "bg-content1/25"
                    )}
                    startContent={<ShoppingBasket className="w-4 h-4 text-secondary-500" />}
                    onClick={() => setShowGroceryList(true)}
                  >
                    <span className="font-medium text-secondary-500">Grocery List</span>
                  </Chip>
                </h2>
              </div>
              {/* Inline Macro Stats */}
              <div className="flex items-center gap-4 justify-between w-full">
                <MacroStat
                  icon={Flame}
                  value={targets.energy}
                  unit="kcal"
                  color="primary"
                />
                <MacroStat
                  icon={Beef}
                  value={targets.proteins}
                  unit="g"
                  color="success"
                />
                <MacroStat
                  icon={Wheat}
                  value={targets.carbs}
                  unit="g"
                  color="warning"
                />
                <MacroStat
                  icon={Droplet}
                  value={targets.fats}
                  unit="g"
                  color="danger"
                />
              </div>
            </div>
          </div>

          {/* Days Scroller */}
          <div className="relative -mx-6">
            <motion.div
              ref={scrollRef}
              className="flex gap-2 overflow-x-auto hide-scrollbar py-2 px-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i + 1} className="flex-none">
                  <DayCard
                    dayIndex={i + 1}
                    date={addDays(new Date(plan.start), i)}
                    isSelected={selectedDay === i + 1}
                    onSelect={onDaySelect}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </Card>

      {/* Grocery List Modal */}
      {showGroceryList && (
        <GroceryListModal
          isOpen={showGroceryList}
          onClose={() => setShowGroceryList(false)}
          plan={plan}
          foodRefs={foodRefs}
          isPastPlan={selectedPlan === 'history'}
          weekNumber={selectedPlan === 'history' ? (completedPlans?.length ?? 0) - historicalPlanIndex : undefined}
        />
      )}
    </LayoutGroup>
  );
});
