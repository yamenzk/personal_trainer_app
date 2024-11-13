import { Card, Button, Chip, Switch } from "@nextui-org/react";
import { motion, LayoutGroup } from "framer-motion";
import { format, addDays, differenceInDays } from "date-fns";
import { History, Zap, Calendar, Target, Dumbbell, Moon, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { useRef, useEffect } from "react";
import { PlanHeroProps } from "@/types";
import { cn } from "@/utils/cn";
import { ContextualTip } from "./ContextualTip";

const WeekProgress = ({ completed, total }: { completed: number, total: number }) => {
  const percentage = (completed / total) * 100;
  return (
    <div className="relative h-1.5 w-full bg-content/10 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        className="absolute h-full bg-gradient-to-r from-primary-500 to-secondary-500"
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

export const PlanHero: React.FC<PlanHeroProps> = ({
  plan,
  selectedDay,
  onDaySelect,
  selectedPlan,
  onPlanTypeChange,
  completedPlansCount,
  completedPlans,
  historicalPlanIndex,
  onHistoricalPlanSelect,
}: PlanHeroProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedDay && scrollRef.current) {
      const scrollContainer = scrollRef.current;
      const selectedElement = scrollContainer.children[selectedDay - 1] as HTMLElement;
      
      if (selectedElement) {
        const containerWidth = scrollContainer.clientWidth;
        const elementWidth = selectedElement.offsetWidth;
        const scrollLeft = selectedElement.offsetLeft - (containerWidth / 2) + (elementWidth / 2);
        
        scrollContainer.scrollTo({
          left: Math.max(0, scrollLeft),
          behavior: 'smooth'
        });
      }
    }
  }, [selectedDay]);


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

  // Calculate streak
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
    const date = addDays(new Date(plan.start), dayIndex - 1);
    const today = new Date();
    const dayKey = `day_${dayIndex}`;
    const dayData = plan.days[dayKey];
    const exerciseCount = dayData?.exercises?.length || 0;
    const isCompleted = dayData?.exercises?.every((e: any) =>
      e.type === 'regular' ? e.exercise.logged : e.exercises.every((ex: any) => ex.logged)
    );
    const isSelected = selectedDay === dayIndex;
    const isCurrent = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative"
      >
        <Card
          isPressable
          onPress={() => onDaySelect(dayIndex)}
          className={cn(
            "w-[68px] min-h-[84px]",
            "flex flex-col items-center justify-between",
            "transition-all duration-300",
            "relative overflow-hidden",
            // Selected states
            isSelected && "bg-gradient-to-br from-primary-500 via-primary-400 to-secondary-500 border-none",
            // Regular day with exercises
            !isSelected && exerciseCount > 0 && "bg-secondary-500/5 border-secondary-500/20",
            // Completed states
            !isSelected && isCompleted && "bg-success-500/5 border-success-500/20",
            // Current day states
            !isSelected && isCurrent && "bg-warning-500/5 border-warning-500/20",
            // Rest day (no exercises)
            !isSelected && !exerciseCount && !isCurrent && "bg-content/5 border-content/10",
          )}
        >
          {/* Completion Pattern - only show for completed days */}
          {isCompleted && !isSelected && (
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <pattern id="completion-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="1" fill="currentColor" />
                </pattern>
                <rect x="0" y="0" width="100" height="100" fill="url(#completion-pattern)" />
              </svg>
            </div>
          )}

          <div className="flex flex-col items-center gap-1 p-2">
            {/* Date Section */}
            <span className={cn(
              "text-xs font-medium",
              isSelected ? "text-white/90" : "text-foreground/60"
            )}>
              {format(date, 'EEE')}
            </span>
            <span className={cn(
              "text-xl font-bold",
              isSelected ? "text-white" : 
              isCurrent ? "text-warning-500" : 
              "text-foreground"
            )}>
              {format(date, 'd')}
            </span>

            {/* Exercise Indicator */}
            {exerciseCount > 0 ? (
              <div className={cn(
                "flex items-center gap-1",
                "px-2 py-0.5 rounded-full",
                "text-xs font-medium",
                isSelected && "bg-white/20 text-white",
                isCompleted && !isSelected && "bg-success-500/20 text-success-500",
                !isSelected && !isCompleted && "bg-secondary-500/10 text-secondary-500"
              )}>
                <Dumbbell className="w-3 h-3" />
                {exerciseCount}
              </div>
            ) : (
              <div className={cn(
                "p-1 rounded-full",
                isSelected ? "bg-white/20" : "bg-content/10"
              )}>
                <Moon className={cn(
                  "w-3 h-3",
                  isSelected ? "text-white/70" : "text-foreground/40"
                )} />
              </div>
            )}
          </div>

          {/* Bottom Status Bar */}
          {(exerciseCount > 0 || isCompleted || isCurrent) && (
            <div className={cn(
              "absolute bottom-0 left-0 right-0 h-1",
              "transition-all duration-300",
              // Selected states
              isSelected && isCompleted && "bg-white/30",
              isSelected && !isCompleted && "bg-white/20",
              // Current day states
              !isSelected && isCurrent && isCompleted && "bg-warning-500",
              !isSelected && isCurrent && !isCompleted && "bg-primary-500",
              // Completed state
              !isSelected && isCompleted && !isCurrent && "bg-success-500",
              // Regular day with exercises
              !isSelected && !isCompleted && !isCurrent && exerciseCount > 0 && "bg-secondary-500"
            )} />
          )}
        </Card>
      </motion.div>
    );
  };

  return (
    <LayoutGroup>
      <Card className="border-none bg-content2 rounded-none shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)] rounded-b-4xl overflow-visible">
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
                    isDisabled={historicalPlanIndex === completedPlans.length - 1}
                    onPress={() => onHistoricalPlanSelect(historicalPlanIndex + 1)}
                    className="bg-content/5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <Chip size="sm" className="bg-content/10 border border-content/20">
                    Week {completedPlans.length - historicalPlanIndex}
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
              isDisabled={completedPlansCount === 0}
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
                {format(new Date(plan.start), 'MMMM d')} - {format(addDays(new Date(plan.start), 6), 'MMMM d')}
                </h2>
              </div>
              <div className="flex items-center gap-6">
                {/* Stats and Progress */}
                <div className="flex items-center gap-4 text-sm text-foreground/60">
                  <span className="flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-secondary-500" />
                    <span>{stats.completed.workouts}/{stats.total.workouts} workouts</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-warning-500" />
                    <span>{calculateStreak()} day streak</span>
                  </span>
                  {/* Inline Progress Bar */}
                  <div className="w-32 h-1.5">
                    <WeekProgress
                      completed={stats.completed.exercises}
                      total={stats.total.exercises}
                    />
                  </div>
                </div>
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
                <div key={i + 1} className="flex-none relative">
                  <DayButton dayIndex={i + 1} />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </Card>
      <ContextualTip
          plan={plan}
          selectedDay={selectedDay}
          completedWorkouts={stats.completed.workouts}
          totalWorkouts={stats.total.workouts}
          streak={calculateStreak()}
        />
    </LayoutGroup>
  );
};