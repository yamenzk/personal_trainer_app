// src/components/workout/ExerciseCard.tsx
import { useState } from 'react';
import { Card, CardHeader, CardBody, Button, Image, Chip } from "@nextui-org/react";
import { Dumbbell, Timer, ChevronRight, Target, CheckCircle2 } from "lucide-react";
import { ExerciseReference } from '../../types/workout';
import { usePerformance } from '../../hooks/usePerformance';
import PerformanceModal from './PerformanceModal';
import ExerciseDetailsModal from './ExerciseDetailsModal';
import { ApiResponse } from '../../types/api';

interface ExerciseCardProps {
  exerciseRef: string;
  sets: number;
  reps: number;
  rest: number;
  details: ExerciseReference;
  performanceData: ApiResponse<any>['data']['references']['performance'];
  onLogPerformance: (weight: number, reps: number) => Promise<void>;
  isLogged?: boolean;
  isSuperset?: boolean;
  isPlanActive: boolean;
  exerciseDay: string;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exerciseRef,
  sets,
  reps,
  rest,
  details,
  performanceData,
  onLogPerformance,
  isLogged = false,
  isSuperset = false,
  isPlanActive,
  exerciseDay,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const { getBestWeight, getBestReps } = usePerformance(performanceData);

  const bestWeight = getBestWeight(exerciseRef);
  const bestReps = getBestReps(exerciseRef);

  return (
    <>
      <Card
        style={{ width: '100%' }}
        className={`border-none transition-all duration-200 ${isLogged ? 'bg-success/10' : 'bg-muted/5'}`}
        isPressable
        onPress={() => setShowDetails(true)}
      >
        <CardHeader className="flex gap-4 p-4">
          <Image
            alt={exerciseRef}
            className="object-cover rounded-lg w-24 h-24 shadow-md"
            src={details.thumbnail || details.starting}
          />
          <div className="flex flex-col flex-1">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                  {exerciseRef}
                  {isLogged && <CheckCircle2 className="text-success" size={16} />}
                </h3>
                <p className="text-sm text-foreground/60 text-left">
                  {details.primary_muscle}
                </p>
              </div>
              <Button
                isIconOnly
                variant="light"
                className="text-foreground/50 hover:text-foreground"
                size="sm"
                onPress={() => setShowDetails(true)}
              >
                <ChevronRight size={20} />
              </Button>
            </div>
  
            <div className="flex gap-2 mt-3">
              <Chip
                startContent={<Dumbbell size={14} />}
                variant="flat"
                size="sm"
                className="bg-primary/10 text-primary"
              >
                {sets} × {reps}
              </Chip>
              <Chip
                startContent={<Timer size={14} />}
                variant="flat"
                size="sm"
                className="bg-secondary/10 text-secondary"
              >
                {rest}s rest
              </Chip>
            </div>
          </div>
        </CardHeader>
  
        <CardBody className="px-4 py-0 pb-4">
          {(bestWeight > 0 || bestReps > 0) && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 mb-3">
              <Target size={16} className="text-primary" />
              <span className="text-sm text-foreground">
                Best: {bestWeight}kg × {bestReps} reps
              </span>
            </div>
          )}
  
          {isPlanActive && !isLogged && !isSuperset && (
            <Button
              color="primary"
              className="w-full bg-primary text-background hover:bg-primary/90 transition-all duration-200"
              startContent={<Dumbbell size={18} />}
              onPress={() => setShowPerformance(true)}
            >
              Log Performance
            </Button>
          )}
        </CardBody>
      </Card>
  
      <ExerciseDetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        exercise={{
          ref: exerciseRef,
          sets,
          reps,
          rest,
          details,
          bestWeight,
          bestReps,
          isLogged
        }}
      />
  
      <PerformanceModal
        isOpen={showPerformance}
        onClose={() => setShowPerformance(false)}
        onSubmit={onLogPerformance}
        exerciseName={exerciseRef}
        previousBest={{
          weight: bestWeight,
          reps: bestReps
        }}
      />
    </>
  );
  
};

export default ExerciseCard;
