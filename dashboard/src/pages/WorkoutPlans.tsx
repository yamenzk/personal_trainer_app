import { useState, useEffect, useRef } from "react";
import { Skeleton, Button, Card } from "@nextui-org/react";
import { AlertTriangle, Dumbbell } from "lucide-react";
import { useClientData } from "../hooks/useClientData";
import { usePlans } from "../hooks/usePlans";
import {
  logPerformance,
  isPlanDayCompleted,
  calculatePlanProgress,
} from "../utils/api";
import { ExerciseBase, ExerciseReference } from "@/types/workout";
import { ExerciseCard } from "../components/workout/ExerciseCard";
import { SupersetCard } from "../components/workout/SupersetCard";
import { RestDayCard } from "../components/workout/RestDay";
import { PlanHero } from "../components/workout/PlanHero";
import { ExerciseDetailsModal } from "../components/workout/ExerciseDetailsModal";
import { PerformanceModal } from "../components/workout/PerformanceModal";
import { PageTransition } from "@/components/shared/PageTransition";
import { Client } from "@/types/client";
import { Plan } from "@/types/plan";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays } from "date-fns";
import { insertWorkoutTips, TipCard } from "@/components/workout/WorkoutTips";

// Skeleton Component
const WorkoutPlanSkeleton = () => {
  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      <div className="container mx-auto">
        {/* Hero Section Skeleton */}
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-[220px] rounded-xl" />
        </div>

        {/* Exercise Section Skeleton */}
        <div className="mt-8">
          {/* Section Title Skeleton */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-content-secondary/10" />
            <Skeleton className="w-40 h-8 rounded-lg" />
            <div className="h-px flex-1 bg-content-secondary/10" />
          </div>

          {/* Exercise Cards Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-full h-[300px] rounded-xl" />
            ))}
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

// Main Content Component
const WorkoutPlansContent = ({
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

  const handleExerciseDetails = (exerciseRef: string) => {
    // Get the exercise details from the correct references path
    const exerciseDetails = references.exercises[exerciseRef];
    if (!exerciseDetails) return;

    setSelectedExercise({
      exercise: {
        ref: exerciseRef,
        sets: 0,
        reps: 0,
        rest: 0,
        logged: 0,
      },
      details: exerciseDetails,
      isLogged: false,
    });
    setShowDetailsModal(true);
  };

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
                    <div className="space-y-6">
                      {exercisesWithTips.map((item, index) => (
                        <motion.div
                          key={
                            item.type === "tip"
                              ? `tip-${index}`
                              : item.type === "regular"
                              ? item.exercise.ref
                              : `superset-${index}`
                          }
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
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
                                onLogSet={() => {
                                  setSelectedExercise({
                                    exercise: item.exercise,
                                    details: references.exercises[item.exercise.ref],
                                    isLogged: item.exercise.logged === 1,
                                  });
                                  setShowPerformanceModal(true);
                                }}
                                onViewDetails={() => {
                                  setSelectedExercise({
                                    exercise: item.exercise,
                                    details: references.exercises[item.exercise.ref],
                                    isLogged: item.exercise.logged === 1,
                                  });
                                  setShowDetailsModal(true);
                                }}
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
            isLogged={selectedExercise.isLogged}
            performance={references.performance[selectedExercise.exercise.ref]}
          />
        )}
      </div>
    </div>
  );
};

// Main Component
export default function WorkoutPlans() {
  const { loading, error, client, plans, references, refreshData } =
    useClientData();
  const { currentDay } = usePlans(plans ?? []);

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
