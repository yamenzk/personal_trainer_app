import { Card, CardFooter, Chip, Button, Image, Skeleton } from "@nextui-org/react";
import { 
  Dumbbell, 
  Clock, 
  Trophy, 
  CheckCircle2, 
  Zap, 
  History,
  ArrowUpRight,
  Target,
  BarChart,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { ExerciseBase, ExerciseReference } from "@/types/workout";

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

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  references,
  performance,
  isLogged = false,
  isSuperset = false,
  onLogSet,
  onViewDetails,
  selectedPlan,
  exerciseNumber
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const details = references[exercise.ref];
  const exercisePerformance = performance?.[exercise.ref] || [];

  const personalBest = exercisePerformance.reduce((best, current) => {
    return (!best || current.weight > best.weight) ? current : best;
  }, null as ExercisePerformance | null);

  const lastPerformance = exercisePerformance.length > 0
    ? exercisePerformance[exercisePerformance.length - 1]
    : null;

  return (
    <div onClick={onViewDetails} className="cursor-pointer">
      <Card className="relative w-full h-[300px] border-none group overflow-hidden">
        {/* Remove the gradient overlay div and modify the image container */}
        <div className="absolute inset-0">
          {isImageLoading && (
            <Skeleton className="w-full h-full">
              <div className="w-full h-full bg-default-300"></div>
            </Skeleton>
          )}
          <Image
            removeWrapper
            alt={`Exercise ${exercise.ref}`}
            className={cn(
              "z-0 w-full h-full object-cover",
              "transition-all duration-500 group-hover:scale-110",
              "brightness-[0.7] contrast-[1.2]", // Add filters here
              isImageLoading ? "opacity-0" : "opacity-100"
            )}
            src={details.thumbnail || details.starting}
            onLoad={() => setIsImageLoading(false)}
          />
        </div>

        {/* Content Overlay */}
        <div className="relative h-full p-4 flex flex-col">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div>
              <motion.div 
                className="flex items-center gap-2 mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Chip
                  size="sm"
                  classNames={{
                    base: "bg-primary-600 border-none",
                    content: "flex items-center gap-1 text-white px-1"
                  }}
                >
                  <Target className="w-3 h-3 text-white" />
                  <span className="text-xs font-medium">
                    {details.primary_muscle}
                  </span>
                </Chip>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {!isSuperset && exerciseNumber && (
                    <span className="text-white/60 mr-2">{exerciseNumber}.</span>
                  )}
                  {exercise.ref}
                </h3>
                {isLogged && (
                  <div className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-success-500" />
                  </div>
                )}
              </motion.div>
            </div>

            <motion.div
              className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
            >
              <ArrowUpRight className="w-4 h-4 text-white" />
            </motion.div>
          </div>

          {/* Stats Section with improved contrast */}
          <div className="flex flex-wrap gap-2 mt-2">
            <Chip
              size="sm"
              classNames={{
                base: "bg-black/40 backdrop-blur-md border border-white/10",
                content: "text-white"
              }}
              startContent={<Dumbbell size={14} className="text-white" />}
            >
              <span className="text-white">{exercise.sets} × {exercise.reps}</span>
            </Chip>
            <Chip
              size="sm"
              classNames={{
                base: "bg-black/40 backdrop-blur-md border border-white/10",
                content: "text-white"
              }}
              startContent={<Clock size={14} className="text-white" />}
            >
              <span className="text-white">{exercise.rest}s</span>
            </Chip>
          </div>

          {/* Performance History with improved contrast */}
          <div className="mt-auto">
            {(personalBest || lastPerformance) && (
              <div className="space-y-2 mb-3">
                {personalBest && (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-warning-500" />
                    <span className="text-sm text-white/90">
                      Best: {personalBest.weight}kg × {personalBest.reps}
                    </span>
                  </div>
                )}
                {lastPerformance && lastPerformance !== personalBest && (
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-success-500" />
                    <span className="text-sm text-white/90">
                      Last: {lastPerformance.weight}kg × {lastPerformance.reps}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {!isLogged && !isSuperset && selectedPlan === 'active' && (
              <motion.div 
                onClick={e => {
                  e.stopPropagation();
                }}
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium w-full"
                  size="sm"
                  startContent={<Zap size={14} />}
                  onPress={() => {
                    onLogSet?.();
                  }}
                >
                  Log Set
                </Button>
                <Button
                  isIconOnly
                  className="bg-white/10 backdrop-blur-md text-white"
                  size="sm"
                  onPress={() => {
                    onViewDetails();
                  }}
                >
                  <BarChart size={14} />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
