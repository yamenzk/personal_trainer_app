import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Button, cn, Skeleton } from "@nextui-org/react";
import { Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays } from "date-fns";

// Components
import { ExerciseCard } from "../components/workout/ExerciseCard";
import { SupersetCard } from "../components/workout/SupersetCard";
import { RestDayCard } from "../components/workout/RestDay";
import { PlanHero } from "../components/workout/PlanHero";
import { ExerciseDetailsModal } from "../components/workout/ExerciseDetailsModal";
import { PerformanceModal } from "../components/workout/PerformanceModal";
import { PageTransition } from "@/components/shared/PageTransition";
import { WorkoutErrorBoundary } from "@/components/shared/WorkoutErrorBoundary";
import { insertWorkoutTips, TipCard, workoutTips } from "@/components/workout/WorkoutTips";
import { NoActivePlan } from "@/components/shared/NoActivePlan";

// Hooks and Utils
import { usePlans } from "../hooks/usePlans";
import { logPerformance } from "../utils/api";
import { useClientStore } from "@/stores/clientStore";

// Types
import {
  ExerciseBase,
  ExerciseReference,
  Client,
  Plan,
  Exercise,
  WorkoutTip
} from '@/types';

interface ExerciseItem {
  type: 'regular' | 'superset' | 'tip';
  exercise?: ExerciseBase;
  exercises?: ExerciseBase[];
  content?: any;
}

const SectionTitle = () => (
  <div className="flex items-center gap-4 my-6">
    <div className="h-px flex-1 bg-content-secondary/10" />
    <h2 className="text-xl font-semibold text-foreground/80 flex items-center gap-2">
      <Dumbbell className="w-5 h-5" />
      Exercises
    </h2>
    <div className="h-px flex-1 bg-content-secondary/10" />
  </div>
);

