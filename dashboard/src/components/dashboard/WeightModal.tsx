// src/components/dashboard/WeightModal.tsx
import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { Scale } from 'lucide-react';
import { updateWeight } from '../../utils/api';

interface WeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWeightLogged: () => void;
  clientId: string;
  currentWeight: number;
}

const WeightModal = ({
  isOpen,
  onClose,
  onWeightLogged,
  clientId,
  currentWeight
}: WeightModalProps) => {
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!weight) {
      setError('Please enter your weight');
      return;
    }

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      setError('Please enter a valid weight');
      return;
    }

    setLoading(true);
    try {
      await updateWeight(clientId, weightValue);
      onWeightLogged();
      onClose();
    } catch (err) {
      setError('Failed to log weight');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Log Weight</ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5">
              <Scale className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-foreground/60">Current Weight</p>
                <p className="font-semibold">{currentWeight} kg</p>
              </div>
            </div>

            <Input
              type="number"
              label="New Weight"
              placeholder="Enter weight in kg"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
                setError('');
              }}
              errorMessage={error}
              startContent={<Scale className="text-default-400" size={16} />}
              endContent={<div className="pointer-events-none text-default-400">kg</div>}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={loading}>
            Save Weight
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WeightModal;