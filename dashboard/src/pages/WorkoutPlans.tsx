import { useState } from 'react';
import { 
  Button,
  Progress,
  Modal,
  Input,
  cn,
  Chip,
  Tooltip
} from "@nextui-org/react";
import { motion} from "framer-motion";
import { 
  Dumbbell, 
  CheckCircle2,
  Clock,
  Target,
  Zap,
  Flame,
  BarChart3,
  Scale,
  Heart
} from 'lucide-react';
import { useClientData } from '../hooks/useClientData';
import { usePlans } from '../hooks/usePlans';
import { isPlanDayCompleted } from '../utils/api';
import { GlassCard } from '@/components/shared/GlassCard';
import { format, addDays } from 'date-fns';
import { ExerciseReference, ExerciseBase } from '@/types/workout';
import { ApiResponse } from '@/types/api';
import { logPerformance } from '../utils/api';

interface ExerciseCardProps {
  exercise: {
    ref: string;
    sets: number;
    reps: number;
    rest: number;
    details: ExerciseReference;
    bestWeight: number;
    bestReps: number;
    logged?: number;
  };
  performanceData: ApiResponse<any>['data']['references']['performance'];
  onLogPerformance: (exerciseRef: string, weight: number, reps: number) => Promise<void>;
  isLogged?: boolean;
  isSuperset?: boolean;
  isPlanActive: boolean;
  exerciseDay: string;
  gradient?: string;
  className?: string;
}

interface SupersetCardProps {
  exercises: ExerciseBase[];
  details: { [key: string]: ExerciseReference };
  performanceData: ApiResponse<any>['data']['references']['performance'];
  onLogPerformance: (exerciseRef: string, weight: number, reps: number) => Promise<void>;
  isPlanActive: boolean;
  exerciseDay: string;
}

interface PerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (weight: number, reps: number) => Promise<void>;
  exerciseName: string;
  previousBest: {
    weight: number;
    reps: number;
  };
}

const WeekDayButton = ({ 
  day, 
  date, 
  isSelected, 
  isCompleted, 
  isCurrent, 
  onClick 
}: {
  day: number;
  date: Date;
  isSelected: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "group relative flex flex-col items-center justify-center w-full gap-1",
      "h-24 rounded-xl transition-all duration-200",
      "hover:scale-105 active:scale-95",
      isSelected 
        ? "bg-primary-500/20 border-2 border-primary-500" 
        : isCompleted 
          ? "bg-success-500/10 border border-success-500/20" 
          : "bg-content/5 border border-border hover:border-content",
    )}
  >
    <span className="text-xs text-foreground/60 group-hover:text-foreground">
      {format(date, 'EEE')}
    </span>
    <span className={cn(
      "text-xl font-semibold",
      isCurrent ? "text-primary-500" : "text-foreground"
    )}>
      {format(date, 'd')}
    </span>
    {isCompleted ? (
      <CheckCircle2 className="w-5 h-5 text-success-500" />
    ) : (
      <div className={cn(
        "w-2 h-2 rounded-full mt-1",
        isCurrent ? "bg-primary-500" : "bg-foreground/20"
      )} />
    )}
  </button>
);


