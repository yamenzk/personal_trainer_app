import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Button, Skeleton } from "@nextui-org/react";
import { Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays } from "date-fns";

// Updated imports from centralized types
import {
  ExerciseBase,
  ExerciseReference,
  Client,
  Plan
} from '@/types';

// Utility imports
import { usePlans } from "../hooks/usePlans";
import {
  logPerformance,
  calculatePlanProgress,
} from "../utils/api";

// Component imports
import { ExerciseCard } from "../components/workout/ExerciseCard";
import { SupersetCard } from "../components/workout/SupersetCard";
import { RestDayCard } from "../components/workout/RestDay";
import { PlanHero } from "../components/workout/PlanHero";
import { ExerciseDetailsModal } from "../components/workout/ExerciseDetailsModal";
import { PerformanceModal } from "../components/workout/PerformanceModal";
import { PageTransition } from "@/components/shared/PageTransition";
import { insertWorkoutTips, TipCard } from "@/components/workout/WorkoutTips";
import { useClientStore } from "@/stores/clientStore";
import React from "react";

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

const SectionTitle = () => (
  <div className="flex items-center gap-4 my-6">
    <div className="h-px flex-1 bg-content-secondary/10" />
    <h2 className="text-xl font-semibold text-foreground/80 flex items-center gap-2">
      <Dumbbell className="w-5 h-5" />
      Exercises
    </h2>
    <div className="h-px flex-1 bg-success/10" />
  </div>
);

interface ExerciseItem {
  type: 'regular' | 'superset' | 'tip';
  exercise?: ExerciseBase;
  exercises?: ExerciseBase[];
  content?: any;
}

// Main Content Component
const WorkoutPlansContent = React.memo(({
  client,
  plans,
  references,
  refreshData,
  currentDay,
}: {
  client: Client;
  plans: Plan[];
  references: any;
  refreshData: () => Promise<void>;
  currentDay: number | null;
}) => {
  const { activePlan, completedPlans } = usePlans(plans);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<"active" | "history">(
    "active"
  );
  const [historicalPlanIndex, setHistoricalPlanIndex] = useState(0);
  const initRef = useRef(false);

  // Modal states
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<{
    exercise: ExerciseBase;
    details: ExerciseReference;
    isLogged: boolean;
  } | null>(null);

  // Initialize selectedDay
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

  // Reset initialization when plan changes
  useEffect(() => {
    if (activePlan?.start) {
      initRef.current = false;
    }
  }, [activePlan?.start]);

  const currentPlan =
    selectedPlan === "active"
      ? activePlan
      : completedPlans[historicalPlanIndex];
  if (!currentPlan) return null;

  const dayKey = `day_${selectedDay}`;
  const exercises = currentPlan.days[dayKey]?.exercises ?? [];
  const hasWorkout = exercises.length > 0;
  const planProgress = calculatePlanProgress(currentPlan);

  const handleLogPerformance = async (
    exerciseRef: string,
    weight: number,
    reps: number
  ) => {
    if (!client) return;

    await logPerformance(client.name, exerciseRef, weight, reps, dayKey);
    await refreshData();
  };
  const exercisesWithTips = insertWorkoutTips(exercises);

  const handleExerciseDetails = useCallback((exerciseRef: string) => {
    const exerciseDetails = references.exercises[exerciseRef];
    if (!exerciseDetails) return;

    // Create a copy without video URL initially
    const details = { ...exerciseDetails };
    if (details.video) {
      // Store video URL separately to avoid immediate loading
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
  }, [references.exercises]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup any subscriptions or pending operations
    };
  }, []);

  // Optimize modal state management
  const modalState = useMemo(() => ({
    showPerformanceModal,
    showDetailsModal,
    selectedExercise,
  }), [showPerformanceModal, showDetailsModal, selectedExercise]);

  // Remove useCallback and modify renderExercises to be a regular function
  const renderExercises = () => {
    return (
      <div className="space-y-6">
        {exercisesWithTips.map((item, index) => (
          <motion.div
            key={getItemKey(item, index)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.1, 1) }} // Cap delay at 1 second
          >
            {item.type === "tip" ? (
              <div className="px-4">
                <TipCard tip={item.content} />
              </div>
            ) : item.type === "regular" ? (
              <div className="px-4">
                <ExerciseCard
                  exercise={item.exercise}
                  references={references.exercises}
                  performance={references.performance}
                  isLogged={item.exercise.logged === 1}
                  onLogSet={() => handleExerciseLog(item)}
                  onViewDetails={() => handleExerciseDetails(item.exercise.ref)}
                  selectedPlan={selectedPlan}
                  exerciseNumber={index + 1}
                />
              </div>
            ) : (
              <div className="px-4">
                <SupersetCard
                  exercises={item.exercises}
                  references={references.exercises}
                  onLogPerformance={handleLogPerformance}
                  onViewDetails={handleExerciseDetails}
                  selectedPlan={selectedPlan}
                  exerciseNumber={index + 1}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  // Add handleExerciseLog function
  const handleExerciseLog = (item: any) => {
    if (!item.exercise) return;
    setSelectedExercise({
      exercise: item.exercise,
      details: references.exercises[item.exercise.ref],
      isLogged: item.exercise.logged === 1,
    });
    setShowPerformanceModal(true);
  };

  // Preload images for visible exercises
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

    useClientStore.getState().preloadImages(urls);
  }, [exercisesWithTips, references.exercises]);

  return (
    <div className="min-h-screen w-full bg-transparent relative overflow-hidden">
      <div className="container mx-auto">
        {/* Hero Section - Full Width */}
        <div className="flex flex-col gap-4">
          <PlanHero
            plan={currentPlan}
            selectedDay={selectedDay}
            currentDay={null}
            onDaySelect={setSelectedDay}
            selectedPlan={selectedPlan}
            onPlanTypeChange={setSelectedPlan}
            completedPlansCount={completedPlans.length}
            completedPlans={completedPlans}
            historicalPlanIndex={historicalPlanIndex}
            onHistoricalPlanSelect={setHistoricalPlanIndex}
          />
        </div>
  
        {/* Centered Content Container */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            {/* Section Title */}
            {hasWorkout && (
              <div className="px-4">
                <SectionTitle />
              </div>
            )}
  
            {/* Exercises and Tips */}
            <div className="space-y-4">
              <AnimatePresence>
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
  
        {/* Modals */}
        {showPerformanceModal && selectedExercise && (
          <PerformanceModal
            isOpen={modalState.showPerformanceModal}
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
            isOpen={modalState.showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedExercise(null);
            }}
            exercise={selectedExercise.exercise}
            details={selectedExercise.details}
            isLogged={selectedExercise.isLogged}
            performance={references.performance[selectedExercise.exercise.ref]}
          />
        )}
      </div>
    </div>
  );
});

const getItemKey = (item: any, index: number) => {
  if (item.type === "tip") return `tip-${index}`;
  if (item.type === "regular") return item.exercise.ref;
  return `superset-${index}`;
};

// Main Component
export default function WorkoutPlans() {
  const { client, plans, references, isLoading: loading, error, fetch: refreshData } = useClientStore();
  const { currentDay } = usePlans(plans ?? []);

  // Add error handling for failed renders
  useEffect(() => {
    const handler = (event: ErrorEvent) => {
      console.error('Workout Plans Error:', event);
      // Implement error reporting here
    };

    window.addEventListener('error', handler);
    return () => window.removeEventListener('error', handler);
  }, []);

  return (
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
          currentDay={currentDay}
        />
      )}
    </PageTransition>
  );
}
