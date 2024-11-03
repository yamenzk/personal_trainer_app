// src/components/workout/PerformanceModal.tsx
import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { Trophy } from 'lucide-react';

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

  const handleClose = () => {
    setWeight('');
    setReps('');
    setError('');
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      aria-labelledby="performance-modal-title"
    >
      <ModalContent className="bg-background text-foreground">
        <ModalHeader id="performance-modal-title" className="text-lg font-semibold">
          Log Performance - {exerciseName}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {previousBest.weight > 0 && (
              <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg shadow-md">
                <Trophy className="text-primary" size={20} />
                <div className="text-sm">
                  Previous best: {previousBest.weight}kg × {previousBest.reps} reps
                </div>
              </div>
            )}

            <div className="space-y-4">
              <Input
                type="number"
                label="Weight"
                placeholder="Enter weight in kg"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  setError('');
                }}
                aria-label="Weight in kilograms"
                className="border-primary focus:border-primary focus:ring-2 focus:ring-primary/50"
              />

              <Input
                type="number"
                label="Reps"
                placeholder="Enter number of reps"
                value={reps}
                onChange={(e) => {
                  setReps(e.target.value);
                  setError('');
                }}
                aria-label="Number of repetitions"
                className="border-primary focus:border-primary focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {error && (
              <p className="text-danger text-sm">{error}</p>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            variant="light" 
            onPress={handleClose}
            aria-label="Cancel logging performance"
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit} 
            isLoading={loading}
            aria-label="Save performance"
          >
            Save Performance
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PerformanceModal;
