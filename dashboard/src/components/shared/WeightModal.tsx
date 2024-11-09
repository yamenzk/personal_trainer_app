// src/components/shared/WeightModal.tsx
import { useState } from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Input,
  Button,
  Chip,
  Progress
} from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scale, 
  TrendingUp, 
  TrendingDown, 
  Target,
  AlertCircle,
  Trophy,
  Activity
} from 'lucide-react';
import { updateWeight } from '@/utils/api';

interface WeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWeightLogged: () => void;
  clientId: string;
  currentWeight: number;
}

export const WeightModal: React.FC<WeightModalProps> = ({
  isOpen,
  onClose,
  onWeightLogged,
  clientId,
  currentWeight
}: WeightModalProps) => {
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const weightDiff = weight ? parseFloat(weight) - currentWeight : 0;
  const isWeightLoss = weightDiff < 0;
  const isWeightGain = weightDiff > 0;

  const getWeightChangeInfo = () => {
    if (!weight || isNaN(weightDiff)) return null;

    return {
      type: isWeightLoss ? 'loss' : 'gain',
      value: Math.abs(weightDiff).toFixed(1),
      color: isWeightLoss ? 'success' : 'warning',
      icon: isWeightLoss ? TrendingDown : TrendingUp
    };
  };

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

    // Validate reasonable range (±20% of current weight)
    const maxChange = currentWeight * 0.2;
    if (Math.abs(weightValue - currentWeight) > maxChange) {
      setError('Please enter a weight within 20% of your current weight');
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

  const weightChange = getWeightChangeInfo();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            backdrop="blur"
            scrollBehavior="inside"
            placement="center"
            classNames={{
              backdrop: "bg-background/70",
              base: "bg-background/95",
              body: "p-0",
              closeButton: "hover:bg-white/5 active:bg-white/10",
            }}
            motionProps={{
              variants: {
                enter: {
                  y: 0,
                  opacity: 1,
                  transition: { duration: 0.3, ease: "easeOut" }
                },
                exit: {
                  y: 20,
                  opacity: 0,
                  transition: { duration: 0.2, ease: "easeIn" }
                }
              }
            }}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 px-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold">Track Weight</h3>
                        <p className="text-sm text-foreground/60">
                          Keep track of your progress
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-primary-500/10">
                        <Scale className="w-5 h-5 text-primary-500" />
                      </div>
                    </div>
                  </ModalHeader>
                  
                  <ModalBody className="px-6 py-4 space-y-6">
                    {/* Current Weight Display */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-primary-500/20">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-primary-500/20">
                          <Scale className="w-6 h-6 text-primary-500" />
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60">Current Weight</p>
                          <p className="text-xl font-semibold">{currentWeight} kg</p>
                        </div>
                      </div>
                    </div>

                    {/* Weight Input */}
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
                      startContent={<Scale className="text-default-400" size={18} />}
                      endContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">kg</span>
                        </div>
                      }
                      classNames={{
                        label: "text-foreground/90",
                        input: ["bg-transparent", "text-lg"],
                        innerWrapper: "bg-transparent",
                        inputWrapper: [
                          "bg-content/10",
                          "backdrop-blur-sm",
                          "hover:bg-content/20",
                          "group-data-[focused=true]:bg-content/20",
                        ],
                      }}
                    />

                    {/* Weight Change Visualization */}
                    {weightChange && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl bg-${weightChange.color}-500/10 border border-${weightChange.color}-500/20`}
                      >
                        <div className="flex items-center gap-3">
                          <weightChange.icon className={`w-5 h-5 text-${weightChange.color}-500`} />
                          <div>
                            <p className="font-medium">
                              {weightChange.value} kg {weightChange.type}
                            </p>
                            <p className="text-sm text-foreground/60">
                              {weightChange.type === 'loss' 
                                ? 'Keep up the great work!' 
                                : 'Progress towards your goal'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Tips */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-content/5">
                      <Activity className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm text-foreground/70">
                          Tips for accurate weight tracking:
                        </p>
                        <ul className="text-sm text-foreground/60 space-y-1">
                          <li className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary-500" />
                            Weigh yourself at the same time each day
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary-500" />
                            Use the same scale for consistency
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary-500" />
                            Weigh before eating or drinking
                          </li>
                        </ul>
                      </div>
                    </div>
                  </ModalBody>
                  
                  <ModalFooter className="px-6 py-4">
                    <Button 
                      variant="light" 
                      onPress={onClose}
                      className="font-medium"
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      onPress={handleSubmit}
                      isLoading={loading}
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 font-medium"
                      startContent={!loading && <Scale size={18} />}
                    >
                      Save Weight
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </motion.div>
      )}
    </AnimatePresence>
  );
};