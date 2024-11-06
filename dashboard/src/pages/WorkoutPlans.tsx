import { useState, useEffect, useRef } from 'react';
import {
  Button,
  Progress,
  Chip,
  Tooltip,
  Tabs,
  Tab,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalContent,
  cn,
} from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Calendar,
  CheckCircle2,
  Clock,
  Gauge,
  Boxes,
  Target,
  ChevronLeft,
  ChevronRight,
  Zap,
  Flame,
  ArrowRight,
  BarChart3,
  Heart,
  Scale,
  AlertTriangle,
  Trophy,
  Medal,
  ArrowUp,
  Save,
  Info,
  Repeat,
  Activity,
  ArrowUpRight,
  Battery,
  Coffee,
  Moon,
  ScrollText,
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useClientData } from '../hooks/useClientData';
import { usePlans } from '../hooks/usePlans';
import { logPerformance, isPlanDayCompleted } from '../utils/api';
import { Exercise, ExerciseBase, ExerciseReference } from '@/types/workout';
import { ApiResponse } from '@/types/api';
import { GlassCard } from '@/components/shared/GlassCard';
import { useNavigate } from 'react-router-dom';
import { calculatePlanProgress } from '../utils/api';

// Helper Components
const WeekDayButton = ({
  day,
  date,
  isSelected,
  isCompleted,
  isCurrent,
  onClick,
  hasWorkout = false
}: {
  day: number;
  date: Date;
  isSelected: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  onClick: () => void;
  hasWorkout?: boolean;
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
    {hasWorkout ? (
      <div className="flex items-center gap-1.5">
        <Dumbbell
          size={14}
          className={cn(
            "text-foreground/40",
            isCompleted && "text-success-500",
            isCurrent && "text-primary-500"
          )}
        />
      </div>
    ) : (
      <div className="flex items-center gap-1.5">
        <Moon
          size={14}
          className="text-foreground/40"
        />
      </div>
    )}
  </button>
);


const RestDayCard = () => (
  <GlassCard
    className="p-6 space-y-4 mt-6"
    style={{ border: '0'}}
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 rounded-xl bg-primary-500/10">
        <Battery className="w-6 h-6 text-primary-500" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">Rest Day</h3>
        <p className="text-foreground/60">Time to recover and recharge</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 rounded-xl bg-content/5">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-danger-500" />
          <span className="text-sm font-medium">Recovery Focus</span>
        </div>
        <p className="text-sm text-foreground/60">
          Let your muscles repair and grow stronger
        </p>
      </div>

      <div className="p-4 rounded-xl bg-content/5">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-success-500" />
          <span className="text-sm font-medium">Light Activity</span>
        </div>
        <p className="text-sm text-foreground/60">
          Consider a light walk or gentle stretching
        </p>
      </div>

      <div className="p-4 rounded-xl bg-content/5">
        <div className="flex items-center gap-2 mb-2">
          <Coffee className="w-4 h-4 text-warning-500" />
          <span className="text-sm font-medium">Recovery Tips</span>
        </div>
        <p className="text-sm text-foreground/60">
          Stay hydrated and get quality sleep
        </p>
      </div>
    </div>

    <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-500/5 border border-primary-500/10 mt-6">
      <Info className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-foreground/70">
        Rest days are crucial for preventing injury and ensuring optimal performance in your next workout.
        Use this time to focus on nutrition and mobility work.
      </p>
    </div>
  </GlassCard>
);

const ExerciseCard = ({
  exercise,
  references,
  isLogged = false,
  isSuperset = false,
  onLogSet,
  onViewDetails,
  selectedPlan,
  exerciseNumber // Add this prop
}: {
  exercise: ExerciseBase;
  references: { [key: string]: ExerciseReference };
  isLogged?: boolean;
  isSuperset?: boolean;
  onLogSet?: () => void;
  onViewDetails: () => void;
  selectedPlan: 'active' | 'history';
  exerciseNumber?: number; // Add this type
}) => {
  const details = references[exercise.ref];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <GlassCard
      variant="frosted"
      gradient={isLogged ? "from-success-500/10 to-background" : "from-content/5 to-background"}
      className={cn(
        "transition-all duration-300 hover:shadow-lg",
        isHovered && "scale-[1.02]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPress={onViewDetails}
    >
      <div className="p-5 space-y-4">
        {/* Exercise Header */}
        <div className="flex gap-4">
          {/* Exercise Image */}
          <div className="relative w-24 h-24 rounded-lg overflow-hidden">
            <motion.img
              src={details.thumbnail || details.starting}
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

          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {!isSuperset && exerciseNumber && (
                      <span className="text-foreground-500">{exerciseNumber}.</span>
                    )}
                    {exercise.ref}
                    {isLogged && (
                      <CheckCircle2 className="w-4 h-4 text-success-500" />
                    )}
                  </h3>
                  <p className="text-sm text-foreground/60">{details.primary_muscle}</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* <Chip
                    size="sm"
                    className="bg-content/10"
                    startContent={<Activity size={14} />}
                  >
                    {details.level}
                  </Chip> */}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
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
                {/* <Chip
                  size="sm"
                  className="bg-content/10"
                  startContent={<BarChart3 size={14} />}
                >
                  {details.mechanic || 'Compound'}
                </Chip> */}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {!isLogged && !isSuperset && selectedPlan === 'active' && (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
                  startContent={<Zap size={14} />}
                  onPress={onLogSet}
                >
                  Log Set
                </Button>
              )}
              {/* <Button
                size="sm"
                variant="flat"
                className="bg-content/10"
                onPress={onViewDetails}
              >
                View Details
              </Button> */}
            </div>
          </div>
        </div>

        {/* Exercise Details Preview */}
        {/* <div className="flex items-start gap-3 p-3 rounded-lg bg-content/5">
          <Info className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/70 line-clamp-2">
            {details.instructions}
          </p>
        </div> */}
      </div>
    </GlassCard>
  );
};

const SupersetCard = ({
  exercises,
  references,
  onLogPerformance,
  onViewDetails,
  selectedPlan,
  exerciseNumber // Add this prop
}: {
  exercises: ExerciseBase[];
  references: { [key: string]: ExerciseReference };
  onLogPerformance: (exerciseRef: string, weight: number, reps: number) => Promise<void>;
  onViewDetails: (exerciseRef: string) => void;
  selectedPlan: 'active' | 'history';
  exerciseNumber?: number; // Add this type
}) => {
  return (
    <GlassCard
      variant="frosted"
      gradient="from-warning-500/10 via-background to-secondary-500/10"
      intensity="heavy"
      className="border border-2 border-warning-500/70"
    >
      <div className="p-6 space-y-4">
        {/* Superset Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-warning-500/20">
            <Zap className="w-5 h-5 text-warning-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {exerciseNumber && (
                <span className="text-foreground-500">{exerciseNumber}.</span>
              )}
              Superset
            </h3>
            <p className="text-sm text-foreground/60">
              Complete {exercises.length} exercises back to back
            </p>
          </div>
        </div>

        {/* Exercises */}
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <div key={exercise.ref} className="relative">
              {index > 0 && (
                <div className="absolute -top-4 left-12 w-0.5 h-4 bg-warning-500" />
              )}
              <ExerciseCard
                exercise={exercise}
                references={references}
                isLogged={exercise.logged === 1}
                isSuperset={true}
                onViewDetails={() => onViewDetails(exercise.ref)}
                selectedPlan={selectedPlan}
              />
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-warning-500/5 border border-warning-500/10">
          <div className="p-2 rounded-lg bg-warning-500/70">
            <Flame className="w-4 h-4 text-foreground" />
          </div>
          <div>
            <p className="font-medium">Superset Tips</p>
            <p className="text-sm text-foreground/60">
              Minimize rest between exercises for maximum intensity and efficiency
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

const ExerciseDetailsModal = ({
  isOpen,
  onClose,
  exercise,
  details,
  isLogged,
}: {
  isOpen: boolean;
  onClose: () => void;
  exercise: ExerciseBase;
  details: ExerciseReference;
  isLogged: boolean;
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    size="3xl"
    backdrop="blur"
    scrollBehavior="inside"
    classNames={{
      backdrop: "bg-background/70",
      base: "bg-background/95",
      body: "p-0",
      closeButton: "hover:bg-white/5 active:bg-white/10",
    }}
  >
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1 px-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{exercise.ref}</h3>
                  {isLogged && <CheckCircle2 className="w-5 h-5 text-success-500" />}
                </div>
                <p className="text-foreground/60">{details.primary_muscle}</p>
              </div>

              <div className="flex items-center gap-2">
                <Chip size="sm"
                  className="bg-primary-500/10"
                  startContent={<Target size={14} />}
                >
                  {details.level}
                </Chip>
                <Chip
                  size="sm"
                  className="bg-secondary-500/10"
                  startContent={<Activity size={14} />}
                >
                  {details.mechanic || 'Compound'}
                </Chip>
              </div>
            </div>
          </ModalHeader>

          <ModalBody className="px-6 py-4 space-y-6">
            {/* Exercise Images */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-foreground/60 mb-2">Starting Position</p>
                <img
                  src={details.starting}
                  alt="Starting position"
                  className="rounded-xl w-full aspect-square object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground/60 mb-2">Ending Position</p>
                <img
                  src={details.ending}
                  alt="Ending position"
                  className="rounded-xl w-full aspect-square object-cover"
                />
              </div>
            </div>

            {/* Exercise Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary-500/10">
                  <Info className="w-5 h-5 text-primary-500" />
                </div>
                <h4 className="text-lg font-semibold">Exercise Details</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-content/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Dumbbell className="w-4 h-4 text-primary-500" />
                    <p className="font-medium">Equipment</p>
                  </div>
                  <p className="text-foreground/80">{details.equipment || 'Bodyweight'}</p>
                </div>

                <div className="p-4 rounded-xl bg-content/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-primary-500" />
                    <p className="font-medium">Force Type</p>
                  </div>
                  <p className="text-foreground/80">{details.force}</p>
                </div>
              </div>

              {/* Muscles Worked */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-warning-500/10">
                    <Activity className="w-5 h-5 text-warning-500" />
                  </div>
                  <h4 className="text-lg font-semibold">Muscles Worked</h4>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground/60">Primary</p>
                    <div className="flex flex-wrap gap-2">
                      <Chip
                        className="bg-warning-500/10 text-warning-500"
                        size="sm"
                      >
                        {details.primary_muscle}
                      </Chip>
                    </div>
                  </div>

                  {details.secondary_muscles?.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground/60">Secondary</p>
                      <div className="flex flex-wrap gap-2">
                        {details.secondary_muscles.map((muscle, index) => (
                          <Chip
                            key={index}
                            className="bg-content/10"
                            size="sm"
                          >
                            {muscle.muscle}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-success-500/10">
                    <ScrollText className="w-5 h-5 text-success-500" />
                  </div>
                  <h4 className="text-lg font-semibold">Instructions</h4>
                </div>
                <div className="p-4 rounded-xl bg-content/5">
                  <p className="text-foreground/80 leading-relaxed">
                    {details.instructions}
                  </p>
                </div>
              </div>
            </div>
          </ModalBody>
        </>
      )}
    </ModalContent>
  </Modal>
);

const PerformanceModal = ({
  isOpen,
  onClose,
  onSubmit,
  exerciseName,
  targetReps,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (weight: number, reps: number) => Promise<void>;
  exerciseName: string;
  targetReps: number;
}) => {
  const [weight, setWeight] = useState('');
  const [actualReps, setActualReps] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!weight || !actualReps) {
      setError('Please enter both weight and reps');
      return;
    }

    const weightNum = parseFloat(weight);
    const repsNum = parseInt(actualReps);

    if (isNaN(weightNum) || weightNum <= 0) {
      setError('Please enter a valid weight');
      return;
    }

    if (isNaN(repsNum) || repsNum <= 0) {
      setError('Please enter valid reps');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(weightNum, repsNum);
      onClose();
    } catch (err) {
      setError('Failed to log performance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      scrollBehavior="inside"
      placement="center"
      classNames={{
        backdrop: "bg-background/70",
        base: "bg-background/95",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 px-6">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">Log Performance</h3>
                <p className="text-foreground/60">{exerciseName}</p>
              </div>
            </ModalHeader>

            <ModalBody className="px-6 py-4 space-y-6">
              <div className="p-4 rounded-xl bg-content/5">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-primary-500" />
                  <span className="text-sm text-foreground/60">Target</span>
                </div>
                <p className="text-lg font-semibold">{targetReps} reps</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Weight Used"
                  placeholder="Enter weight"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                    setError('');
                  }}
                  startContent={<Scale className="text-default-400" size={16} />}
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">kg</span>
                    </div>
                  }
                />

                <Input
                  type="number"
                  label="Reps Completed"
                  placeholder="Enter reps"
                  value={actualReps}
                  onChange={(e) => {
                    setActualReps(e.target.value);
                    setError('');
                  }}
                  startContent={<Repeat className="text-default-400" size={16} />}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-danger-500/10 text-danger">
                  <AlertTriangle className="w-4 h-4" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </ModalBody>

            <ModalFooter className="px-6 py-4">
              <Button
                variant="light"
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
                Log Performance
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// Replace the PlanSelector component with this:
const PlanSelector = ({
  plans,
  selectedPlanIndex,
  onSelect
}: {
  plans: any[];
  selectedPlanIndex: number;
  onSelect: (index: number) => void;
}) => {
  const getPlanDateRange = (plan: any) => {
    const start = format(new Date(plan.start), 'MMM d');
    const end = format(new Date(plan.end), 'MMM d, yyyy');
    return `${start} - ${end}`;
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        isIconOnly
        variant="light"
        isDisabled={selectedPlanIndex === plans.length - 1}
        onPress={() => onSelect(selectedPlanIndex + 1)}
      >
        <ChevronLeft size={16} />
      </Button>
      <GlassCard
        variant="frosted"
        className="px-4 py-2"
      >
        <span className="text-sm">
          {getPlanDateRange(plans[selectedPlanIndex])}
        </span>
      </GlassCard>
      <Button
        size="sm"
        isIconOnly
        variant="light"
        isDisabled={selectedPlanIndex === 0}
        onPress={() => onSelect(selectedPlanIndex - 1)}
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

// Replace the PlanHero component with this new design:
interface PlanHeroProps {
  plan: any;
  selectedDay: number | null;  // Update type to allow null
  currentDay: number | null;   // Update type to allow null
  onDaySelect: (day: number) => void;
  selectedPlan: 'active' | 'history';
  onPlanTypeChange: (key: 'active' | 'history') => void;
  completedPlansCount: number;
  daysContainerRef: React.RefObject<HTMLDivElement>;
  // Add these new props
  completedPlans: any[];
  historicalPlanIndex: number;
  onHistoricalPlanSelect: (index: number) => void;
}

const PlanHero = ({
  plan,
  selectedDay,
  currentDay,
  onDaySelect,
  selectedPlan,
  onPlanTypeChange,
  completedPlansCount,
  daysContainerRef,  // Add this prop
  // Add these new props
  completedPlans,
  historicalPlanIndex,
  onHistoricalPlanSelect
}: PlanHeroProps) => {
  const planProgress = calculatePlanProgress(plan);
  const startDate = new Date(plan.start);
  const isCurrentWeek = selectedPlan === 'active';

  const getDayDate = (dayIndex: number) => addDays(startDate, dayIndex);
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Header Card */}
      <GlassCard
        variant="gradient"
        gradient="from-primary-500/20 via-transparent to-secondary-500/20"
        intensity="heavy"
      >

        {/* Content */}
        <div className="relative p-6 space-y-6">
          {/* Top Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary-500 text-white shadow-lg shadow-primary-500/20">
                <Calendar className="w-6 h-6" />
              </div>
              {selectedPlan === 'active' ? (
                <div>
                  <h1 className="text-xl font-bold">
                    {format(startDate, 'MMM d')} - {format(addDays(startDate, 6), 'MMM d')}
                  </h1>
                  <p className="text-sm text-foreground/60">
                    {format(startDate, 'yyyy')}
                  </p>
                </div>
              ) : (
                <PlanSelector
                  plans={completedPlans}
                  selectedPlanIndex={historicalPlanIndex}
                  onSelect={onHistoricalPlanSelect}
                />
              )}
            </div>

            {/* Plan Type Selector */}
            <div className="flex gap-2 p-1 rounded-xl bg-content/5 backdrop-blur-xl">
              <Button
                size="sm"
                variant={selectedPlan === 'active' ? 'solid' : 'light'}
                onPress={() => onPlanTypeChange('active')}
                className={cn(
                  "rounded-lg shadow-lg",
                  selectedPlan === 'active' && "bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
                )}
                startContent={<Zap size={16} className={selectedPlan === 'active' ? "text-white" : ""} />}
              >
                Current Week
              </Button>
              <Button
                size="sm"
                variant={selectedPlan === 'history' ? 'solid' : 'light'}
                onPress={() => onPlanTypeChange('history')}
                isDisabled={completedPlansCount === 0}
                className={cn(
                  "rounded-lg shadow-lg",
                  selectedPlan === 'history' && "bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
                )}
                startContent={<Clock size={16} className={selectedPlan === 'history' ? "text-white" : ""} />}
              >
                History ({completedPlansCount})
              </Button>
            </div>
          </div>

          {/* Progress Section */}
          <div>
            {/* <GlassCard variant="frosted" className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary-500/10">
                  <Target className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Progress</p>
                  <p className="text-lg font-semibold">{Math.round(planProgress)}%</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard variant="frosted" className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-secondary-500/10">
                  <Dumbbell className="w-5 h-5 text-secondary-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Workouts</p>
                  <p className="text-lg font-semibold">{plan.config.weekly_workouts}/week</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard variant="frosted" className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-success-500/10">
                  <Activity className="w-5 h-5 text-success-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Completed</p>
                  <p className="text-lg font-semibold">
                    {Object.values(plan.days).filter((day: any) => isPlanDayCompleted(day)).length} days
                  </p>
                </div>
              </div>
            </GlassCard> */}

            {/* Week Calendar */}
            <div className="relative">
              {/* Shadow Indicators */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />

              {/* Scrollable Container */}
              <div
                ref={daysContainerRef}
                className="flex gap-3 overflow-x-auto pb-4 pt-2 scrollbar-hide -mx-2"
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {Array.from({ length: 7 }, (_, i) => {
                  const day = i + 1;
                  const date = getDayDate(i);
                  const dayExercises = plan.days[`day_${day}`]?.exercises || [];
                  const isCompleted = isPlanDayCompleted(plan.days[`day_${day}`]);
                  const isCurrentDay = isCurrentWeek && currentDay === day;  // Fix comparison
                  const isTodayDate = isToday(date);

                  return (
                    <div
                      key={day}
                      className="flex-none w-[150px]"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      <GlassCard
                        variant={selectedDay === day ? 'gradient' : 'frosted'}  // Fix comparison
                        gradient={
                          selectedDay === day
                            ? "from-primary-500/20 to-secondary-500/20"
                            : undefined
                        }
                        className={cn(
                          "cursor-pointer transition-all duration-300 h-full",
                          "hover:scale-[1.02] active:scale-[0.98]",
                          isCompleted && selectedDay !== day && "bg-success-500/10 border-success-500/20",
                          selectedDay === day && "shadow-md shadow-primary-500/20"
                        )}
                        onPress={() => onDaySelect(day)}
                      >
                        <div className="py-4 px-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={cn(
                              "text-sm",
                              isTodayDate ? "text-primary-500" : "text-foreground/60"
                            )}>
                              {format(date, 'EEEE')}
                            </span>
                            <span className={cn(
                              "text-2xl font-bold",
                              isTodayDate && "text-primary-500"
                            )}>
                              {format(date, 'd')}
                            </span>
                          </div>

                          <div className="space-y-3">
                            {dayExercises.length > 0 ? (
                              <>
                                <div className="flex items-center gap-2">
                                  <Dumbbell
                                    size={16}
                                    className={cn(
                                      isCompleted ? "text-success-500" : "text-foreground/40",
                                      isCurrentDay && "text-primary-500"
                                    )}
                                  />
                                  <span className="text-sm text-foreground/60">
                                    {dayExercises.length} exercise{dayExercises.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                                <div className="h-px bg-content/10" />
                                {/* <div className="text-xs text-foreground/60">
                            {dayExercises.slice(0, 2).map((ex: any, idx: number) => (
                              <div key={idx} className="truncate">
                                • {ex.type === 'regular' ? ex.exercise.ref : 'Superset'}
                              </div>
                            ))}
                            {dayExercises.length > 2 && (
                              <div className="text-primary-500">
                                +{dayExercises.length - 2} more
                              </div>
                            )}
                          </div> */}
                              </>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Moon size={16} className="text-foreground/40" />
                                <span className="text-sm text-foreground/60">Rest Day</span>
                              </div>
                            )}
                          </div>

                          {isCompleted && (
                            <div className="absolute top-0 right-0">
                              <div className="w-6 h-6 rounded-full bg-success-500/10 flex items-center justify-center">
                                <CheckCircle2 size={14} className="text-success-500" />
                              </div>
                            </div>
                          )}
                        </div>
                      </GlassCard>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </GlassCard>
    </div>
  );
};

// Add this new component after your existing component definitions
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

// Main WorkoutPlans Component
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
            plan={currentPlan}
            selectedDay={selectedDay || 1}  // Provide default value
            currentDay={currentDay}
            onDaySelect={setSelectedDay}
            selectedPlan={selectedPlan}
            onPlanTypeChange={(key) => {
              setSelectedPlan(key);
              setHistoricalPlanIndex(0);
            }}
            completedPlansCount={completedPlans.length}
            daysContainerRef={daysContainerRef}  // Pass the ref here
            // Add these new props
            completedPlans={completedPlans}
            historicalPlanIndex={historicalPlanIndex}
            onHistoricalPlanSelect={setHistoricalPlanIndex}
          />
        </div>

        {/* Only show SectionTitle and exercises if it's not a rest day */}
        {hasWorkout && <SectionTitle />}
        <div className="space-y-4">
          {hasWorkout ? (
            exercises.map((exercise, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {exercise.type === 'regular' ? (
                  <ExerciseCard
                    exercise={exercise.exercise}
                    references={references.exercises}
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
              </motion.div>
            ))
          ) : (
            <RestDayCard />
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
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
          />
        )}
      </AnimatePresence>
    </div>
  );
}