// Skeleton Component
const WorkoutPlanSkeleton = () => {
  return (
    <div className="min-h-screen w-full bg-transparent relative overflow-hidden">
      <div className="container mx-auto">
        {/* Hero Card Section */}
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full rounded-none rounded-b-4xl h-[220px]">
            <div className="p-6 space-y-4">
              {/* Top Row */}
              <div className="flex justify-between">
                <Skeleton className="w-32 h-8 rounded-lg" />
                <Skeleton className="w-24 h-8 rounded-lg" />
              </div>

              {/* Title Row */}
              <div className="space-y-2">
                <Skeleton className="w-64 h-8 rounded-lg" />
                <Skeleton className="w-96 h-6 rounded-lg" />
              </div>

              {/* Days Row */}
              <div className="flex gap-2 mt-4 overflow-hidden">
                {[...Array(7)].map((_, i) => (
                  <Skeleton key={i} className="w-[68px] h-[84px] rounded-xl flex-shrink-0" />
                ))}
              </div>
            </div>
          </Skeleton>

          {/* Contextual Tip */}
          <div className="px-6">
            <Skeleton className="w-64 h-8 rounded-full mx-auto" />
          </div>
        </div>

        {/* Centered Content Container */}
        <div className="flex justify-center mt-8">
          <div className="w-full max-w-3xl px-4">
            {/* Section Title */}
            <div className="flex items-center gap-4 my-6">
              <div className="h-px flex-1 bg-content-secondary/10" />
              <Skeleton className="w-32 h-8 rounded-lg" />
              <div className="h-px flex-1 bg-content-secondary/10" />
            </div>

            {/* Exercise Cards */}
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="w-full h-[300px] rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getItemKey = (item: ExerciseItem, index: number): string => {
  if (item.type === "tip") return `tip-${index}`;
  if (item.type === "regular") return `exercise-${item.exercise?.ref}-${index}`;
  return `superset-${index}`;
};

// Move tip handling to the top level
const useTipHandler = () => {
  const [sessionUsedTips] = useState(() => new Set<string>());

  const insertTips = useCallback((exercises: Exercise[]) => {
    if (!exercises?.length || exercises.length <= 1) return exercises;

    // Reset tips if needed
    if (sessionUsedTips.size > (workoutTips.length * 0.75)) {
      sessionUsedTips.clear();
    }

    const maxTips = Math.min(3, exercises.length - 1);
    const numberOfTips = Math.floor(Math.random() * maxTips) + 1;
    
    const availablePositions = exercises.reduce<number[]>((acc, _, index) => {
      if (index > 0 && !acc.includes(index - 1) && !acc.includes(index + 1)) {
        acc.push(index);
      }
      return acc;
    }, []);

    const tipPositions = new Set(
      availablePositions
        .sort(() => Math.random() - 0.5)
        .slice(0, numberOfTips)
    );

    const availableTips = workoutTips.filter(tip => 
      !sessionUsedTips.has(tip.title)
    );
    
    const result: (Exercise | { type: 'tip', content: WorkoutTip })[] = [];
    let tipIndex = 0;

    exercises.forEach((exercise, index) => {
      result.push(exercise);
      
      if (tipPositions.has(index + 1) && tipIndex < availableTips.length) {
        const selectedTip = availableTips[tipIndex];
        sessionUsedTips.add(selectedTip.title);
        
        result.push({
          type: 'tip',
          content: selectedTip
        });
        
        tipIndex++;
      }
    });

    return result;
  }, []);

  return { insertTips };
};

// WorkoutPlansContent Component
const WorkoutPlansContent = ({
  client,
  plans,
  references,
  refreshData,
}: {
  client: Client;
  plans: Plan[];
  references: any;
  refreshData: () => Promise<void>;
}) => {
  // State
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<"active" | "history">("active");
  const [historicalPlanIndex, setHistoricalPlanIndex] = useState(0);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<{
    exercise: ExerciseBase;
    details: ExerciseReference;
    isLogged: boolean;
  } | null>(null);
  const [isChangingPlan, setIsChangingPlan] = useState(false);

  // Refs
  const isMounted = useRef(true);
  const initRef = useRef(false);

  // Hooks
  const { activePlan, completedPlans } = usePlans(plans);
  const clearMediaCache = useClientStore(state => state.clearMediaCache);
  const preloadImages = useClientStore(state => state.preloadImages);

  // Memoized Values
  const currentPlan = useMemo(() => {
    return selectedPlan === "active" 
      ? activePlan 
      : (completedPlans && completedPlans.length > 0 
          ? completedPlans[Math.min(historicalPlanIndex, completedPlans.length - 1)] 
          : null);
  }, [selectedPlan, activePlan, completedPlans, historicalPlanIndex]);

  const dayKey = useMemo(() => `day_${selectedDay}`, [selectedDay]);
  
  const { exercises, hasWorkout } = useMemo(() => {
    const exs = currentPlan?.days[dayKey]?.exercises ?? [];
    return {
      exercises: exs,
      hasWorkout: exs.length > 0
    };
  }, [currentPlan, dayKey]);

  // Add tip handler hook
  const { insertTips } = useTipHandler();

  // Update exercisesWithTips to use our new hook
  const exercisesWithTips = useMemo(() => 
    insertTips(exercises),
    [exercises, insertTips]
  );

  // Callbacks
  const handlePlanTypeChange = useCallback((key: "active" | "history") => {
    if (key === "history" && (!completedPlans || completedPlans.length === 0)) {
      return;
    }

    setIsChangingPlan(true);
    clearMediaCache();

    requestAnimationFrame(() => {
      if (isMounted.current) {
        setSelectedExercise(null);
        setShowDetailsModal(false);
        setShowPerformanceModal(false);
        setSelectedPlan(key);
        
        if (key === "history" && historicalPlanIndex >= (completedPlans?.length ?? 0)) {
          setHistoricalPlanIndex(0);
        }
        
        setTimeout(() => {
          if (isMounted.current) {
            setIsChangingPlan(false);
          }
        }, 300);
      }
    });
  }, [completedPlans, historicalPlanIndex, clearMediaCache]);

  const handleHistoricalPlanSelect = useCallback((index: number) => {
    if (!completedPlans || index >= completedPlans.length) return;
    
    setIsChangingPlan(true);
    requestAnimationFrame(() => {
      setHistoricalPlanIndex(index);
      setTimeout(() => {
        setIsChangingPlan(false);
      }, 300);
    });
  }, [completedPlans]);

  const handleDaySelect = useCallback((day: number) => {
    if (day === selectedDay) return;

    setIsChangingPlan(true);
    clearMediaCache();

    requestAnimationFrame(() => {
      if (isMounted.current) {
        setSelectedDay(day);
        setSelectedExercise(null);
        setShowDetailsModal(false);
        setShowPerformanceModal(false);
        
        setTimeout(() => {
          if (isMounted.current) {
            setIsChangingPlan(false);
          }
        }, 300);
      }
    });
  }, [selectedDay, clearMediaCache]);

  const handleExerciseDetails = useCallback((exerciseRef: string) => {
    const exerciseDetails = references.exercises[exerciseRef];
    if (!exerciseDetails || isChangingPlan) return;

    const details = { ...exerciseDetails };
    if (details.video) {
      details._videoUrl = details.video;
      delete details.video;
    }

    setSelectedExercise({
      exercise: {
        ref: exerciseRef,
        sets: 0,
        reps: 0,
        rest: 0,
        logged: 0,
      },
      details,
      isLogged: false,
    });
    setShowDetailsModal(true);
  }, [references.exercises, isChangingPlan]);

  const handleExerciseLog = useCallback((item: ExerciseItem) => {
    if (!item.exercise || isChangingPlan) return;
    
    setSelectedExercise({
      exercise: item.exercise,
      details: references.exercises[item.exercise.ref],
      isLogged: item.exercise.logged === 1,
    });
    setShowPerformanceModal(true);
  }, [references.exercises, isChangingPlan]);

  const handleLogPerformance = useCallback(async (
    exerciseRef: string,
    weight: number,
    reps: number
  ) => {
    if (!client || !dayKey) return;
    
    try {
      await logPerformance(client.name, exerciseRef, weight, reps, dayKey);
      await refreshData();
    } catch (error) {
      console.error('Failed to log performance:', error);
    }
  }, [client, dayKey, refreshData]);

  // Effects
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      clearMediaCache();
    };
  }, [clearMediaCache]);

  useEffect(() => {
    if (
      !initRef.current &&
      selectedPlan === "active" &&
      !selectedDay &&
      activePlan
    ) {
      const today = new Date();
      const todayString = format(today, "yyyy-MM-dd");
      const planStart = new Date(activePlan.start);

      for (let i = 1; i <= 7; i++) {
        const currentDate = addDays(planStart, i - 1);
        const currentDateString = format(currentDate, "yyyy-MM-dd");

        if (currentDateString === todayString) {
          setSelectedDay(i);
          initRef.current = true;
          break;
        }
      }
    }
  }, [selectedPlan, activePlan, selectedDay]);

  // Preload images for current day
  useEffect(() => {
    if (!exercisesWithTips?.length) return;

    const urls = exercisesWithTips
      .flatMap((item: ExerciseItem) => {
        if (item.type === 'regular' && item.exercise) {
          const exercise = references.exercises[item.exercise.ref];
          return [exercise.thumbnail, exercise.starting, exercise.ending].filter(Boolean);
        }
        if (item.type === 'superset' && item.exercises) {
          return item.exercises.flatMap((ex: ExerciseBase) => {
            const exercise = references.exercises[ex.ref];
            return [exercise.thumbnail, exercise.starting, exercise.ending].filter(Boolean);
          });
        }
        return [];
      });

    if (urls.length > 0) {
      preloadImages(urls);
    }
  }, [exercisesWithTips, references.exercises, preloadImages]);

  // Render methods
  const renderExercises = useCallback(() => {
    return (
      <div className="space-y-6">
        {exercisesWithTips.map((item, index) => (
          <motion.div
            key={getItemKey(item, index)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.1, 1) }}
          >
            {item.type === "tip" ? (
              <div className="px-4">
                <TipCard tip={item.content} />
              </div>
            ) : item.type === "regular" ? (
              <div className="px-4">
                <ExerciseCard
                  exercise={item.exercise!}
                  references={references.exercises}
                  performance={references.performance}
                  isLogged={item.exercise!.logged === 1}
                  onLogSet={() => handleExerciseLog(item)}
                  onViewDetails={() => handleExerciseDetails(item.exercise!.ref)}
                  selectedPlan={selectedPlan}
                  exerciseNumber={index + 1}
                  isChangingPlan={isChangingPlan}
                />
              </div>
            ) : (
              <div className="px-4">
                <SupersetCard
                  exercises={item.exercises!}
                  references={references.exercises}
                  onLogPerformance={handleLogPerformance}
                  onViewDetails={handleExerciseDetails}
                  selectedPlan={selectedPlan}
                  exerciseNumber={index + 1}
                  isChangingPlan={isChangingPlan}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  }, [
    exercisesWithTips,
    references.exercises,
    references.performance,
    handleExerciseLog,
    handleExerciseDetails,
    handleLogPerformance,
    selectedPlan,
    isChangingPlan
  ]);

  // No active plan check
  if (!activePlan && selectedPlan === 'active') {
    return (
      <div className="min-h-screen w-full bg-transparent relative overflow-hidden">
        <div className="container mx-auto">
          <div className="flex flex-col gap-4">
            <PlanHero
              plan={completedPlans?.[0] ?? null}
              selectedDay={selectedDay}
              currentDay={null}
              onDaySelect={handleDaySelect}
              selectedPlan={selectedPlan}
              onPlanTypeChange={handlePlanTypeChange}
              completedPlansCount={completedPlans?.length ?? 0}
              completedPlans={completedPlans ?? []}
              historicalPlanIndex={historicalPlanIndex}
              onHistoricalPlanSelect={handleHistoricalPlanSelect}
              isChangingPlan={isChangingPlan}
            />
            <NoActivePlan 
              type="workout"
              hasHistory={Boolean(completedPlans?.length)}
              onViewHistory={() => handlePlanTypeChange('history')}
            />
          </div>
        </div>
      </div>
    );
  }

  // No plan at all check
  if (!currentPlan) {
    return (
      <div className="min-h-screen w-full bg-transparent relative overflow-hidden">
        <NoActivePlan 
          type="workout"
          hasHistory={Boolean(completedPlans?.length)}
          onViewHistory={() => handlePlanTypeChange('history')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-transparent relative overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col gap-4">
          <PlanHero
            plan={currentPlan}
            selectedDay={selectedDay}
            currentDay={null}
            onDaySelect={handleDaySelect}
            selectedPlan={selectedPlan}
            onPlanTypeChange={handlePlanTypeChange}
            completedPlansCount={completedPlans?.length ?? 0}
            completedPlans={completedPlans ?? []}
            historicalPlanIndex={historicalPlanIndex}
            onHistoricalPlanSelect={handleHistoricalPlanSelect}
            isChangingPlan={isChangingPlan}
          />
        </div>

        <motion.div 
          className={cn(
            "workout-content transition-all duration-300 ease-in-out",
            isChangingPlan && "opacity-0 scale-95"
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              {hasWorkout && (
                <div className="px-4">
                  <SectionTitle />
                </div>
              )}

              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {hasWorkout ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {renderExercises()}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="rest-day"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="px-4"
                    >
                      <RestDayCard />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modals */}
        <AnimatePresence>
          {showPerformanceModal && selectedExercise && (
            <PerformanceModal
              isOpen={showPerformanceModal}
              onClose={() => {
                setShowPerformanceModal(false);
                setSelectedExercise(null);
              }}
              onSubmit={(weight, reps) =>
                handleLogPerformance(selectedExercise.exercise.ref, weight, reps)
              }
              exerciseName={selectedExercise.exercise.ref}
              targetReps={selectedExercise.exercise.reps}
              previousPerformance={
                references.performance[selectedExercise.exercise.ref]
              }
            />
          )}

          {showDetailsModal && selectedExercise && (
            <ExerciseDetailsModal
              isOpen={showDetailsModal}
              onClose={() => {
                setShowDetailsModal(false);
                setSelectedExercise(null);
              }}
              exercise={selectedExercise.exercise}
              details={selectedExercise.details}
              performance={references.performance[selectedExercise.exercise.ref]}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Main Component
export default function WorkoutPlans() {
  const { 
    client, 
    plans, 
    references, 
    isLoading: loading, 
    error, 
    fetch: refreshData,
    clearMediaCache 
  } = useClientStore();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearMediaCache();
    };
  }, [clearMediaCache]);

  // Error handling
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Workout Plans Error:', event);
      clearMediaCache();
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [clearMediaCache]);

  return (
    <WorkoutErrorBoundary>
      <PageTransition
        loading={loading}
        error={error}
        skeleton={<WorkoutPlanSkeleton />}
      >
        {client && references && (
          <WorkoutPlansContent
            client={client}
            plans={plans ?? []}
            references={references}
            refreshData={refreshData}
          />
        )}
      </PageTransition>
    </WorkoutErrorBoundary>
  );
}