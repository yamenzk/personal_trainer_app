import { useState, useEffect, useRef } from 'react';
import { Button } from "@nextui-org/react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
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
import { GlassCard } from '@/components/shared/GlassCard';

const SectionTitle = () => (
  <div className="flex items-center gap-4 my-6">
    <div className="h-px flex-1 bg-content/10" />
    <h2 className="text-xl font-semibold text-foreground/80 flex items-center gap-2">
      <Dumbbell className="w-5 h-5" />
      Exercises
    </h2>
    <div className="h-px flex-1 bg-content/10" />
  </div>
);

export default function WorkoutPlans() {
  const { loading, error, client, plans, references, refreshData } = useClientData();
  const { activePlan, completedPlans, currentDay } = usePlans(plans ?? []);
  // Initialize selectedDay with null so we can detect the first load
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'active' | 'history'>('active');
  const [historicalPlanIndex, setHistoricalPlanIndex] = useState(0);

  // Add this useEffect to set the selected day on initial load
  useEffect(() => {
    if (selectedDay === null && currentDay) {
      setSelectedDay(currentDay);
    }
  }, [currentDay, selectedDay]);

  // Modal states
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<{
    exercise: ExerciseBase;
    details: ExerciseReference;
    isLogged: boolean;
  } | null>(null);

  const daysContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (daysContainerRef.current && currentDay) {
      const container = daysContainerRef.current;
      const dayElement = container.children[currentDay - 1] as HTMLElement;
      if (dayElement) {
        const scrollLeft = dayElement.offsetLeft - (container.clientWidth - dayElement.clientWidth) / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [currentDay]);

  // Modify the useEffect for initial day selection and scrolling
  useEffect(() => {
    // Set the current day when component mounts
    if (currentDay) {
      setSelectedDay(currentDay);

      // Wait for the next tick to ensure DOM is updated
      setTimeout(() => {
        if (daysContainerRef.current) {
          const container = daysContainerRef.current;
          const dayElement = container.children[currentDay - 1] as HTMLElement;

          if (dayElement) {
            // Calculate the center position
            const containerWidth = container.clientWidth;
            const elementWidth = dayElement.offsetWidth;
            const elementLeft = dayElement.offsetLeft;

            // Center the element
            const scrollPosition = elementLeft - (containerWidth / 2) + (elementWidth / 2);

            container.scrollTo({
              left: Math.max(0, scrollPosition),
              behavior: 'smooth'
            });
          }
        }
      }, 100);
    }
  }, [currentDay]);

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          </div>
          <div className="text-foreground/60 font-medium">Loading your workout plan...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !client || !references) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <GlassCard className="max-w-md w-full p-6 text-center space-y-4 bg-danger/10">
          <div className="w-16 h-16 rounded-full bg-danger/20 text-danger mx-auto flex items-center justify-center">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-semibold text-danger">Error Loading Plan</h3>
          <p className="text-danger/80">{error || 'Failed to load workout data'}</p>
          <Button
            color="danger"
            variant="flat"
            onPress={() => window.location.reload()}
          >
            Try Again
          </Button>
        </GlassCard>
      </div>
    );
  }

  const currentPlan = selectedPlan === 'active'
    ? activePlan
    : completedPlans[historicalPlanIndex];
  if (!currentPlan) return null;

  const dayKey = `day_${selectedDay}`;
  const exercises = currentPlan.days[dayKey]?.exercises ?? [];
  const hasWorkout = exercises.length > 0;
  const dayProgress = isPlanDayCompleted(currentPlan.days[dayKey]);
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
  plan={currentPlan}  // Use currentPlan instead of plan
  selectedDay={selectedDay}
  currentDay={currentDay}
  onDaySelect={setSelectedDay}
  selectedPlan={selectedPlan}
  onPlanTypeChange={setSelectedPlan}  // Use setSelectedPlan directly
  completedPlansCount={completedPlans.length}
  completedPlans={completedPlans}
  historicalPlanIndex={historicalPlanIndex}
  onHistoricalPlanSelect={setHistoricalPlanIndex}
/>
        </div>

        {/* Only show SectionTitle and exercises if it's not a rest day */}
        {hasWorkout && <SectionTitle />}
        <TransitionGroup className="space-y-4">
          {hasWorkout ? (
            exercises.map((exercise, index) => (
              <CSSTransition
                key={index}
                timeout={300}
                classNames="fade-slide"
              >
                <div className="fade-slide-enter">
                  {exercise.type === 'regular' ? (
                    <ExerciseCard
                      exercise={exercise.exercise}
                      references={references.exercises}
                      performance={references.performance}  // Add this line
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
                            details: references.exercises[exerciseRef],
                            isLogged: exerciseDetails.logged === 1
                          });
                          setShowDetailsModal(true);
                        }
                      }}
                      selectedPlan={selectedPlan}
                      exerciseNumber={index + 1}
                    />
                  )}
                </div>
              </CSSTransition>
            ))
          ) : (
            <CSSTransition
              timeout={300}
              classNames="fade"
            >
              <RestDayCard />
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>

      {/* Modals */}
      {showPerformanceModal && selectedExercise && (
        <CSSTransition
          in={showPerformanceModal}
          timeout={300}
          classNames="modal"
          unmountOnExit
        >
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
        </CSSTransition>
      )}

      {showDetailsModal && selectedExercise && (
        <CSSTransition
          in={showDetailsModal}
          timeout={300}
          classNames="modal"
          unmountOnExit
        >
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
        </CSSTransition>
      )}
    </div>
  );
}