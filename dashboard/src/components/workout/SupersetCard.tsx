// src/components/workout/SupersetCard.tsx
import { Card, CardBody } from "@nextui-org/react";
import { ExerciseBase, ExerciseReference } from '../../types/workout';
import { ApiResponse } from '../../types/api';
import ExerciseCard from './ExerciseCard';
import { Zap } from 'lucide-react';

interface SupersetCardProps {
  exercises: ExerciseBase[];
  details: { [key: string]: ExerciseReference };
  performanceData: ApiResponse<any>['data']['references']['performance'];
  onLogPerformance: (exerciseRef: string, weight: number, reps: number) => Promise<void>;
  isPlanActive: boolean;
  exerciseDay: string;
}

const SupersetCard: React.FC<SupersetCardProps> = ({
  exercises,
  details,
  performanceData,
  onLogPerformance,
  isPlanActive,
  exerciseDay,
}) => {
  return (
    <Card className="bg-primary-100 border-none">
      <CardBody className="p-4">
        <Header />
        <ExerciseList
          exercises={exercises}
          details={details}
          performanceData={performanceData}
          onLogPerformance={onLogPerformance}
          isPlanActive={isPlanActive}
          exerciseDay={exerciseDay}
        />
      </CardBody>
    </Card>
  );
};

const Header: React.FC = () => (
  <div className="flex items-center gap-2 mb-4">
    <div className="p-2 rounded-full bg-primary-200">
      <Zap className="text-primary-600" size={20} />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-primary-800">Superset</h3>
      <p className="text-sm text-foreground-600">
        Complete these exercises back to back
      </p>
    </div>
  </div>
);

const ExerciseList: React.FC<SupersetCardProps> = ({
  exercises,
  details,
  performanceData,
  onLogPerformance,
  isPlanActive,
  exerciseDay,
}) => (
  <div className="grid gap-2">
    {exercises.map((exercise, index) => (
      <ExerciseItem
        key={exercise.ref}
        exercise={exercise}
        index={index}
        details={details}
        performanceData={performanceData}
        onLogPerformance={onLogPerformance}
        isPlanActive={isPlanActive}
        exerciseDay={exerciseDay}
      />
    ))}
  </div>
);

const ExerciseItem: React.FC<{
  exercise: ExerciseBase;
  index: number;
  details: { [key: string]: ExerciseReference };
  performanceData: ApiResponse<any>['data']['references']['performance'];
  onLogPerformance: (exerciseRef: string, weight: number, reps: number) => Promise<void>;
  isPlanActive: boolean;
  exerciseDay: string;
}> = ({
  exercise,
  index,
  details,
  performanceData,
  onLogPerformance,
  isPlanActive,
  exerciseDay,
}) => (
  <div className="relative">
    {index > 0 && (
      <div className="absolute -top-2 left-12 w-0.5 h-4 bg-primary-300" />
    )}
    <ExerciseCard
      exerciseRef={exercise.ref}
      sets={exercise.sets}
      reps={exercise.reps}
      rest={exercise.rest}
      details={details[exercise.ref]}
      performanceData={performanceData}
      onLogPerformance={(weight, reps) => 
        onLogPerformance(exercise.ref, weight, reps)
      }
      isLogged={exercise.logged === 1}
      isSuperset={true}
      isPlanActive={isPlanActive}
      exerciseDay={exerciseDay}
    />
  </div>
);

export default SupersetCard;
