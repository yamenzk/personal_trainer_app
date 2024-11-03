// src/pages/WorkoutPlans.tsx
import { useState } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Progress,
  Button,
  Divider
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { 
  Dumbbell, 
  Calendar,
  CheckCircle2,
  Clock,
  Target
} from "lucide-react";
import { useClientData } from '../hooks/useClientData';
import { usePlans } from '../hooks/usePlans';
import ExerciseCard from '../components/workout/ExerciseCard';
import SupersetCard from '../components/workout/SupersetCard';
import WeekCalendar from '../components/shared/WeekCalendar';
import PlanSelector from '../components/shared/PlanSelector';
import { logPerformance, calculatePlanProgress, isPlanDayCompleted } from '../utils/api';
import { Exercise } from '../types/workout';

const MotionCard = motion(Card);

export default function WorkoutPlans() {
  const { loading, error, client, plans, references, refreshData } = useClientData();
  const { activePlan, completedPlans, currentDay } = usePlans(plans ?? []);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [selectedPlan, setSelectedPlan] = useState<'active' | 'history'>('active');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-foreground/60">Loading your workout plans...</p>
        </div>
      </div>
    );
  }

  if (error || !client || !references) {
    return (
      <div className="text-center text-danger">
        {error || 'Failed to load workout plans'}
      </div>
    );
  }

  const handleLogPerformance = async (exerciseRef: string, weight: number, reps: number) => {
    await logPerformance(
      client.name, 
      exerciseRef, 
      weight, 
      reps, 
      `day_${selectedDay}`
    );
    await refreshData();
  };

  const currentPlan = selectedPlan === 'active' ? activePlan : completedPlans[0];
  const dayKey = `day_${selectedDay}`;
  const exercises = currentPlan?.days[dayKey]?.exercises ?? [];

  // Calculate how many exercises are completed for the current day
  const getExerciseStats = () => {
    if (!currentPlan?.days[dayKey]) return { total: 0, completed: 0 };
    
    const regularExercises = exercises.filter(ex => ex.type === 'regular');
    const completedExercises = regularExercises.filter(
      ex => ex.type === 'regular' && ex.exercise.logged === 1
    );

    return {
      total: regularExercises.length,
      completed: completedExercises.length
    };
  };

  const exerciseStats = getExerciseStats();
  const dayProgress = (exerciseStats.total > 0) 
    ? (exerciseStats.completed / exerciseStats.total) * 100 
    : 0;

  const renderExerciseGroup = (exercise: Exercise) => {
    if (exercise.type === 'regular') {
      return (
        <ExerciseCard
          key={exercise.exercise.ref}
          exerciseRef={exercise.exercise.ref}
          sets={exercise.exercise.sets}
          reps={exercise.exercise.reps}
          rest={exercise.exercise.rest}
          details={references.exercises[exercise.exercise.ref]}
          performanceData={references.performance}
          onLogPerformance={(weight, reps) => 
            handleLogPerformance(exercise.exercise.ref, weight, reps)
          }
          isLogged={exercise.exercise.logged === 1}
          isPlanActive={selectedPlan === 'active'}
          exerciseDay={dayKey}
        />
      );
    }

    return (
      <SupersetCard
        key={exercise.exercises[0].ref}
        exercises={exercise.exercises}
        details={references.exercises}
        performanceData={references.performance}
        onLogPerformance={handleLogPerformance}
        isPlanActive={selectedPlan === 'active'}
        exerciseDay={dayKey}
      />
    );
  };

  return (
    <div className="space-y-6 pb-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PlanSelector
          activePlan={activePlan}
          completedPlans={completedPlans}
          selectedPlan={selectedPlan}
          onPlanChange={(key) => setSelectedPlan(key as 'active' | 'history')}
        />
      </motion.div>
  
      {currentPlan ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <WeekCalendar
              plan={currentPlan}
              selectedDay={selectedDay}
              onDaySelect={setSelectedDay}
            />
          </motion.div>
  
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Day Progress Card */}
            <MotionCard className="bg-content1 shadow-md rounded-xl">
              <CardBody className="gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary-light">
                      <Target className="w-6 h-6 text-primary-dark" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-dark">Day Progress</h3>
                      <p className="text-sm text-foreground/60">
                        {exerciseStats.completed} of {exerciseStats.total} exercises completed
                      </p>
                    </div>
                  </div>
                  {isPlanDayCompleted(currentPlan.days[dayKey]) && (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 size={20} className="text-success-dark" />
                      <span className="font-medium">Completed</span>
                    </div>
                  )}
                </div>
  
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-light">
                      <Dumbbell className="w-4 h-4 text-primary-dark" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Total Exercises</p>
                      <p className="font-semibold">{exerciseStats.total}</p>
                    </div>
                  </div>
  
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-success-light">
                      <CheckCircle2 className="w-4 h-4 text-success-dark" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Completed</p>
                      <p className="font-semibold">{exerciseStats.completed}</p>
                    </div>
                  </div>
  
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-warning-light">
                      <Clock className="w-4 h-4 text-warning-dark" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Remaining</p>
                      <p className="font-semibold">
                        {exerciseStats.total - exerciseStats.completed}
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </MotionCard>
  
            {/* Exercises */}
            <div className="space-y-4">
              {exercises.map((exercise) => renderExerciseGroup(exercise))}
            </div>
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center py-12"
        >
          <div className="p-4 rounded-full bg-primary-light w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Dumbbell className="w-8 h-8 text-primary-dark" />
          </div>
          <p className="text-xl font-semibold text-primary-dark mb-2">No Workout Plan Available</p>
          <p className="text-foreground/60">
            You don't have any active workout plans at the moment.
          </p>
        </motion.div>
      )}
    </div>
  );
  
}