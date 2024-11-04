import { useEffect, useState } from 'react';
import { 
  Button, 
  Progress,
  Avatar,
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


// Types
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
  onDetailsClick?: () => void;
  onLogClick?: () => void;
}

interface SupersetCardProps {
  exercises: ExerciseBase[];
  details: { [key: string]: ExerciseReference };
  performanceData: ApiResponse<any>['data']['references']['performance'];
  onLogPerformance: (exerciseRef: string, weight: number, reps: number) => Promise<void>;
  isPlanActive: boolean;
  exerciseDay: string;
  onDetailsClick: (exerciseRef: string) => void; // Changed to non-optional
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

interface ExerciseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: {
    ref: string;
    details: ExerciseReference;
    sets: number;
    reps: number;
    rest: number;
    bestWeight: number;
    bestReps: number;
    isLogged: boolean;
  };
}

// Helper Components
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

// ExerciseCard Component
const ExerciseCard = ({
  exercise,
  performanceData,
  onLogPerformance,
  isLogged = false,
  isSuperset = false,
  isPlanActive,
  exerciseDay,
  gradient = "from-content/5 to-background",
  className,
  onDetailsClick,
  onLogClick,
  ...props
}: ExerciseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <GlassCard
      gradient={gradient}
      className={cn(
        "group transition-all duration-300 hover:shadow-lg",
        isLogged ? "from-success-500/10 to-background" : "",
        isHovered && "scale-[1.02]",
        className
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
            <div className="flex gap-2 pt-2">
  {isPlanActive && !isLogged && !isSuperset && (
    <Button
      size="sm"
      className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
      startContent={<Zap size={14} />}
      onPress={onLogClick}
    >
      Log Set
    </Button>
  )}
  <Button
    size="sm"
    variant="flat"
    className="bg-content/10"
    onPress={onDetailsClick}
  >
    View Details
  </Button>
</div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
// SupersetCard Component
const SupersetCard = ({
  exercises,
  details,
  performanceData,
  onLogPerformance,
  isPlanActive,
  exerciseDay,
  onDetailsClick,
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
                onLogPerformance={onLogPerformance}
                isLogged={exercise.logged === 1}
                isSuperset={true}
                isPlanActive={isPlanActive}
                exerciseDay={exerciseDay}
                gradient="from-warning-500/5 to-background"
                className="border border-warning-500/10"
                onDetailsClick={() => onDetailsClick(exercise.ref)}
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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setWeight('');
      setReps('');
      setError('');
    }
  }, [isOpen]);

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
        body: "p-0",
        closeButton: "hover:bg-white/5 active:bg-white/10",
      }}
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
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 px-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">Log Performance</h3>
                  <p className="text-sm text-foreground/60">
                    Track your progress for {exerciseName}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-primary-500/10">
                  <Trophy className="w-5 h-5 text-primary-500" />
                </div>
              </div>
            </ModalHeader>
            
            <ModalBody className="px-6 py-4 space-y-6">
              {/* Previous Best */}
              {previousBest.weight > 0 && (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-warning-500/10 via-background to-warning-500/5">
                  <div className="p-3 rounded-xl bg-warning-500/10">
                    <Medal className="w-6 h-6 text-warning-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-lg">
                        {previousBest.weight}kg × {previousBest.reps}
                      </p>
                      <Chip size="sm" className="bg-warning-500/20 text-warning-500">
                        PR
                      </Chip>
                    </div>
                    <p className="text-sm text-foreground/60">Personal Best</p>
                  </div>
                </div>
              )}

              {/* Input Fields */}
              <div className="space-y-4">
                <div>
                  <Input
                    type="number"
                    label="Weight"
                    placeholder="Enter weight"
                    value={weight}
                    onChange={(e) => {
                      setWeight(e.target.value);
                      setError('');
                    }}
                    startContent={
                      <Scale className="text-default-400 flex-shrink-0" size={18} />
                    }
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">kg</span>
                      </div>
                    }
                    classNames={{
                      label: "text-foreground/90",
                      input: [
                        "bg-transparent",
                        "text-foreground/90",
                        "placeholder:text-foreground/50",
                      ],
                      innerWrapper: "bg-transparent",
                      inputWrapper: [
                        "shadow-sm",
                        "bg-content/10",
                        "backdrop-blur-sm",
                        "hover:bg-content/20",
                        "group-data-[focused=true]:bg-content/20",
                        "!cursor-text",
                        "text-lg"
                      ],
                    }}
                  />
                  {previousBest.weight > 0 && weight && parseFloat(weight) > previousBest.weight && (
                    <div className="flex items-center gap-2 mt-1.5 text-success-500 text-sm">
                      <ArrowUp size={14} />
                      <span>New personal record!</span>
                    </div>
                  )}
                </div>

                <div>
                  <Input
                    type="number"
                    label="Repetitions"
                    placeholder="Enter number of reps"
                    value={reps}
                    onChange={(e) => {
                      setReps(e.target.value);
                      setError('');
                    }}
                    startContent={
                      <Repeat className="text-default-400 flex-shrink-0" size={18} />
                    }
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">reps</span>
                      </div>
                    }
                    classNames={{
                      label: "text-foreground/90",
                      input: [
                        "bg-transparent",
                        "text-foreground/90",
                        "placeholder:text-foreground/50",
                      ],
                      innerWrapper: "bg-transparent",
                      inputWrapper: [
                        "shadow-sm",
                        "bg-content/10",
                        "backdrop-blur-sm",
                        "hover:bg-content/20",
                        "group-data-[focused=true]:bg-content/20",
                        "!cursor-text",
                        "text-lg"
                      ],
                    }}
                  />
                  {previousBest.reps > 0 && reps && parseInt(reps) > previousBest.reps && (
                    <div className="flex items-center gap-2 mt-1.5 text-success-500 text-sm">
                      <ArrowUp size={14} />
                      <span>New personal record!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-danger-500/10 text-danger border border-danger-500/20">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Helpful Tip */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-500/5">
                <div className="p-2 rounded-lg bg-primary-500/10">
                  <Info className="w-4 h-4 text-primary-500" />
                </div>
                <p className="text-sm text-foreground/60">
                  Enter your performance for this set. Make sure to use proper form and stay within your capabilities.
                </p>
              </div>
            </ModalBody>
            
            <ModalFooter className="px-6 py-4">
              <Button 
                variant="light" 
                onPress={onClose}
                className="font-medium"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={loading}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 font-medium"
                startContent={!loading && <Save size={18} />}
              >
                Save Performance
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// Exercise Details Modal Component
const ExerciseDetailsModal = ({
  isOpen,
  onClose,
  exercise
}: ExerciseDetailsModalProps) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="3xl"
      backdrop="blur"
      scrollBehavior="inside"
      placement="center"
      classNames={{
        backdrop: "bg-background/70",
        base: "bg-background/95",
        body: "p-0",
        closeButton: "hover:bg-white/5 active:bg-white/10",
      }}
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
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 px-6">
              <div className="flex flex-col gap-2">
                {/* Exercise Title */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{exercise.ref}</h3>
                      {exercise.isLogged && (
                        <CheckCircle2 className="w-5 h-5 text-success-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                      <span>{exercise.details.primary_muscle}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span>{exercise.details.category}</span>
                    </div>
                  </div>
                  
                  {/* Best Performance */}
                  {exercise.bestWeight > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-warning-500/10">
                      <Target className="w-4 h-4 text-warning-500" />
                      <div>
                        <p className="text-sm font-medium">
                          {exercise.bestWeight}kg × {exercise.bestReps}
                        </p>
                        <p className="text-xs text-foreground/60">Personal Best</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-500/10">
                    <Dumbbell className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-medium">
                      {exercise.sets} sets × {exercise.reps} reps
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary-500/10">
                    <Clock className="w-4 h-4 text-secondary-500" />
                    <span className="text-sm font-medium">{exercise.rest}s rest</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success-500/10">
                    <Activity className="w-4 h-4 text-success-500" />
                    <span className="text-sm font-medium">{exercise.details.level}</span>
                  </div>
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="px-6 py-4 space-y-6">
              {/* Exercise Images */}
              <div className="flex gap-6">
  <div className="flex-1">
    <p className="text-sm font-medium text-foreground/60 mb-2">Starting Position</p>
    <img
      src={exercise.details.starting}
      alt="Starting position"
      className="rounded-xl w-full h-[300px] object-cover shadow-lg"
    />
  </div>
  <div className="flex-1">
    <p className="text-sm font-medium text-foreground/60 mb-2">Ending Position</p>
    <img
      src={exercise.details.ending}
      alt="Ending position"
      className="rounded-xl w-full h-[300px] object-cover shadow-lg"
    />
  </div>
</div>

              {/* Instructions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary-500/10">
                    <Gauge className="w-5 h-5 text-primary-500" />
                  </div>
                  <h4 className="text-lg font-semibold">Instructions</h4>
                </div>
                <div className="px-4 py-3 rounded-xl bg-content/5">
                  <p className="text-foreground/80 leading-relaxed">
                    {exercise.details.instructions}
                  </p>
                </div>
              </div>

              {/* Muscles Worked */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-warning-500/10">
                    <Flame className="w-5 h-5 text-warning-500" />
                  </div>
                  <h4 className="text-lg font-semibold">Muscles Worked</h4>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground/60">Primary</p>
                    <div className="flex flex-wrap gap-2">
                      <Chip
                        className="bg-warning-500/10 text-warning-500 border-warning-500/20"
                        size="sm"
                      >
                        {exercise.details.primary_muscle}
                      </Chip>
                    </div>
                  </div>

                  {exercise.details.secondary_muscles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground/60">Secondary</p>
                      <div className="flex flex-wrap gap-2">
                        {exercise.details.secondary_muscles.map((muscle, index) => (
                          <Chip
                            key={index}
                            className="bg-content/10 border-content/20"
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

              {/* Additional Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="px-4 py-3 rounded-xl bg-content/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-primary-500" />
                    <p className="text-sm font-medium">Force Type</p>
                  </div>
                  <p className="text-foreground/80">{exercise.details.force}</p>
                </div>
                <div className="px-4 py-3 rounded-xl bg-content/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Dumbbell className="w-4 h-4 text-primary-500" />
                    <p className="text-sm font-medium">Equipment</p>
                  </div>
                  <p className="text-foreground/80">{exercise.details.equipment}</p>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};


// Main WorkoutPlans Component
export default function WorkoutPlans() {
  const navigate = useNavigate();
  const { loading, error, client, plans, references, refreshData } = useClientData();
  const { activePlan, completedPlans, currentDay } = usePlans(plans ?? []);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [selectedPlan, setSelectedPlan] = useState<'active' | 'history'>('active');
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<{
    ref: string;
    details: ExerciseReference;
    sets: number;
    reps: number;
    rest: number;
    bestWeight: number;
    bestReps: number;
    isLogged: boolean;
  } | null>(null);

  // Helper functions
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
    if (!client) return;
    
    const dayKey = `day_${selectedDay}`;
    await logPerformance(
      client.name,
      exerciseRef,
      weight,
      reps,
      dayKey
    );
    await refreshData();
  };

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
          <h3 className="text-xl font-semibold text-danger">Error Loading Plans</h3>
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

  const currentPlan = selectedPlan === 'active' ? activePlan : completedPlans[0];
  if (!currentPlan) return null;

  const dayKey = `day_${selectedDay}`;
  const exercises = currentPlan?.days[dayKey]?.exercises ?? [];
  const dayProgress = isPlanDayCompleted(currentPlan.days[dayKey]);
  const planProgress = calculatePlanProgress(currentPlan);

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] 
          bg-gradient-to-b from-primary-500/20 via-secondary-500/20 to-transparent 
          blur-3xl opacity-50" 
        />
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      <div className="container mx-auto p-4 space-y-6">
        {/* Header Section with Plan Selection */}
        <GlassCard gradient="from-primary-500/10 via-background to-secondary-500/10">
          <div className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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

            <Tabs 
              selectedKey={selectedPlan} 
              onSelectionChange={(key) => setSelectedPlan(key as 'active' | 'history')}
              aria-label="Plan selection"
              classNames={{
                tabList: "gap-4 w-full relative rounded-lg p-1 bg-content/5",
                cursor: "bg-primary-500/20 rounded-lg",
                tab: "rounded-lg px-4 py-2 text-sm font-medium",
                tabContent: "group-data-[selected=true]:text-primary-500"
              }}
            >
              <Tab 
                key="active" 
                title={
                  <div className="flex items-center gap-2">
                    <Zap size={16} />
                    <span>Current Plan</span>
                    {activePlan && (
                      <Chip size="sm" variant="flat" color="success">
                        {Math.round(planProgress)}%
                      </Chip>
                    )}
                  </div>
                }
              />
              <Tab 
                key="history" 
                title={
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>History</span>
                    {completedPlans.length > 0 && (
                      <Chip size="sm" variant="flat">
                        {completedPlans.length} plan{completedPlans.length !== 1 ? 's' : ''}
                      </Chip>
                    )}
                  </div>
                }
                isDisabled={completedPlans.length === 0}
              />
            </Tabs>
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
                  {dayProgress 
                    ? 'All exercises completed' 
                    : 'Complete all exercises to finish your workout'
                  }
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
                  isPlanActive={selectedPlan === 'active'}
                  exerciseDay={dayKey}
                  onDetailsClick={() => {
                    setSelectedExercise({
                      ref: exercise.exercise.ref,
                      details: references.exercises[exercise.exercise.ref],
                      sets: exercise.exercise.sets,
                      reps: exercise.exercise.reps,
                      rest: exercise.exercise.rest,
                      bestWeight: getBestWeight(exercise.exercise.ref),
                      bestReps: getBestReps(exercise.exercise.ref),
                      isLogged: exercise.exercise.logged === 1
                    });
                    setShowDetailsModal(true);
                  }}
                  onLogClick={() => {
                    setSelectedExercise({
                      ref: exercise.exercise.ref,
                      details: references.exercises[exercise.exercise.ref],
                      sets: exercise.exercise.sets,
                      reps: exercise.exercise.reps,
                      rest: exercise.exercise.rest,
                      bestWeight: getBestWeight(exercise.exercise.ref),
                      bestReps: getBestReps(exercise.exercise.ref),
                      isLogged: exercise.exercise.logged === 1
                    });
                    setShowPerformanceModal(true);
                  }}
                />
              ) : (
                <SupersetCard
    exercises={exercise.exercises}
    details={references.exercises}
    performanceData={references.performance}
    onLogPerformance={handleLogPerformance}
    isPlanActive={selectedPlan === 'active'}
    exerciseDay={dayKey}
    onDetailsClick={(exerciseRef) => {
      const exerciseDetails = references.exercises[exerciseRef];
      setSelectedExercise({
        ref: exerciseRef,
        details: exerciseDetails,
        sets: exercise.exercises.find(e => e.ref === exerciseRef)?.sets || 0,
        reps: exercise.exercises.find(e => e.ref === exerciseRef)?.reps || 0,
        rest: exercise.exercises.find(e => e.ref === exerciseRef)?.rest || 0,
        bestWeight: getBestWeight(exerciseRef),
        bestReps: getBestReps(exerciseRef),
        isLogged: exercise.exercises.find(e => e.ref === exerciseRef)?.logged === 1
      });
      setShowDetailsModal(true);
    }}
  />
              )}
            </motion.div>
          ))}
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
      onSubmit={(weight, reps) => 
        handleLogPerformance(selectedExercise.ref, weight, reps)
      }
      exerciseName={selectedExercise.ref}
      previousBest={{
        weight: selectedExercise.bestWeight,
        reps: selectedExercise.bestReps
      }}
    />
  )}

  {showDetailsModal && selectedExercise && (
    <ExerciseDetailsModal
      isOpen={showDetailsModal}
      onClose={() => {
        setShowDetailsModal(false);
        setSelectedExercise(null);
      }}
      exercise={selectedExercise}
    />
  )}
</AnimatePresence>
    </div>
  );
}