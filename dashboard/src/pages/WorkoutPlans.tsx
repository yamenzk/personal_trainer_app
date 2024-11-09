// src/pages/WorkoutPlans.tsx
import { useState, useEffect, useRef } from 'react';
import { Skeleton, Button } from "@nextui-org/react";
import { AlertTriangle, Dumbbell } from 'lucide-react';
import { useClientData } from '../hooks/useClientData';
import { usePlans } from '../hooks/usePlans';
import { logPerformance, isPlanDayCompleted, calculatePlanProgress } from '../utils/api';
import { ExerciseBase, ExerciseReference } from '@/types/workout';
import { ExerciseCard } from '../components/workout/ExerciseCard';
import { SupersetCard } from '../components/workout/SupersetCard';
import { RestDayCard } from '../components/workout/RestDay';
import { PlanHero } from '../components/workout/PlanHero';
import { ExerciseDetailsModal } from '../components/workout/ExerciseDetailsModal';
import { PerformanceModal } from '../components/workout/PerformanceModal';
import { PageTransition } from '@/components/shared/PageTransition';
import { Client } from '@/types/client';
import { Plan } from '@/types/plan';
import { motion, AnimatePresence } from "framer-motion";

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
  currentDay
}: {
  client: Client;
  plans: Plan[];
  references: any;
  refreshData: () => Promise<void>;
  currentDay: number | null;
}) => {
  const { activePlan, completedPlans } = usePlans(plans);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'active' | 'history'>('active');
  const [historicalPlanIndex, setHistoricalPlanIndex] = useState(0);

  // Modal states
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<{
    exercise: ExerciseBase;
    details: ExerciseReference;
    isLogged: boolean;
  } | null>(null);

  // Set initial selected day
  useEffect(() => {
    if (selectedDay === null && currentDay) {
      setSelectedDay(currentDay);
    }
  }, [currentDay, selectedDay]);

  const currentPlan = selectedPlan === 'active'
    ? activePlan
    : completedPlans[historicalPlanIndex];
  if (!currentPlan) return null;

  const dayKey = `day_${selectedDay}`;
  const exercises = currentPlan.days[dayKey]?.exercises ?? [];
  const hasWorkout = exercises.length > 0;
  const planProgress = calculatePlanProgress(currentPlan);

  const handleLogPerformance = async (exerciseRef: string, weight: number, reps: number) => {
    if (!client) return;

    await logPerformance(
      client.name,
      exerciseRef,
      weight,
      reps,
      dayKey
    );
    await refreshData();
  };

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col gap-4">
          <PlanHero
            plan={currentPlan}
            selectedDay={selectedDay}
            currentDay={currentDay}
            onDaySelect={setSelectedDay}
            selectedPlan={selectedPlan}
            onPlanTypeChange={setSelectedPlan}
            completedPlansCount={completedPlans.length}
            completedPlans={completedPlans}
            historicalPlanIndex={historicalPlanIndex}
            onHistoricalPlanSelect={setHistoricalPlanIndex}
          />
        </div>

        {/* Only show SectionTitle and exercises if it's not a rest day */}
        {hasWorkout && <SectionTitle />}
        
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {hasWorkout ? (
              exercises.map((exercise, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  {exercise.type === 'regular' ? (
                    <ExerciseCard
                      exercise={exercise.exercise}
                      references={references.exercises}
                      performance={references.performance}
                      isLogged={exercise.exercise.logged === 1}
                      onLogSet={() => {
                        setSelectedExercise({
                          exercise: exercise.exercise,
                          details: references.exercises[exercise.exercise.ref],
                          isLogged: exercise.exercise.logged === 1
                        });
                        setShowPerformanceModal(true);
                      }}
                      onViewDetails={() => {
                        setSelectedExercise({
                          exercise: exercise.exercise,
                          details: references.exercises[exercise.exercise.ref],
                          isLogged: exercise.exercise.logged === 1
                        });
                        setShowDetailsModal(true);
                      }}
                      selectedPlan={selectedPlan}
                      exerciseNumber={index + 1}
                    />
                  ) : (
                    <SupersetCard
                      exercises={exercise.exercises}
                      references={references.exercises}
                      onLogPerformance={handleLogPerformance}
                      onViewDetails={(exerciseRef) => {
                        const exerciseDetails = exercise.exercises.find(e => e.ref === exerciseRef);
                        if (exerciseDetails) {
                          setSelectedExercise({
                            exercise: exerciseDetails,
                            details: references.references[exerciseRef],
                            isLogged: exerciseDetails.logged === 1
                          });
                          setShowDetailsModal(true);
                        }
                      }}
                      selectedPlan={selectedPlan}
                      exerciseNumber={index + 1}
                    />
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <RestDayCard />
              </motion.div>
            )}
          </AnimatePresence>
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
          onSubmit={(weight, reps) => handleLogPerformance(selectedExercise.exercise.ref, weight, reps)}
          exerciseName={selectedExercise.exercise.ref}
          targetReps={selectedExercise.exercise.reps}
          previousPerformance={references.performance[selectedExercise.exercise.ref]}
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
  );
};

// Main Component
export default function WorkoutPlans() {
  const { loading, error, client, plans, references, refreshData } = useClientData();
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