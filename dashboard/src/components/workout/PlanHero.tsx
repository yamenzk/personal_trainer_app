import { Card, Button, Chip, Switch, CircularProgress } from "@nextui-org/react";
import { motion } from "framer-motion";
import { format, addDays, isToday, differenceInDays } from "date-fns";
import { History, Zap, Calendar, Target, Dumbbell, Timer, Moon, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Plan } from "@/types/plan";
import { cn } from "@/utils/cn";

interface PlanHeroProps {
  plan: Plan;
  selectedDay: number | null;
  currentDay: number | null;
  onDaySelect: (day: number) => void;
  selectedPlan: 'active' | 'history';
  onPlanTypeChange: (key: 'active' | 'history') => void;
  completedPlansCount: number;
  completedPlans: Plan[];
  historicalPlanIndex: number;
  onHistoricalPlanSelect: (index: number) => void;
}

export const PlanHero: React.FC<PlanHeroProps> = ({
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
  }: PlanHeroProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const isCurrentWeek = selectedPlan === 'active';
    const startDate = new Date(plan.start);
    const initialScrollApplied = useRef(false);
  
    useEffect(() => {
      if (!initialScrollApplied.current && scrollRef.current && currentDay) {
        const container = scrollRef.current;
        const dayElements = container.children;
        
        if (dayElements.length > 0) {
          const dayElement = dayElements[currentDay - 1] as HTMLElement;
          if (dayElement) {
            // Calculate the center position
            const containerWidth = container.clientWidth;
            const elementWidth = dayElement.offsetWidth;
            const elementLeft = dayElement.offsetLeft;
            const scrollPosition = elementLeft - (containerWidth / 2) + (elementWidth / 2);
    
            // Apply scroll with a slight delay to ensure layout is ready
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
    }, [currentDay, scrollRef.current]);
  
    // Calculate statistics
    const stats = {
      total: {
        workouts: Object.values(plan.days).reduce((total: number, day: any) => 
          total + (day.exercises?.length > 0 ? 1 : 0), 0),
        exercises: Object.values(plan.days).reduce((total: number, day: any) => 
          total + (day.exercises?.length || 0), 0),
      },
      completed: {
        workouts: Object.values(plan.days).filter((day: any) => 
          day.exercises?.length > 0 && day.exercises.every((e: any) => 
            e.type === 'regular' ? e.exercise.logged : e.exercises.every((ex: any) => ex.logged)
          )
        ).length,
        exercises: Object.values(plan.days).reduce((total: number, day: any) => 
          total + (day.exercises?.filter((e: any) => 
            e.type === 'regular' ? e.exercise.logged : e.exercises.every((ex: any) => ex.logged)
          ).length || 0), 0),
      }
    };
  
    // Calculate streak (counting consecutive days with completed workouts)
    const calculateStreak = () => {
      let streak = 0;
      let currentStreak = 0;
      const today = new Date();
  
      for (let i = 0; i < completedPlans.length; i++) {
        const plan = completedPlans[i];
        const planEnd = new Date(plan.end);
        
        // Only count streaks up to today
        if (differenceInDays(planEnd, today) > 0) continue;
  
        Object.values(plan.days).forEach((day: any) => {
          if (day.exercises?.length > 0 && 
              day.exercises.every((e: any) => 
                e.type === 'regular' ? e.exercise.logged : e.exercises.every((ex: any) => ex.logged)
              )) {
            currentStreak++;
            streak = Math.max(streak, currentStreak);
          } else {
            currentStreak = 0;
          }
        });
      }
      return streak;
    };
  
    const DayButton = ({ dayIndex }: { dayIndex: number }) => {
      const date = addDays(startDate, dayIndex - 1);
      const dayKey = `day_${dayIndex}`;
      const dayData = plan.days[dayKey];
      const exerciseCount = dayData?.exercises?.length || 0;
      const isCompleted = dayData?.exercises?.every((e: any) => 
        e.type === 'regular' ? e.exercise.logged : e.exercises.every((ex: any) => ex.logged)
      );
      const isSelected = selectedDay === dayIndex;
      const isCurrent = isToday(date);
  
      return (
        <Button
          className={cn(
            "w-[90px] h-[90px] p-3",
            "flex flex-col items-center justify-between",
            "transition-all duration-300",
            "bg-foreground/5 hover:bg-foreground/10",
            isSelected && "bg-gradient-to-br from-primary-500 to-secondary-500 text-white scale-105 shadow-lg",
            isCompleted && !isSelected && "bg-success-500/10 hover:bg-success-500/20",
            isCurrent && !isSelected && "bg-primary-500/10 hover:bg-primary-500/20",
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
  
          {exerciseCount > 0 ? (
            <Chip
              size="sm"
              className={cn(
                "h-5 px-2",
                isSelected 
                  ? "bg-white/20 text-white" 
                  : isCompleted
                    ? "bg-success-500/20 text-success-500"
                    : "bg-content/10"
              )}
            >
              <div className="flex items-center gap-1">
                <Dumbbell className="w-3 h-3" />
                <span className="text-xs">{exerciseCount}</span>
              </div>
            </Chip>
          ) : (
            <Chip
              size="sm"
              className={cn(
                "h-5 px-2", "bg-content/10"
              )}
            >
              <Moon className="w-3 h-3" />
            </Chip>
          )}
  
          {(isCompleted || (isCurrent && !isCompleted)) && (
            <div className="absolute -top-0 -right-0">
              {isCompleted ? (
                <div className="w-5 h-5 rounded-tr-lg rounded-bl-lg bg-success-500 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              ) : isCurrent && (
                <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          )}
        </Button>
      );
    };
  
    return (
      <Card className="relative overflow-hidden border-none">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-secondary-500/5 to-primary-500/5" />
        
        {/* Content */}
        <div className="relative p-4 space-y-4">
          {/* Top Row with Progress and History Switch */}
          <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
    <Switch
    size="sm"
    color="danger"
    startContent={<History className="w-3 h-3" />}
    endContent={<Zap className="w-3 h-3" />}
    isSelected={selectedPlan === 'history'}
    onValueChange={(isSelected) => onPlanTypeChange(isSelected ? 'history' : 'active')}
    isDisabled={completedPlansCount === 0}
    classNames={{
      wrapper: selectedPlan === 'active' ? "bg-secondary-500" : "bg-primary-500", // Apply bg-secondary-500 only when selectedPlan is 'active'
    }}
  >
    <span className="text-xs">
      {selectedPlan === 'history' ? 'History Mode' : 'Current Week'}
    </span>
  </Switch>
  
      {selectedPlan === 'history' && (
        <Chip size="sm" >
          Week {completedPlans.length - historicalPlanIndex} of {completedPlans.length}
        </Chip>
      )}
    </div>
            
            <CircularProgress
              value={(stats.completed.exercises / stats.total.exercises) * 100}
              color="primary"
              classNames={{
                svg: "w-12 h-12 drop-shadow",
                indicator: "stroke-primary-500",
                track: "stroke-white/10",
                value: "text-sm font-semibold text-primary-500",
              }}
              aria-label="Progress"
              showValueLabel={true}
              valueLabel={`${Math.round((stats.completed.exercises / stats.total.exercises) * 100)}%`}
            />
          </div>
  
          {/* Date Navigation Row */}
          <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      {selectedPlan === 'history' && (
        <Button
          isIconOnly
          variant="flat"
          isDisabled={historicalPlanIndex === completedPlans.length - 1}
          onPress={() => onHistoricalPlanSelect(historicalPlanIndex + 1)}
          className="bg-content/5"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      )}
  
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-primary-500" />
        <h3 className="text-base font-semibold">
          {format(startDate, 'MMM d')} - {format(addDays(startDate, 6), 'MMM d')}
        </h3>
      </div>
  
      {selectedPlan === 'history' && (
        <Button
          isIconOnly
          variant="flat"
          isDisabled={historicalPlanIndex === 0}
          onPress={() => onHistoricalPlanSelect(historicalPlanIndex - 1)}
          className="bg-content/5"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  </div>
  
          {/* Stats Row - Now with more space */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-content/5 p-3 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-secondary-500/10">
                <Target className="w-4 h-4 text-secondary-500" />
              </div>
              <div>
                <p className="text-xs text-foreground/60">Workouts</p>
                <p className="text-sm font-semibold">
                  {stats.completed.workouts}/{stats.total.workouts}
                </p>
              </div>
            </div>
  
            <div className="rounded-xl bg-content/5 p-3 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-success-500/10">
                <Dumbbell className="w-4 h-4 text-success-500" />
              </div>
              <div>
                <p className="text-xs text-foreground/60">Exercises</p>
                <p className="text-sm font-semibold">
                  {stats.completed.exercises}/{stats.total.exercises}
                </p>
              </div>
            </div>
  
            <div className="rounded-xl bg-content/5 p-3 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-warning-500/10">
                <Timer className="w-4 h-4 text-warning-500" />
              </div>
              <div>
                <p className="text-xs text-foreground/60">Streak</p>
                <p className="text-sm font-semibold">{calculateStreak()} days</p>
              </div>
            </div>
          </div>
  
          {/* Days Row */}
          <div className="relative -mx-4 px-4">
            {/* Shadow Indicators */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />
  
            <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex gap-2 overflow-x-auto hide-scrollbar py-2 -mx-2 px-2"
    ref={scrollRef}
    style={{
      scrollSnapType: 'x mandatory',
      WebkitOverflowScrolling: 'touch',
      scrollBehavior: 'smooth' // Added for smoother scrolling
    }}
  >
    {Array.from({ length: 7 }, (_, i) => (
      <div
        key={i + 1}
        className="flex-none"
        style={{ scrollSnapAlign: 'center' }}
      >
        <DayButton dayIndex={i + 1} />
      </div>
    ))}
  </motion.div>
          </div>
        </div>
      </Card>
    );
  };
