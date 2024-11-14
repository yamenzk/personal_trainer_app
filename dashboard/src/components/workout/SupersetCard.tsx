import { Card, Image, Chip, Button } from "@nextui-org/react";
import { 
  Zap, 
  Dumbbell, 
  CheckCircle2, 
  Flame,
  Target,
  Brain,
  Wind,
  Timer,
  ActivitySquare,
  ArrowDownUp,
  AlertTriangle,
  RefreshCcw
} from "lucide-react";
import { ExerciseBase, ExerciseReference } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { useSafeImageLoading } from '@/hooks/useSafeImageLoading';

interface SupersetCardProps {
  exercises: ExerciseBase[];
  references: { [key: string]: ExerciseReference };
  onLogPerformance: (exerciseRef: string, weight: number, reps: number) => Promise<void>;
  onViewDetails: (exerciseRef: string) => void;
  selectedPlan: 'active' | 'history';
  exerciseNumber?: number;
  isChangingPlan?: boolean;
}

const ExerciseImageWithFallback: React.FC<{
  src: string;
  alt: string;
  onLoad?: () => void;
  className?: string;
}> = React.memo(({ src, alt, onLoad, className }) => {
  const { isLoading, error, retry } = useSafeImageLoading(src, onLoad);

  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-content2/20 backdrop-blur-sm flex items-center justify-center">
        <motion.div 
          className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 bg-content2/20 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center space-y-2 p-4">
          <AlertTriangle className="w-8 h-8 text-warning mx-auto" />
          <p className="text-sm text-warning/90">Failed to load image</p>
          <Button
            size="sm"
            variant="flat"
            color="warning"
            onPress={retry}
            startContent={<RefreshCcw className="w-4 h-4" />}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Image
      removeWrapper
      alt={alt}
      className={cn(
        "z-0 w-full h-full object-cover transition-transform duration-500",
        className
      )}
      src={src}
      loading="lazy"
    />
  );
});

ExerciseImageWithFallback.displayName = 'ExerciseImageWithFallback';

const supersetTips = [
  {
    icon: Flame,
    title: "Maximum Burn 🔥",
    message: "Keep rest minimal between exercises. Your heart should be pumping!",
    color: "warning",
  },
  {
    icon: Brain,
    title: "Mind Your Form 🎯",
    message: "Even when fatigued, maintain proper form. Quality over speed!",
    color: "primary",
  },
  {
    icon: Wind,
    title: "Breathing Pattern 💨",
    message: "Control your breath between exercises. Quick reset, then straight to the next one!",
    color: "secondary",
  },
  {
    icon: Timer,
    title: "Timing is Key ⚡",
    message: "Smooth transitions between exercises keep the intensity high!",
    color: "success",
  },
  {
    icon: ActivitySquare,
    title: "Energy Management 🔋",
    message: "Pace yourself through all exercises. It's a marathon, not a sprint!",
    color: "primary",
  }
];

const getTitleByCount = (count: number): string => {
  const twoExerciseTitles = [
    "Dynamic Duo Activated 🤜🤛",
    "Double Trouble Time 💪💪",
    "Power Pair Ready 🎯🎯",
    "2x Combo Loaded ⚡️",
    "Tag Team Action 🤝",
  ];

  const threeExerciseTitles = [
    "Triple Threat Loading 🎯🎯🎯",
    "Three-Way Power Up ⚡️⚡️⚡️",
    "Trinity Mode Activated 🔱",
    "Triple Impact Ready 💥💥💥",
    "3-Step Destroyer 🔥🔥🔥",
  ];

  const titles = count === 2 ? twoExerciseTitles : threeExerciseTitles;
  return titles[Math.floor(Math.random() * titles.length)];
};

interface ExerciseItemProps {
  exercise: ExerciseBase;
  index: number;
  reference: ExerciseReference;
  onViewDetails: (exerciseRef: string) => void;
  isChangingPlan?: boolean;
}