const ExerciseCard = ({
  exercise,
  performanceData,
  onLogPerformance,
  isLogged,
  isSuperset,
  isPlanActive,
  exerciseDay,
  ...props
}: ExerciseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <GlassCard
      className={cn(
        "group transition-all duration-300 hover:shadow-lg",
        isLogged ? "from-success-500/10 to-background" : "from-content/5 to-background",
        isHovered && "scale-[1.02]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <div className="p-5">
        <div className="flex gap-4">
          {/* Exercise Image */}
          <div className="relative w-24 h-24 rounded-lg overflow-hidden">
            <motion.img
              src={exercise.details.thumbnail || exercise.details.starting}
              alt={exercise.ref}
              className="object-cover w-full h-full"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            />
            {isLogged && (
              <div className="absolute inset-0 bg-success-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success-500" />
              </div>
            )}
          </div>

          {/* Exercise Info */}
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {exercise.ref}
                  {isLogged && (
                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                  )}
                </h3>
                <p className="text-sm text-foreground/60">
                  {exercise.details.primary_muscle}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {exercise.bestWeight > 0 && (
                  <Tooltip content="Personal Best">
                    <Chip
                      size="sm"
                      className="bg-warning-500/10 text-warning-500"
                      startContent={<Target size={14} />}
                    >
                      {exercise.bestWeight}kg × {exercise.bestReps}
                    </Chip>
                  </Tooltip>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Chip
                size="sm"
                className="bg-primary-500/10 text-primary-500"
                startContent={<Dumbbell size={14} />}
              >
                {exercise.sets} × {exercise.reps}
              </Chip>
              <Chip
                size="sm"
                className="bg-secondary-500/10 text-secondary-500"
                startContent={<Clock size={14} />}
              >
                {exercise.rest}s rest
              </Chip>
              <Chip
                size="sm"
                className="bg-content/10"
                startContent={<BarChart3 size={14} />}
              >
                {exercise.details.mechanic}
              </Chip>
              <Chip
                size="sm"
                className="bg-content/10"
                startContent={<Heart size={14} />}
              >
                {exercise.details.level}
              </Chip>
            </div>

            {/* Action Buttons */}
            {isPlanActive && !isLogged && !isSuperset && (
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="bg-primary-500 text-white"
                  startContent={<Zap size={14} />}
                  onPress={() => onLogPerformance(1, 1)} // Replace with actual weight/reps
                >
                  Log Set
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onPress={() => {/* Show details modal */}}
                >
                  View Details
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export const WorkoutPlans = () => {
  const { loading, error, client, plans, references, refreshData } = useClientData();
  const { activePlan, completedPlans, currentDay } = usePlans(plans ?? []);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
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

  if (error || !client || !references) {
    return (
      <div className="text-center text-danger">
        {error || 'Failed to load workout plans'}
      </div>
    );
  }

  const currentPlan = activePlan || completedPlans[0];
  if (!currentPlan) return null;

  const dayKey = `day_${selectedDay}`;
  const exercises = currentPlan?.days[dayKey]?.exercises ?? [];
  const dayProgress = isPlanDayCompleted(currentPlan.days[dayKey]);
  const planProgress = Math.round(
    Object.values(currentPlan.days)
      .filter(day => isPlanDayCompleted(day))
      .length / Object.keys(currentPlan.days).length * 100
  );
  const getBestWeight = (exerciseRef: string) => {
    if (!references?.performance?.[exerciseRef]) return 0;
    return Math.max(...references.performance[exerciseRef].map(p => p.weight), 0);
  };
  
  const getBestReps = (exerciseRef: string) => {
    if (!references?.performance?.[exerciseRef]) return 0;
    return Math.max(...references.performance[exerciseRef].map(p => p.reps), 0);
  };
  
  const handleLogPerformance = async (
    exerciseRef: string, 
    weight: number, 
    reps: number
  ) => {
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] 
          bg-gradient-to-b from-primary-500/20 via-secondary-500/20 to-transparent 
          blur-3xl opacity-50" 
        />
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      <div className="container mx-auto p-4 space-y-6">
        {/* Header Section */}
        <GlassCard gradient="from-primary-500/10 via-background to-secondary-500/10">
          <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Workout Plan</h1>
              <p className="text-foreground/60">
                {format(new Date(currentPlan.start), 'MMM d')} - {format(new Date(currentPlan.end), 'MMM d, yyyy')}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10">
                <Target className="w-5 h-5 text-primary-500" />
                <span className="font-medium">{Math.round(planProgress)}% Complete</span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success-500/10">
                <Dumbbell className="w-5 h-5 text-success-500" />
                <span className="font-medium">
                  {currentPlan.config.weekly_workouts} workouts/week
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Week Calendar */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {Array.from({ length: 7 }, (_, i) => {
            const day = i + 1;
            const date = addDays(new Date(currentPlan.start), i);
            return (
              <div className="flex-1 min-w-[100px]" key={day}>
                <WeekDayButton
                  day={day}
                  date={date}
                  isSelected={day === selectedDay}
                  isCompleted={isPlanDayCompleted(currentPlan.days[`day_${day}`])}
                  isCurrent={day === currentDay}
                  onClick={() => setSelectedDay(day)}
                />
              </div>
            );
          })}
        </div>

        {/* Day Progress */}
        <GlassCard gradient="from-content/5 to-background">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Day {selectedDay} Progress</h2>
                <p className="text-foreground/60">
                  {dayProgress ? 'All exercises completed' : 'Complete all exercises to finish your workout'}
                </p>
              </div>
              {dayProgress && (
                <div className="flex items-center gap-2 text-success-500">
                  <CheckCircle2 size={20} />
                  <span className="font-medium">Completed</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-2">
                <Progress
                  value={dayProgress ? 100 : 0}
                  size="lg"
                  radius="lg"
                  classNames={{
                    base: "h-8",
                    indicator: "bg-gradient-to-r from-primary-500 to-secondary-500"
                  }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <GlassCard
                  gradient="from-primary-500/5 to-background"
                  className="border border-primary-500/10"
                >
                  <div className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-500/10">
                      <Flame className="w-4 h-4 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Calories</p>
                      <p className="font-semibold">320 kcal</p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard
                  gradient="from-secondary-500/5 to-background"
                  className="border border-secondary-500/10"
                >
                  <div className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary-500/10">
                      <Clock className="w-4 h-4 text-secondary-500" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Duration</p>
                      <p className="font-semibold">45 min</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Exercises List */}
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {exercise.type === 'regular' ? (
                <ExerciseCard
                exercise={{
                  ...exercise.exercise,
                  details: references.exercises[exercise.exercise.ref],
                  bestWeight: getBestWeight(exercise.exercise.ref),
                  bestReps: getBestReps(exercise.exercise.ref)
                }}
                performanceData={references.performance}
                onLogPerformance={handleLogPerformance}
                isLogged={exercise.exercise.logged === 1}
                isPlanActive={true}
                exerciseDay={dayKey}
              />
            ) : (
              <SupersetCard
                exercises={exercise.exercises}
                details={references.exercises}
                performanceData={references.performance}
                onLogPerformance={handleLogPerformance}
                isPlanActive={true}
                exerciseDay={dayKey}
              />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Superset Card Component
const SupersetCard = ({
  exercises,
  details,
  performanceData,
  onLogPerformance,
  isPlanActive,
  exerciseDay,
}: SupersetCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <GlassCard
      gradient="from-warning-500/10 via-background to-secondary-500/10"
      className="transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6 space-y-4">
        {/* Superset Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-warning-500/20">
            <Zap className="w-5 h-5 text-warning-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Superset</h3>
            <p className="text-sm text-foreground/60">
              Complete these exercises back to back
            </p>
          </div>
        </div>

        {/* Exercises List */}
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <div key={exercise.ref} className="relative">
              {index > 0 && (
                <div className="absolute -top-4 left-12 w-0.5 h-4 bg-warning-500/20" />
              )}
              <ExerciseCard
  exercise={{
    ...exercise,
    details: details[exercise.ref],
    bestWeight: 0,
    bestReps: 0
  }}
  performanceData={performanceData}
  onLogPerformance={onLogPerformance} // Pass through directly
  isLogged={exercise.logged === 1}
  isSuperset={true}
  isPlanActive={isPlanActive}
  exerciseDay={exerciseDay}
  gradient="from-warning-500/5 to-background"
  className="border border-warning-500/10"
/>
            </div>
          ))}
        </div>

        {/* Footer with Tips */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-warning-500/5 border border-warning-500/10">
          <Flame className="w-5 h-5 text-warning-500" />
          <p className="text-sm text-foreground/60">
            Minimize rest between exercises for maximum intensity
          </p>
        </div>
      </div>
    </GlassCard>
  );
};

// Performance Modal Component
const PerformanceModal = ({
  isOpen,
  onClose,
  onSubmit,
  exerciseName,
  previousBest
}: PerformanceModalProps) => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!weight || !reps) {
      setError('Please enter both weight and reps');
      return;
    }

    const weightNum = parseFloat(weight);
    const repsNum = parseInt(reps);

    if (isNaN(weightNum) || isNaN(repsNum) || weightNum <= 0 || repsNum <= 0) {
      setError('Please enter valid numbers');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(weightNum, repsNum);
      onClose();
    } catch (err) {
      setError('Failed to save performance data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" }
          },
          exit: {
            y: 20,
            opacity: 0,
            transition: { duration: 0.2, ease: "easeIn" }
          }
        }
      }}
    >
      <GlassCard gradient="from-background via-content/5 to-background">
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Log Performance</h3>
            <p className="text-sm text-foreground/60">
              Track your progress for {exerciseName}
            </p>
          </div>

          {previousBest.weight > 0 && (
            <GlassCard 
              gradient="from-warning-500/10 to-background"
              className="border border-warning-500/10"
            >
              <div className="p-4 flex items-center gap-3">
                <Target className="w-5 h-5 text-warning-500" />
                <div>
                  <p className="text-sm text-foreground/60">Personal Best</p>
                  <p className="font-semibold">
                    {previousBest.weight}kg × {previousBest.reps} reps
                  </p>
                </div>
              </div>
            </GlassCard>
          )}

          <div className="space-y-4">
            <Input
              type="number"
              label="Weight (kg)"
              placeholder="Enter weight"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
                setError('');
              }}
              errorMessage={error}
              startContent={<Scale className="text-default-400" size={16} />}
              className="bg-content/5"
            />

            <Input
              type="number"
              label="Reps"
              placeholder="Enter reps"
              value={reps}
              onChange={(e) => {
                setReps(e.target.value);
                setError('');
              }}
              errorMessage={error}
              startContent={<Zap className="text-default-400" size={16} />}
              className="bg-content/5"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button 
              variant="flat" 
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleSubmit}
              isLoading={loading}
              className="bg-gradient-to-r from-primary-500 to-secondary-500"
            >
              Save Performance
            </Button>
          </div>
        </div>
      </GlassCard>
    </Modal>
  );
};

export default WorkoutPlans;