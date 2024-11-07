import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalContent,
  Card,
  CardHeader,
  Image,
  CardFooter,
  cn,
  Skeleton,
  Tab,
  Tabs,
  Progress,
} from "@nextui-org/react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  Dumbbell,
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  ChevronLeft,
  ChevronRight,
  Heart,
  Zap,
  Flame,
  Scale,
  AlertTriangle,
  Info,
  Repeat,
  Activity,
  Battery,
  Coffee,
  Moon,
  ScrollText,
  Trophy,
  ArrowUp,
  Pause,
  X,
  Play,
  Video,
  TrendingUp,
  Medal,
  CheckCircle,
  ChevronDown,
  History,
  ChevronUp,
  Timer,
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useClientData } from '../hooks/useClientData';
import { usePlans } from '../hooks/usePlans';
import { logPerformance, isPlanDayCompleted } from '../utils/api';
import { ExerciseBase, ExerciseReference } from '@/types/workout';
import { GlassCard } from '@/components/shared/GlassCard';
import { calculatePlanProgress } from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Helper Components
interface ExercisePerformance {
  weight: number;
  reps: number;
  date: string;
}

interface ExerciseCardProps {
  exercise: ExerciseBase;
  references: { [key: string]: ExerciseReference };
  performance?: { [key: string]: ExercisePerformance[] };
  isLogged?: boolean;
  isSuperset?: boolean;
  onLogSet?: () => void;
  onViewDetails: () => void;
  selectedPlan: 'active' | 'history';
  exerciseNumber?: number;
}

interface WeekDayButtonProps {
  day: number;
  date: Date;
  isSelected: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  onClick: () => void;
  hasWorkout?: boolean;
}

export const WeekDayButton = ({
  date,
  isSelected,
  isCompleted,
  isCurrent,
  onClick,
  hasWorkout = false
}: WeekDayButtonProps) => {
  return (
    <button
      onClick={onClick}

    >
      <div className="space-y-2">
        {/* Date Header */}
        <div className="flex flex-col items-center">
          <span className={cn(
            "text-xs text-foreground/60",
            isCurrent && "text-primary-500"
          )}>
            {format(date, 'EEEE')}
          </span>
          <span className={cn(
            "text-2xl font-bold",
            isCurrent && "text-primary-500"
          )}>
            {format(date, 'd')}
          </span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-1">
          {hasWorkout ? (
            <div className={cn(
              "p-1.5 rounded-lg",
              isSelected
                ? "bg-primary-500"
                : isCompleted
                  ? "bg-success-500"
                  : "bg-content/20"
            )}>
              <Dumbbell
                size={14}
                className={cn(
                  isSelected || isCompleted ? "text-white" : "text-foreground/40"
                )}
              />
            </div>
          ) : (
            <div className="p-1.5 rounded-lg bg-content/10">
              <Moon size={14} className="text-foreground/40" />
            </div>
          )}
        </div>
      </div>
    </button>
  );
};


const RestDayCard = () => {
  const { theme } = useTheme();  // Move the hook inside the component

  return (
    <Card
      className="p-6 space-y-4 mt-6 bg-background/1"
      style={{ border: '0' }}
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
    </Card>
  );
};

