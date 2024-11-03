// src/components/workout/ExerciseDetailsModal.tsx
import { Modal, ModalContent, ModalHeader, ModalBody, Image, Chip } from "@nextui-org/react";
import { 
  Dumbbell, 
  Target, 
  RotateCcw, 
  Timer, 
  Activity,
  Gauge,
  Flame,
  Boxes,
  CheckCircle2
} from "lucide-react";
import { ExerciseReference } from '../../types/workout';

interface ExerciseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: {
    ref: string;
    sets: number;
    reps: number;
    rest: number;
    details: ExerciseReference;
    bestWeight: number;
    bestReps: number;
    isLogged: boolean;
  };
}

const ExerciseDetailsModal: React.FC<ExerciseDetailsModalProps> = ({
  isOpen,
  onClose,
  exercise
}) => {
  const { ref, sets, reps, rest, details, bestWeight, bestReps, isLogged } = exercise;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          {ref}
          {isLogged && <CheckCircle2 className="text-success" size={20} />}
        </ModalHeader>
        <ModalBody className="gap-6">
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={details.starting}
              alt="Starting position"
              className="rounded-lg w-full object-cover"
            />
            <Image
              src={details.ending}
              alt="Ending position"
              className="rounded-lg w-full object-cover"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Chip
              startContent={<Dumbbell size={16} />}
              variant="flat"
              size="lg"
              className="justify-start"
            >
              {sets} × {reps}
            </Chip>
            <Chip
              startContent={<Timer size={16} />}
              variant="flat"
              size="lg"
              className="justify-start"
            >
              {rest}s rest
            </Chip>
            <Chip
              startContent={<RotateCcw size={16} />}
              variant="flat"
              size="lg"
              className="justify-start"
            >
              {details.mechanic}
            </Chip>
            <Chip
              startContent={<Activity size={16} />}
              variant="flat"
              size="lg"
              className="justify-start"
            >
              {details.level}
            </Chip>
          </div>

          {(bestWeight > 0 || bestReps > 0) && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-primary/10">
              <Target size={20} className="text-primary" />
              <div>
                <p className="font-semibold">Personal Best</p>
                <p className="text-foreground/60">
                  {bestWeight}kg × {bestReps} reps
                </p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Instructions</h4>
              <p className="text-foreground/90">{details.instructions}</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Gauge size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Force</p>
                    <p className="font-medium">{details.force}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Boxes size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Equipment</p>
                    <p className="font-medium">{details.equipment}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Flame size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Primary Muscle</p>
                    <p className="font-medium">{details.primary_muscle}</p>
                  </div>
                </div>

                {details.secondary_muscles.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Activity size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Secondary Muscles</p>
                      <p className="font-medium">
                        {details.secondary_muscles.map(m => m.muscle).join(', ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ExerciseDetailsModal;