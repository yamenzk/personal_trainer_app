import { Card, CardHeader, CardFooter, Chip, Button, Image, Skeleton } from "@nextui-org/react";
import { Dumbbell, Clock, Trophy, ArrowUp, CheckCircle2, Zap, History } from "lucide-react";
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
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const details = references[exercise.ref];
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
        <h3 className="font-semibold flex text-2xl text-white">
          {!isSuperset && exerciseNumber && (
            <span className="text-white/80">{exerciseNumber}.</span>
          )}
          {exercise.ref}
          {isLogged && (
      <CheckCircle2 className="w-4 h-4 text-white-500" />
    )}
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
    "absolute bottom-0 z-20",
    "bg-black/60 backdrop-blur-md",
    "flex justify-between items-center flex-wrap gap-2"
  )}
>
  {/* Tags section */}
  <div className={cn("flex flex-wrap gap-2", {
    "max-w-[70%]": (!isLogged && !isSuperset && selectedPlan === 'active'),
  })}>
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
        {personalBest.weight}kg × {personalBest.reps}
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
        startContent={<History size={14} className="text-white" />}
      >
        {lastPerformance.weight}kg × {lastPerformance.reps}
      </Chip>
    )}
  </div>

  {/* Button section */}
  <div className="flex items-center gap-2 ml-auto">
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
  </div>
</CardFooter>


    </Card>
  );
};