const ExerciseCard = ({
  exercise,
  references,
  performance,
  isLogged = false,
  isSuperset = false,
  onLogSet,
  onViewDetails,
  selectedPlan,
  exerciseNumber
}: ExerciseCardProps) => {
  const details = references[exercise.ref];
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Get performance data for this exercise
  const exercisePerformance = performance?.[exercise.ref] || [];

  // Calculate personal best
  const personalBest = exercisePerformance.reduce((best, current) => {
    // You could modify this logic based on how you want to determine "best"
    // Currently using weight as the primary metric
    if (!best || current.weight > best.weight) {
      return current;
    }
    return best;
  }, null as ExercisePerformance | null);

  // Get last performance (most recent)
  const lastPerformance = exercisePerformance.length > 0
    ? exercisePerformance[exercisePerformance.length - 1]
    : null;

  return (
    <Card
      isFooterBlurred
      className={cn(
        "w-full h-[300px] col-span-12 sm:col-span-5",
        "transition-all duration-300 hover:shadow-lg border-none",
        isHovered && "scale-[1.02]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      isPressable
      onPress={onViewDetails}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 z-10" />

      <CardHeader className="absolute z-20 top-1 flex-col items-start">
        <p className="text-tiny text-white uppercase font-bold tracking-wide">
          {details.primary_muscle}
        </p>
        <h3 className="font-semibold text-2xl text-white">
          {!isSuperset && exerciseNumber && (
            <span className="text-white/80">{exerciseNumber}.</span>
          )}
          {exercise.ref}
        </h3>
      </CardHeader>

      <div className="relative w-full h-full">
        {isImageLoading && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-lg">
            <div className="w-full h-full bg-default-300"></div>
          </Skeleton>
        )}

        <Image
          removeWrapper
          alt="Card example background"
          className={cn(
            "z-0 w-full h-full scale-125 -translate-y-6 object-cover",
            "transition-opacity duration-300",
            isImageLoading ? "opacity-0" : "opacity-100"
          )}
          src={details.thumbnail || details.starting}
          onLoad={() => setIsImageLoading(false)}
        />
      </div>

      <CardFooter
        className={cn(
          "absolute bottom-0 z-20 border-t-1 border-zinc-100/50",
          "justify-between flex-wrap gap-2",
          "bg-black/60 backdrop-blur-md"
        )}
      >
        <div className="flex flex-wrap gap-2">
          <Chip
            size="sm"
            className={cn(
              "border-2 border-primary-500",
              "bg-primary-500/30 backdrop-blur-md",
              "text-white font-medium"
            )}
            startContent={<Dumbbell size={14} className="text-white" />}
          >
            {exercise.sets} × {exercise.reps}
          </Chip>

          <Chip
            size="sm"
            className={cn(
              "border-2 border-secondary-500",
              "bg-secondary-500/30 backdrop-blur-md",
              "text-white font-medium"
            )}
            startContent={<Clock size={14} className="text-white" />}
          >
            {exercise.rest}s rest
          </Chip>

          {personalBest && (
            <Chip
              size="sm"
              className={cn(
                "border-2 border-warning-500",
                "bg-warning-500/30 backdrop-blur-md",
                "text-white font-medium"
              )}
              startContent={<Trophy size={14} className="text-white" />}
            >
              PB: {personalBest.weight}kg × {personalBest.reps}
            </Chip>
          )}

          {lastPerformance && lastPerformance !== personalBest && (
            <Chip
              size="sm"
              className={cn(
                "border-2 border-success-500",
                "bg-success-500/30 backdrop-blur-md",
                "text-white font-medium"
              )}
              startContent={<ArrowUp size={14} className="text-white" />}
            >
              Last: {lastPerformance.weight}kg × {lastPerformance.reps}
            </Chip>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isLogged && !isSuperset && selectedPlan === 'active' && (
            <Button
              className={cn(
                "bg-primary-500 text-white",
                "shadow-lg shadow-primary-500/20",
                "hover:bg-primary-600"
              )}
              radius="full"
              size="sm"
              startContent={<Zap size={14} />}
              onPress={onLogSet}
            >
              Log Set
            </Button>
          )}
          {isLogged && (
            <CheckCircle2 className="w-4 h-4 text-success-500" />
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

const SupersetCard = ({
  exercises,
  references,
  onViewDetails,
  exerciseNumber
}: {
  exercises: ExerciseBase[];
  references: { [key: string]: ExerciseReference };
  onLogPerformance: (exerciseRef: string, weight: number, reps: number) => Promise<void>;
  onViewDetails: (exerciseRef: string) => void;
  selectedPlan: 'active' | 'history';
  exerciseNumber?: number;
}) => {
  return (
    <Card className="w-full bg-background/1  border-none"
      style={{ boxShadow: 'none' }}
    >
      <div className="p-6 space-y-6">
        {/* Superset Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-warning-500 text-white shadow-lg shadow-warning-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              {exerciseNumber && (
                <span className="text-foreground/80">{exerciseNumber}.</span>
              )}
              Superset
            </h3>
            <p className="text-sm text-foreground/60">
              Complete these {exercises.length} exercises back to back
            </p>
          </div>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-2 gap-4">
          {exercises.map((exercise, index) => (
            <div key={exercise.ref} className="relative">
              <Card
                isPressable
                onPress={() => onViewDetails(exercise.ref)}
                className="w-full h-[300px] relative overflow-hidden border-none"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 z-10" />

                {/* Exercise Image */}
                <Image
                  removeWrapper
                  alt={`Exercise ${exercise.ref}`}
                  className="z-0 w-full h-full object-cover"
                  src={references[exercise.ref].thumbnail || references[exercise.ref].starting}
                />

                {/* Content */}
                <div className="absolute inset-0 z-20 p-4 flex flex-col justify-between">
                  {/* Header */}
                  <div>
                    <p className="text-tiny text-white/80 uppercase font-bold tracking-wide">
                      {references[exercise.ref].primary_muscle}
                    </p>
                    <h4 className="text-white text-xl font-semibold">
                      {exercise.ref}
                    </h4>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Chip
                        size="sm"
                        className="border-2 border-primary-500 bg-primary-500/30 backdrop-blur-md text-white font-medium"
                        startContent={<Dumbbell size={14} className="text-white" />}
                      >
                        {exercise.sets} × {exercise.reps}
                      </Chip>
                      <Chip
                        size="sm"
                        className="border-2 border-secondary-500 bg-secondary-500/30 backdrop-blur-md text-white font-medium"
                        startContent={<Clock size={14} className="text-white" />}
                      >
                        {exercise.rest}s
                      </Chip>
                    </div>
                    {exercise.logged === 1 && (
                      <div className="w-6 h-6 rounded-full bg-success-500/20 flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-success-500" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-warning-500/5 border border-warning-500/20">
          <div className="p-2 rounded-lg bg-warning-500 text-white">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium text-warning-500">Superset Tips</p>
            <p className="text-sm text-foreground/70 mt-1">
              Minimize rest between exercises for maximum intensity. Complete all exercises before taking your {exercises[0].rest}s rest.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};


interface ExerciseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: ExerciseBase;
  details: ExerciseReference;
  isLogged: boolean;
  performance?: {
    weight: number;
    reps: number;
    date: string;
  }[];
}

const ExerciseDetailsModal = ({
  isOpen,
  onClose,
  exercise,
  details,
  isLogged,
  performance,
}: ExerciseDetailsModalProps) => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [imageIndex, setImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const images = [
    {
      url: details.starting,
      label: "Starting Position",
    },
    {
      url: details.ending,
      label: "Ending Position",
    },
  ];

  // Auto-advance images
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setImageIndex((prev) => (prev === 0 ? 1 : 0));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Auto-start playing when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
    }
    return () => setIsPlaying(false);
  }, [isOpen]);

  // Prepare performance data for the chart
  const chartData = useMemo(() => {
    if (!performance) return [];
    return [...performance]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(p => ({
        date: p.date,
        weight: p.weight,
        reps: p.reps,
      }));
  }, [performance]);

  const QuickStatChip = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <Chip
      startContent={<Icon size={14} />}
      className="bg-content/10 h-auto py-2"
      size="sm"
    >
      <div className="flex flex-col items-start">
        <span className="text-xs text-foreground/60">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
    </Chip>
  );

  // Available tabs
  const tabs = [
    {
      key: "overview",
      icon: Info,
      label: "Overview",
    },
    {
      key: "performance",
      icon: Activity,
      label: "Performance",
    },
    // Only show video tab if video URL exists
    ...(details.video ? [{
      key: "video",
      icon: Video,
      label: "Video",
    }] : []),
  ];

  return (
    <Modal
      size="full"
      radius="lg"
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      className="bg-background/98 dark:bg-background/95"
      classNames={{
        backdrop: "bg-[#000000]/80 backdrop-blur-md",
        base: "h-[100dvh] max-h-[100dvh]",
      }}
      scrollBehavior="inside"
    >
      <ModalContent>
        <div className="flex flex-col h-[100dvh]">
          {/* Fixed Header/Navigation */}
          <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-content/10">
            <div className="px-4 py-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold truncate">{exercise.ref}</h2>
                <p className="text-sm text-foreground/60">{details.primary_muscle}</p>
              </div>
              <Button
                isIconOnly
                variant="light"
                onPress={onClose}
                className="min-w-unit-8 w-unit-8 h-unit-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="px-4">
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key.toString())}
                color="primary"
                variant="underlined"
                classNames={{
                  tabList: "gap-6",
                  cursor: "w-full bg-primary-500",
                  tab: "max-w-fit px-2 h-12",
                  tabContent: "group-data-[selected=true]:text-primary",
                }}
              >
                {tabs.map(({ key, icon: Icon, label }) => (
                  <Tab
                    key={key}
                    title={
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{label}</span>
                      </div>
                    }
                  />
                ))}
              </Tabs>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {selectedTab === "overview" && (
              <div className="space-y-6">
                {/* Image Section - Adjusted for full visibility */}
                <div className="relative bg-black">
                  <img
                    src={images[imageIndex].url}
                    alt={images[imageIndex].label}
                    className="w-full h-auto object-contain mx-auto"
                    style={{ maxHeight: "40vh" }}
                  />

                  {/* Image Controls */}
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-background/10 backdrop-blur-md"
                          onPress={() => setImageIndex((prev) => (prev === 0 ? 1 : 0))}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-background/10 backdrop-blur-md"
                          onPress={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          className="bg-background/10 backdrop-blur-md"
                          onPress={() => setImageIndex((prev) => (prev === 1 ? 0 : 1))}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                      <span className="text-sm text-white/90 bg-background/30 px-3 py-1 rounded-full backdrop-blur-sm">
                        {images[imageIndex].label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-6">
                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <QuickStatChip
                      icon={Dumbbell}
                      label="Equipment"
                      value={details.equipment || "Bodyweight"}
                    />
                    <QuickStatChip
                      icon={Target}
                      label="Force Type"
                      value={details.force}
                    />
                    <QuickStatChip
                      icon={Clock}
                      label="Rest"
                      value={`${exercise.rest}s`}
                    />
                    <QuickStatChip
                      icon={Activity}
                      label="Type"
                      value={details.mechanic || "Compound"}
                    />
                  </div>

                  {/* Instructions */}
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      <ScrollText className="w-5 h-5 text-primary-500" />
                      Instructions
                    </h4>
                    <Card className="p-4">
                      <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
                        {details.instructions}
                      </p>
                    </Card>
                  </div>

                  {/* Muscles Grid */}
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      <Flame className="w-5 h-5 text-primary-500" />
                      Muscles Worked
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Chip
                        className="bg-warning-500/10 text-warning-500 h-auto py-2"
                        startContent={<Target size={14} />}
                      >
                        <div className="flex flex-col items-start">
                          <span className="text-xs">Primary</span>
                          <span className="font-medium">{details.primary_muscle}</span>
                        </div>
                      </Chip>
                      {details.secondary_muscles?.map((muscle, index) => (
                        <Chip
                          key={index}
                          className="bg-content/10 h-auto py-2"
                          startContent={<Activity size={14} />}
                        >
                          <div className="flex flex-col items-start">
                            <span className="text-xs text-foreground/60">Secondary</span>
                            <span className="font-medium">{muscle.muscle}</span>
                          </div>
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === "performance" && (
              <div className="p-4 space-y-6">
                {performance && performance.length > 0 ? (
                  <>
                    {/* Performance Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4 bg-primary-500/10 border-none">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary-500">
                            <Trophy className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-foreground/60">Personal Best</p>
                            <p className="text-2xl font-bold">
                              {Math.max(...performance.map(p => p.weight))} kg
                            </p>
                            <p className="text-xs text-foreground/60">
                              {performance.find(p => p.weight === Math.max(...performance.map(p => p.weight)))?.date}
                            </p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 bg-secondary-500/10 border-none">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-secondary-500">
                            <Medal className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-foreground/60">Most Reps</p>
                            <p className="text-2xl font-bold">
                              {Math.max(...performance.map(p => p.reps))}
                            </p>
                            <p className="text-xs text-foreground/60">
                              {performance.find(p => p.reps === Math.max(...performance.map(p => p.reps)))?.date}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Performance Chart */}
                    <Card className="p-4 border-none">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-500" />
                        Progress Chart
                      </h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <XAxis
                              dataKey="date"
                              stroke="#888888"
                              fontSize={12}
                              tickFormatter={(value) => new Date(value).toLocaleDateString()}
                            />
                            <YAxis
                              stroke="#888888"
                              fontSize={12}
                              label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-background/95 backdrop-blur-md p-2 rounded-lg border border-content/10">
                                      <p className="text-sm">{new Date(label).toLocaleDateString()}</p>
                                      <p className="text-sm font-medium text-primary-500">
                                        {payload[0].value} kg × {payload[0].payload.reps} reps
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="weight"
                              stroke="#7828c8"
                              strokeWidth={2}
                              dot={{ fill: "#7828c8", strokeWidth: 2 }}
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    {/* Recent History */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold">Recent History</h4>
                      <div className="space-y-2">
                        {[...performance].reverse().slice(0, 5).map((perf, index) => (
                          <Card
                            key={index}
                            className="bg-content/5 border-none"
                          >
                            <div className="p-3 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary-500/10">
                                  <Dumbbell className="w-4 h-4 text-primary-500" />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {perf.weight} kg × {perf.reps} reps
                                  </p>
                                  <p className="text-sm text-foreground/60">
                                    {new Date(perf.date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              {index === 0 && (
                                <Chip
                                  size="sm"
                                  className="bg-success-500/10 text-success-500"
                                  startContent={<Activity size={14} />}
                                >
                                  Latest
                                </Chip>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 rounded-full bg-primary-500/10 mb-4">
                      <Activity className="w-8 h-8 text-primary-500" />
                    </div>
                    <p className="text-lg font-semibold">No Performance Data</p>
                    <p className="text-foreground/60 mt-2">
                      Start logging your sets to track your progress
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedTab === "video" && details.video && (
              <div className="p-4 space-y-6">
                <Card className="w-full aspect-video overflow-hidden border-none">
                  <iframe
                    className="w-full h-full"
                    src={details.video}
                    title={`${exercise.ref} demonstration`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </Card>

                <Card className="p-4 bg-warning-500/10 border-none">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-warning-500">Video Guide</p>
                      <p className="text-sm text-foreground/70 mt-1">
                        Watch the demonstration video to learn proper form and technique.
                        Pay attention to movement patterns and key positions.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Quick Reference */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold">Quick Reference</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="p-4 border-none">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-success-500/10">
                          <Target className="w-4 h-4 text-success-500" />
                        </div>
                        <div>
                          <p className="font-medium">Key Points</p>
                          <ul className="text-sm text-foreground/70 mt-2 space-y-1 list-disc list-inside">
                            <li>Maintain proper form throughout</li>
                            <li>Control the movement</li>
                            <li>Focus on muscle engagement</li>
                            <li>Keep proper breathing pattern</li>
                          </ul>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 border-none">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-danger-500/10">
                          <AlertTriangle className="w-4 h-4 text-danger-500" />
                        </div>
                        <div>
                          <p className="font-medium">Common Mistakes</p>
                          <ul className="text-sm text-foreground/70 mt-2 space-y-1 list-disc list-inside">
                            <li>Using momentum</li>
                            <li>Incorrect positioning</li>
                            <li>Going too heavy too soon</li>
                            <li>Rushing the movement</li>
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};


interface PerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (weight: number, reps: number) => Promise<void>;
  exerciseName: string;
  targetReps: number;
  previousPerformance?: {
    weight: number;
    reps: number;
    date: string;
  }[];
}

const PerformanceModal = ({
  isOpen,
  onClose,
  onSubmit,
  exerciseName,
  targetReps,
  previousPerformance = [],
}: PerformanceModalProps) => {
  const [weight, setWeight] = useState<string>("");
  const [actualReps, setActualReps] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPrevious, setShowPrevious] = useState(true);

  // Calculate previous bests
  const personalBest = previousPerformance.reduce(
    (best, current) => {
      if (current.weight > best.weight) {
        return current;
      }
      if (current.weight === best.weight && current.reps > best.reps) {
        return current;
      }
      return best;
    },
    { weight: 0, reps: 0, date: "" }
  );

  const lastPerformance = previousPerformance[previousPerformance.length - 1];

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setWeight(lastPerformance ? lastPerformance.weight.toString() : "");
      setActualReps(targetReps.toString());
      setError("");
      setShowPrevious(true);
    }
  }, [isOpen, lastPerformance, targetReps]);

  const handleSubmit = async () => {
    if (!weight || !actualReps) {
      setError("Please enter both weight and reps");
      return;
    }

    const weightNum = parseFloat(weight);
    const repsNum = parseInt(actualReps);

    if (isNaN(weightNum) || weightNum <= 0) {
      setError("Please enter a valid weight");
      return;
    }

    if (isNaN(repsNum) || repsNum <= 0) {
      setError("Please enter valid reps");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSubmit(weightNum, repsNum);
      onClose();
    } catch (err) {
      setError("Failed to log performance");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickIncrement = (type: 'weight' | 'reps', amount: number) => {
    if (type === 'weight') {
      const currentWeight = parseFloat(weight) || 0;
      setWeight((currentWeight + amount).toString());
    } else {
      const currentReps = parseInt(actualReps) || 0;
      setActualReps((currentReps + amount).toString());
    }
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return "success";
    if (percentage >= 80) return "primary";
    if (percentage >= 50) return "warning";
    return "danger";
  };

  return (
    <Modal
      size="2xl"
      radius="lg"
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      className="bg-background/98"
      classNames={{
        backdrop: "bg-[#000000]/80 backdrop-blur-md",
      }}
    >
      <ModalContent>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">{exerciseName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground/60">
                  Target: {targetReps} reps
                </span>
              </div>
            </div>
            <Button
              isIconOnly
              variant="light"
              onPress={onClose}
            >
              <AlertTriangle className="w-4 h-4" />
            </Button>
          </div>

          {/* Previous Performance Section */}
          {previousPerformance.length > 0 && (
            <div className={cn(
              "space-y-4 overflow-hidden transition-all duration-300",
              showPrevious ? "max-h-80" : "max-h-0"
            )}>
              <div className="grid grid-cols-2 gap-4">
                {/* Personal Best Card */}
                <div className="p-4 rounded-xl bg-primary-500/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-medium">Personal Best</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {personalBest.weight} kg × {personalBest.reps}
                  </div>
                  <div className="text-xs text-foreground/60">
                    {new Date(personalBest.date).toLocaleDateString()}
                  </div>
                </div>

                {/* Last Performance Card */}
                <div className="p-4 rounded-xl bg-secondary-500/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-secondary-500" />
                    <span className="text-sm font-medium">Last Performance</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {lastPerformance.weight} kg × {lastPerformance.reps}
                  </div>
                  <div className="text-xs text-foreground/60">
                    {new Date(lastPerformance.date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/60">Weight Progress</span>
                    <span className="text-sm font-medium">
                      {((parseFloat(weight) / personalBest.weight) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress
                    value={(parseFloat(weight) / personalBest.weight) * 100}
                    color={getProgressColor(parseFloat(weight), personalBest.weight)}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/60">Reps Progress</span>
                    <span className="text-sm font-medium">
                      {((parseInt(actualReps) / targetReps) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress
                    value={(parseInt(actualReps) / targetReps) * 100}
                    color={getProgressColor(parseInt(actualReps), targetReps)}
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Toggle Previous Performance */}
          {previousPerformance.length > 0 && (
            <Button
              variant="light"
              onPress={() => setShowPrevious(!showPrevious)}
              className="w-full"
              endContent={showPrevious ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            >
              {showPrevious ? "Hide" : "Show"} Previous Performance
            </Button>
          )}

          {/* Input Section */}
          <div className="space-y-4">
            {/* Weight Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Scale className="w-4 h-4 text-primary" />
                <label className="text-sm font-medium">Weight (kg)</label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={weight}
                  onValueChange={setWeight}
                  placeholder="Enter weight"
                  className="flex-1"
                  classNames={{
                    input: "text-lg",
                  }}
                  min={0}
                  startContent={
                    <Dumbbell className="w-4 h-4 text-default-400" />
                  }
                />
                <div className="flex flex-col gap-1">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    onPress={() => handleQuickIncrement('weight', 2.5)}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    onPress={() => handleQuickIncrement('weight', -2.5)}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Reps Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Repeat className="w-4 h-4 text-primary" />
                <label className="text-sm font-medium">Reps</label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={actualReps}
                  onValueChange={setActualReps}
                  placeholder="Enter reps"
                  className="flex-1"
                  classNames={{
                    input: "text-lg",
                  }}
                  min={0}
                  startContent={
                    <Timer className="w-4 h-4 text-default-400" />
                  }
                />
                <div className="flex flex-col gap-1">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    onPress={() => handleQuickIncrement('reps', 1)}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    onPress={() => handleQuickIncrement('reps', -1)}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-danger-500/10 text-danger">
              <AlertTriangle className="w-4 h-4" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="bordered"
              onPress={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              className="flex-1"
              onPress={handleSubmit}
              isLoading={loading}
              startContent={!loading && <CheckCircle className="w-4 h-4" />}
            >
              Log Performance
            </Button>
          </div>
        </div>
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
      <Card
        className="bg-primary/1"
        style={{ boxShadow: "none" }}
      >
        <span className="text-sm">
          {getPlanDateRange(plans[selectedPlanIndex])}
        </span>
      </Card>
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
        variant="frosted"
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
            <Card className="flex shrink gap-2 p-1 bg-white/10 rounded-xl flex-row">
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
            </Card>
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
                      className="flex-none"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      <Card

                        className={cn(
                          "cursor-pointer transition-all duration-300 h-full",
                          "hover:scale-[1.02] active:scale-[0.98]",
                          isCompleted && selectedDay !== day && "bg-success-500/20 border-success-500/20",
                          selectedDay === day && "bg-primary/50 shadow-md shadow-primary-500/20",
                          !isCompleted && selectedDay !== day && "bg-secondary-500/20"
                        )}
                        isPressable
                        onPress={() => onDaySelect(day)}
                      >
                        <div className="py-4 px-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={cn(
                              "text-sm",
                              "text-foreground/60"
                            )}>
                              {format(date, 'EEE')}
                            </span>
                            <span className={cn(
                              "text-2xl font-bold",
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
                            ))}
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
                      </Card>
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