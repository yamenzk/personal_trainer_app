// src/pages/WorkoutPlans/index.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Clock, 
  Dumbbell,
  Info,
  BarChart,
  Check
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useWizard } from '@/providers/WizardProvider';
import { LoadingScreen } from '@/components/ui/loading';
import { PageHeader } from '@/components/layout/PageHeader';
import { SupersetCard } from '@/components/workout/SupersetCard';
import { WorkoutDetailModal } from '@/components/workout/WorkoutDetailModal';
import type { 
  Exercise, 
  ExerciseReference, 
  Plan,
  DayPlan,
  RegularExercise
} from '@/types/api';

interface DayTabProps {
  date: Date;
  isActive: boolean;
  hasWorkout: boolean;
  isCompleted?: boolean;
  onClick: () => void;
}

const DayTab: React.FC<DayTabProps> = ({ 
  date, 
  isActive, 
  hasWorkout,
  isCompleted, 
  onClick 
}) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center py-2 px-4 rounded-xl transition-colors ${
      isActive 
        ? 'bg-blue-500 text-white' 
        : hasWorkout 
          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700' 
          : 'bg-gray-100 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500'
    }`}
  >
    <span className="text-xs font-medium">
      {date.toLocaleDateString('en-US', { weekday: 'short' })}
    </span>
    <span className="text-lg font-semibold">
      {date.getDate()}
    </span>
    {isCompleted && (
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
        <Check className="w-3 h-3 text-white" />
      </div>
    )}
  </button>
);

const isDayCompleted = (dayPlan: DayPlan) => {
  if (!dayPlan?.exercises) return false;
  
  const regularExercises = dayPlan.exercises.filter(
    (ex): ex is RegularExercise => ex.type === 'regular'
  );
  
  return regularExercises.every(ex => ex.exercise.logged === 1);
};

interface ExerciseCardProps {
  exercise: Exercise;
  exerciseDetails: ExerciseReference;
  dayKey: string;
  isActive: boolean;
  onClick: () => void;
  onLogPerformance: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  exercise, 
  exerciseDetails, 
  isActive,
  onClick,
  onLogPerformance 
}) => {
  const isLogged = exercise.logged === 1;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 relative group">
      {/* Main Content */}
      <div 
        onClick={onClick}
        className="cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium">{exercise.ref}</h3>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                  {exerciseDetails.level}
                </span>
                {isLogged && (
                  <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center">
                    <Check className="w-3 h-3 mr-1" />
                    Completed
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Dumbbell className="w-4 h-4 mr-1" />
                {exercise.sets} sets × {exercise.reps} reps
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {exercise.rest}s rest
              </div>
            </div>

            {/* Equipment & Muscle Tag */}
            <div className="flex items-center space-x-2 mt-2">
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md">
                {exerciseDetails.equipment}
              </span>
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-md">
                {exerciseDetails.primary_muscle}
              </span>
            </div>
          </div>

          {/* Info Button */}
          <button 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Info className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Performance Logging Button */}
      {isActive && !isLogged && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLogPerformance();
            }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 group-hover:shadow-lg"
          >
            <BarChart className="w-4 h-4" />
            <span className="font-medium">Log Performance</span>
          </button>
        </div>
      )}
    </div>
  );
};

const WorkoutPlans: React.FC = () => {
  const { plans, references } = useAuthStore();
  const { openWizard } = useWizard();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [selectedExercise, setSelectedExercise] = useState<{
    exercise: Exercise;
    type: 'regular' | 'superset';
    supersetIndex?: number;
  } | null>(null);

  // Initialize selected plan to active plan or latest plan
  const findNextIncompleteDay = (plan: Plan) => {
    // Get all possible day keys from the plan
    const dayKeys = Object.keys(plan.days) as (keyof typeof plan.days)[];
    
    for (let i = 0; i < dayKeys.length; i++) {
      const dayKey = dayKeys[i];
      const dayPlan = plan.days[dayKey];
      
      if (!isDayCompleted(dayPlan)) {
        // Found a day with incomplete exercises
        const dayNumber = parseInt(dayKey.replace('day_', '')) - 1;
        const date = new Date(plan.start);
        date.setDate(date.getDate() + dayNumber);
        return date;
      }
    }
    
    // If all days are complete, return the first day
    return new Date(plan.start);
  };

  useEffect(() => {
    if (plans.length > 0) {
      const activePlan = plans.find(plan => plan.status === 'Active');
      if (activePlan) {
        setSelectedPlanId(activePlan.plan_name);
        setSelectedDate(findNextIncompleteDay(activePlan));
      } else {
        const latestPlan = plans.reduce((latest, current) => 
          new Date(current.start) > new Date(latest.start) ? current : latest
        );
        setSelectedPlanId(latestPlan.plan_name);
        setSelectedDate(new Date(latestPlan.start));
      }
    }
  }, [plans]);

  const selectedPlan = useMemo(() => 
    plans.find(plan => plan.plan_name === selectedPlanId),
    [plans, selectedPlanId]
  );

  if (!selectedPlan || !references) return <LoadingScreen />;

  const startDate = new Date(selectedPlan.start);
  const dayNumber = Math.floor((selectedDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const dayKey = `day_${dayNumber + 1}` as keyof typeof selectedPlan.days;
  const selectedDayPlan = selectedPlan.days[dayKey];

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Plan Selector */}
      <PageHeader
        title="Workout Plan"
        selectedPlan={selectedPlan}
        plans={plans}
        onPlanChange={setSelectedPlanId}
      />

      {/* Week Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto py-2 scrollbar-hide">
        {weekDates.map((date) => {
          const currentDayNumber = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          const currentDayKey = `day_${currentDayNumber + 1}` as keyof typeof selectedPlan.days;
          const dayPlan = selectedPlan.days[currentDayKey];
          const isCompleted = isDayCompleted(dayPlan);

          return (
            <DayTab
              key={date.toISOString()}
              date={date}
              isActive={date.toDateString() === selectedDate.toDateString()}
              hasWorkout={true}
              isCompleted={isCompleted}
              onClick={() => setSelectedDate(date)}
            />
          );
        })}
      </div>

      {/* Exercises List */}
      {selectedDayPlan ? (
        <div className="space-y-4">
          {selectedDayPlan.exercises.map((exerciseItem, index) => {
            if (exerciseItem.type === 'regular') {
              return (
                <ExerciseCard
                  key={`${exerciseItem.exercise.ref}-${index}`}
                  exercise={exerciseItem.exercise}
                  exerciseDetails={references.exercises[exerciseItem.exercise.ref]}
                  dayKey={dayKey}
                  isActive={selectedPlan.status === 'Scheduled'}
                  onClick={() => setSelectedExercise({
                    exercise: exerciseItem.exercise,
                    type: 'regular'
                  })}
                  onLogPerformance={() => {
                    openWizard('performance', {
                      name: exerciseItem.exercise.ref,
                      dayKey
                    });
                  }}
                />
              );
            } else {
              return (
                <SupersetCard
                  key={index}
                  exercises={exerciseItem.exercises}
                  exerciseDetails={references.exercises}
                  onExerciseClick={(exercise, supersetIndex) => setSelectedExercise({
                    exercise,
                    type: 'superset',
                    supersetIndex: supersetIndex + 1
                  })}
                />
              );
            }
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No workout planned for this day
          </p>
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <WorkoutDetailModal
          exercise={selectedExercise.exercise}
          exerciseDetails={references.exercises[selectedExercise.exercise.ref]}
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          type={selectedExercise.type}
          supersetIndex={selectedExercise.supersetIndex}
          performance={references.performance[selectedExercise.exercise.ref] || []}
        />
      )}
    </div>
  );
};

export default WorkoutPlans;