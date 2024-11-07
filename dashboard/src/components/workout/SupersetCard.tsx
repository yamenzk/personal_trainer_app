import { Card, Image, Chip } from "@nextui-org/react";
import { Zap, Dumbbell, Clock, CheckCircle2, Flame } from "lucide-react";
import { ExerciseBase, ExerciseReference } from "@/types/workout";
import { cn } from "@/utils/cn";

interface SupersetCardProps {
  exercises: ExerciseBase[];
  references: { [key: string]: ExerciseReference };
  onLogPerformance: (exerciseRef: string, weight: number, reps: number) => Promise<void>;
  onViewDetails: (exerciseRef: string) => void;
  selectedPlan: 'active' | 'history';
  exerciseNumber?: number;
}

export const SupersetCard: React.FC<SupersetCardProps> = ({
  exercises,
  references,
  onLogPerformance,
  onViewDetails,
  selectedPlan,
  exerciseNumber
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
