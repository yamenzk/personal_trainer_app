import { Card, Image, Chip } from "@nextui-org/react";
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
  ArrowDownUp
} from "lucide-react";
import { ExerciseBase, ExerciseReference } from "@/types";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface SupersetCardProps {
  exercises: ExerciseBase[];
  references: { [key: string]: ExerciseReference };
  onLogPerformance: (exerciseRef: string, weight: number, reps: number) => Promise<void>;
  onViewDetails: (exerciseRef: string) => void;
  selectedPlan: 'active' | 'history';
  exerciseNumber?: number;
}

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
    "Back-to-Back Attack 🔄",
    "Double Impact Mode 💥",
    "Partner Exercise Time 🤸‍♂️",
    "2-Step Crusher 🔥",
    "Double Dragon Mode 🐉",
  ];

  const threeExerciseTitles = [
    "Triple Threat Loading 🎯🎯🎯",
    "Three-Way Power Up ⚡️⚡️⚡️",
    "Trinity Mode Activated 🔱",
    "Triple Impact Ready 💥💥💥",
    "3-Step Destroyer 🔥🔥🔥",
    "Triple Crown Challenge 👑",
    "3-Hit Combo 🎮",
    "Triple Force Active 💪💪💪",
    "Three Peaks Ahead 🏔️",
    "Triple Play Time ⚡️",
  ];

  const titles = count === 2 ? twoExerciseTitles : threeExerciseTitles;
  return titles[Math.floor(Math.random() * titles.length)];
};

export const SupersetCard: React.FC<SupersetCardProps> = ({
  exercises,
  references,
  onViewDetails,
  exerciseNumber
}) => {
  const randomTip = supersetTips[Math.floor(Math.random() * supersetTips.length)];

  const ExerciseItem = ({ exercise, index }: { exercise: ExerciseBase; index: number }) => {
    const exerciseRef = references[exercise.ref];
    if (!exerciseRef) return null;

    return (
      <Card 
        className="relative overflow-hidden border-none h-[300px]"
        isPressable
        onPress={() => onViewDetails(exercise.ref)}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 z-10" />

        {/* Exercise Image */}
        <Image
          removeWrapper
          alt={`Exercise ${exercise.ref}`}
          className="z-0 w-full h-full object-cover"
          src={exerciseRef.thumbnail || exerciseRef.starting}
        />

        {/* Content */}
        <div className="absolute inset-0 z-20 p-4 flex flex-col justify-between">
          <div>
            <p className="text-tiny text-white/80 uppercase font-bold tracking-wide">
              {exerciseRef.primary_muscle}
            </p>
            <h4 className="text-white text-xl font-semibold">
              {exercise.ref}
            </h4>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Chip
                size="sm"
                className="border-2 border-primary-500 bg-primary-500/30 backdrop-blur-md text-white font-medium"
                startContent={<Dumbbell size={14} className="text-white" />}
              >
                {exercise.reps}
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
    );
  };

  const ExercisesGrid = () => {
    if (exercises.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-4">
          {exercises.map((exercise, index) => (
            <motion.div
              key={exercise.ref}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ExerciseItem exercise={exercise} index={index} />
            </motion.div>
          ))}
        </div>
      );
    }

    if (exercises.length === 3) {
      return (
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ExerciseItem exercise={exercises[0]} index={0} />
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ExerciseItem exercise={exercises[1]} index={1} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ExerciseItem exercise={exercises[2]} index={2} />
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-2 -mt-2">
            <motion.div
              className="h-px w-16 bg-warning-500/50"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            />
            <div className="p-1.5 rounded-full bg-warning-500/20">
              <ArrowDownUp className="w-3 h-3 text-warning-500" />
            </div>
            <motion.div
              className="h-px w-16 bg-warning-500/50"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="w-full bg-background/1 border-none" style={{ boxShadow: 'none' }}>
      <div className="space-y-6">
        {/* Header */}
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
              {/* <span>•</span>
              <span className="flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" />
                {exercises[0].rest}s rest
              </span> */}
            </div>
          </div>
        </motion.div>
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
              {exercises[0].sets} rounds (sets)
            </span>
          </div>
        </div>
        {/* Exercises Grid */}
        <ExercisesGrid />

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

        {/* Quick Stats */}
        
      </div>
    </Card>
  );
};