const ExerciseItem = React.memo(({ 
  exercise, 
  index,
  reference,
  onViewDetails,
  isChangingPlan 
}: { 
  exercise: ExerciseBase; 
  index: number;
  reference: ExerciseReference;
  onViewDetails: (exerciseRef: string) => void;
  isChangingPlan?: boolean;
}) => {
  const isMounted = useRef(true);
  const imageUrl = useMemo(() => 
    reference.thumbnail || reference.starting,
    [reference]
  );

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleClick = useCallback(() => {
    if (!isChangingPlan && isMounted.current) {
      onViewDetails(exercise.ref);
    }
  }, [isChangingPlan, onViewDetails, exercise.ref]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card 
        isPressable
        onPress={handleClick}
        className="relative overflow-hidden border-none h-[300px] group"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 z-10" />
          <ExerciseImageWithFallback
            src={imageUrl}
            alt={`Exercise ${exercise.ref}`}
            className="group-hover:scale-110"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 p-4 h-full flex flex-col justify-between">
          <div>
            <motion.p 
              className="text-tiny text-white/80 uppercase font-bold tracking-wide"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {reference.primary_muscle}
            </motion.p>
            <motion.h4 
              className="text-white text-xl font-semibold"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {exercise.ref}
            </motion.h4>
          </div>

          <div className="flex items-center justify-between">
            <Chip
              size="sm"
              className="border-2 border-primary-500 bg-primary-500/30 backdrop-blur-md text-white font-medium"
              startContent={<Dumbbell size={14} className="text-white" />}
            >
              {exercise.reps}
            </Chip>

            {exercise.logged === 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 rounded-full bg-success-500/20 flex items-center justify-center"
              >
                <CheckCircle2 size={14} className="text-success-500" />
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

ExerciseItem.displayName = 'ExerciseItem';

export const SupersetCard = React.memo(({
  exercises,
  references,
  onLogPerformance,
  onViewDetails,
  selectedPlan,
  exerciseNumber,
  isChangingPlan
}: SupersetCardProps) => {
  const isMounted = useRef(true);
  
  const randomTip = useMemo(() => 
    supersetTips[Math.floor(Math.random() * supersetTips.length)],
    []
  );

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      // Clear any cached resources if needed
    };
  }, []);

  const renderExercisesGrid = useCallback(() => {
    if (exercises.length > 3) {
      return (
        <div className="space-y-4">
          {chunk(exercises, 2).map((batch, batchIndex) => (
            <div key={batchIndex} className="grid grid-cols-2 gap-4">
              {batch.map((exercise) => (
                <ExerciseItem
                  key={exercise.ref}
                  exercise={exercise}
                  index={batchIndex}
                  reference={references[exercise.ref]}
                  onViewDetails={onViewDetails}
                  isChangingPlan={isChangingPlan}
                />
              ))}
            </div>
          ))}
        </div>
      );
    }

    if (exercises.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-4">
          {exercises.map((exercise, index) => (
            <ExerciseItem
              key={exercise.ref}
              exercise={exercise}
              index={index}
              reference={references[exercise.ref]}
              onViewDetails={onViewDetails}
              isChangingPlan={isChangingPlan}
            />
          ))}
        </div>
      );
    }

    if (exercises.length === 3) {
      return (
        <div className="space-y-4">
          <ExerciseItem
            exercise={exercises[0]}
            index={0}
            reference={references[exercises[0].ref]}
            onViewDetails={onViewDetails}
            isChangingPlan={isChangingPlan}
          />

          <div className="grid grid-cols-2 gap-4">
            {exercises.slice(1).map((exercise, index) => (
              <ExerciseItem
                key={exercise.ref}
                exercise={exercise}
                index={index + 1}
                reference={references[exercise.ref]}
                onViewDetails={onViewDetails}
                isChangingPlan={isChangingPlan}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            <motion.div
              className="h-px w-16 bg-warning-500/50"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
            <div className="p-1.5 rounded-full bg-warning-500/20">
              <ArrowDownUp className="w-3 h-3 text-warning-500" />
            </div>
            <motion.div
              className="h-px w-16 bg-warning-500/50"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          </div>
        </div>
      );
    }

    return null;
  }, [exercises, references, onViewDetails, isChangingPlan]);

  return (
    <Card className="w-full bg-background/1 border-none shadow-none">
      <div className="space-y-6">
        {/* Header Section */}
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div 
            className="p-3 rounded-xl bg-warning-500 text-white shadow-lg shadow-warning-500/20"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Zap className="w-5 h-5" />
          </motion.div>
          
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              {exerciseNumber && (
                <span className="text-foreground/80">{exerciseNumber}.</span>
              )}
              {getTitleByCount(exercises.length)}
            </h3>
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <span>Complete all {exercises.length} exercises back to back</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-content/5">
            <Timer className="w-4 h-4 text-primary-500" />
            <span className="text-xs">
              {exercises[0].rest}s rest after
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-content/5">
            <ActivitySquare className="w-4 h-4 text-secondary-500" />
            <span className="text-xs">
              {exercises.length} moves
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-content/5">
            <Target className="w-4 h-4 text-success-500" />
            <span className="text-xs">
              {exercises[0].sets} rounds
            </span>
          </div>
        </div>

        {/* Exercises Grid */}
        <AnimatePresence>
          {renderExercisesGrid()}
        </AnimatePresence>

        {/* Tip Section */}
        <motion.div 
          className={cn(
            "flex items-start gap-3 p-4 rounded-xl",
            `bg-${randomTip.color}-500/5 border border-${randomTip.color}-500/20`
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={cn(
            "p-2 rounded-lg",
            `bg-${randomTip.color}-500 text-white`
          )}>
            <randomTip.icon className="w-4 h-4" />
          </div>
          <div>
            <p className={cn(
              "font-medium",
              `text-${randomTip.color}-500`
            )}>
              {randomTip.title}
            </p>
            <p className="text-sm text-foreground/70 mt-1">
              {randomTip.message}
            </p>
          </div>
        </motion.div>
      </div>
    </Card>
  );
});

SupersetCard.displayName = 'SupersetCard';

// Helper function
const chunk = <T,>(array: T[], size: number): T[][] => {
  return Array.from(
    { length: Math.ceil(array.length / size) },
    (_, i) => array.slice(i * size, i * size + size)
  );
};