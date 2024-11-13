// src/components/shared/WeightModal.tsx
import { useState, useEffect } from 'react';
import { 
  Modal, 
  ModalContent,
  Button,
  Input,
  Progress,
  Switch
} from "@nextui-org/react";
import { 
  Scale,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  Info,
} from 'lucide-react';
import { cn } from "@/utils/cn";
import { updateWeight } from '@/utils/api';
import { motion } from "framer-motion";
import { WeightModalProps } from "@/types";

const getMotivationalMessage = (
  change: { value: string; isGain: boolean },
  weightGoal: 'Weight Gain' | 'Weight Loss' | 'Maintenance' | 'Muscle Building'
) => {
  const weightValue = parseFloat(change.value);
  const isOnTrack = (
    (weightGoal === 'Weight Gain' && change.isGain) || 
    (weightGoal === 'Weight Loss' && !change.isGain) ||
    (weightGoal === 'Muscle Building' && change.isGain)
  );
  const isMaintaining = weightGoal === 'Maintenance' && weightValue < 1;

  if (isMaintaining) {
    return {
      emoji: "🎯",
      message: "Great job maintaining your weight!",
      color: "primary"
    };
  }

  if (isOnTrack) {
    // Special case for muscle building
    if (weightGoal === 'Muscle Building') {
      if (weightValue < 0.5) return {
        emoji: "💪",
        message: "Lean gains in progress!",
        color: "success",
        tip: "Keep your protein intake high and maintain progressive overload"
      };
      if (weightValue < 1) return {
        emoji: "🏋️",
        message: "Building quality muscle!",
        color: "success",
        tip: "Great progress! Remember to adjust your training intensity"
      };
      return {
        emoji: "🦾",
        message: "Significant muscle gains!",
        color: "warning",
        tip: "Monitor body fat levels while building muscle"
      };
    }

    // Regular weight goals
    if (weightValue < 1) return {
      emoji: "💫",
      message: "Small steps lead to big changes!",
      color: "success"
    };
    if (weightValue < 2) return {
      emoji: "🌟",
      message: "You're right on track!",
      color: "success"
    };
    return {
      emoji: "👑",
      message: "Incredible progress!",
      color: "success"
    };
  } else {
    // Off track from their goals
    if (weightGoal === 'Weight Gain' && !change.isGain) {
      return {
        emoji: "💪",
        message: "Let's focus on hitting those calories!",
        color: "warning",
        tip: "Try increasing your protein and healthy fat intake"
      };
    }
    if (weightGoal === 'Weight Loss' && change.isGain) {
      return {
        emoji: "🌱",
        message: "Don't worry, progress isn't always linear!",
        color: "warning",
        tip: "Consider reviewing your food diary this week"
      };
    }
    if (weightGoal === 'Muscle Building' && !change.isGain) {
      return {
        emoji: "🔄",
        message: "Time to fuel your gains!",
        color: "warning",
        tip: "Increase your caloric intake and focus on compound exercises"
      };
    }
  }

  // Default message
  return {
    emoji: "✨",
    message: "Keep going!",
    color: "primary"
  };
};

const validateWeightInput = (
  weightInput: number, 
  currentWeight: number, 
  isLbs: boolean
): { isValid: boolean; message: string } => {
  // Convert to KG for validation if needed
  const weightInKg = isLbs ? weightInput * 0.453592 : weightInput;
  
  // Check if it's too low (might be entering weight loss instead of current weight)
  if (weightInKg < 30) {
    return {
      isValid: false,
      message: "Please enter your current total weight."
    };
  }

  // Check if it's unreasonably high
  if (weightInKg > 300) {
    return {
      isValid: false,
      message: "Please enter a valid weight between 30kg and 300kg"
    };
  }

  // Check if the change is too drastic (more than 20% change)
  const percentageChange = Math.abs((weightInKg - currentWeight) / currentWeight) * 100;
  if (percentageChange > 20) {
    return {
      isValid: false,
      message: "This change seems unusual. Please verify you're entering your total current weight"
    };
  }

  return { isValid: true, message: "" };
};

const weightTrackingTips = [
  {
    icon: "⚖️",
    tip: "Weigh yourself first thing in the morning"
  },
  {
    icon: "🚽",
    tip: "After using the bathroom, before eating or drinking"
  },
  {
    icon: "👕",
    tip: "Wear similar clothing each time"
  },
  {
    icon: "📅",
    tip: "Track at the same time each day for consistency"
  },
  {
    icon: "🎯",
    tip: "Use the same scale on a hard, flat surface"
  }
];



export const WeightModal: React.FC<WeightModalProps> = ({
  isOpen,
  onClose,
  onWeightLogged,
  clientId,
  currentWeight,
  weightGoal
}: WeightModalProps) => {
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLbs, setIsLbs] = useState(false);
  const [baseWeightKg, setBaseWeightKg] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setWeight(currentWeight.toString());
      setBaseWeightKg(currentWeight);
      setError("");
    }
  }, [isOpen, currentWeight]);

  const handleUnitToggle = (isSelected: boolean) => {
    setIsLbs(isSelected);
    if (baseWeightKg !== null) {
      const newWeight = isSelected 
        ? (baseWeightKg * 2.20462).toFixed(1)
        : baseWeightKg.toFixed(1);
      setWeight(newWeight);
    }
  };

  const handleWeightChange = (value: string) => {
    setWeight(value);
    const weightNum = parseFloat(value);
    if (!isNaN(weightNum)) {
      // Validate input
      const validation = validateWeightInput(weightNum, currentWeight, isLbs);
      if (!validation.isValid) {
        setError(validation.message);
      } else {
        setError("");
        const weightInKg = isLbs ? weightNum * 0.453592 : weightNum;
        setBaseWeightKg(weightInKg);
      }
    }
  };

  const handleQuickIncrement = (amount: number) => {
    const currentWeight = parseFloat(weight) || 0;
    const increment = isLbs ? amount * 2.20462 : amount;
    setWeight((currentWeight + increment).toFixed(1));
    const newWeightKg = isLbs 
      ? (currentWeight + increment) * 0.453592 
      : (currentWeight + increment);
    setBaseWeightKg(newWeightKg);
  };

  const getWeightChange = () => {
    if (!baseWeightKg) return null;
    const diff = baseWeightKg - currentWeight;
    return {
      value: Math.abs(diff).toFixed(1),
      percentage: ((diff / currentWeight) * 100).toFixed(1),
      isGain: diff > 0
    };
  };

  const handleSubmit = async () => {
    if (!baseWeightKg) {
      setError("Please enter a valid weight");
      return;
    }

    // Validate reasonable range (±20% of current weight)
    const maxChange = currentWeight * 0.2;
    if (Math.abs(baseWeightKg - currentWeight) > maxChange) {
      setError("Please enter a weight within 20% of your current weight");
      return;
    }

    setLoading(true);
    try {
      await updateWeight(clientId, baseWeightKg);
      onWeightLogged();
      onClose();
    } catch (err) {
      setError("Failed to log weight");
    } finally {
      setLoading(false);
    }
  };

  const weightChange = getWeightChange();

  return (
    <Modal
      size="2xl"
      radius="lg"
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior='outside'
      hideCloseButton
      backdrop="blur"
      className="bg-white/50 dark:bg-black/50"
    >
      <ModalContent>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">Track Weight</h2>
              <div className="flex items-center gap-2 mt-1">
                <Scale className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground/60">
                  Current: {currentWeight} kg
                </span>
              </div>
            </div>
            <Button
              isIconOnly
              variant="light"
              onPress={onClose}
            >
              <AlertTriangle className="w-4 h-4" />
            </Button>
          </div>

          {/* Weight Change Visualization */}
          {weightChange && (
            <div className="grid grid-cols-2 gap-4">
              <div className={cn(
                "p-4 rounded-xl space-y-2",
                weightChange.isGain 
                  ? "bg-warning-500/10 border border-warning-500/20" 
                  : "bg-success-500/10 border border-success-500/20"
              )}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    {weightChange.isGain 
                      ? <TrendingUp className="w-4 h-4 text-warning-500" />
                      : <TrendingDown className="w-4 h-4 text-success-500" />
                    }
                    <span className={cn(
                      "text-sm font-medium",
                      weightChange.isGain ? "text-warning-500" : "text-success-500"
                    )}>
                      Weight {weightChange.isGain ? "Gain" : "Loss"}
                    </span>
                  </div>
                  <div className={cn(
                    "text-2xl font-bold",
                    weightChange.isGain ? "text-warning-600" : "text-success-600"
                  )}>
                    {weightChange.value} kg
                  </div>
                  <Progress
                    value={Math.min(Math.abs(parseFloat(weightChange.percentage)), 100)}
                    className="h-2"
                    classNames={{
                      indicator: weightChange.isGain 
                        ? "bg-gradient-to-r from-warning-500 to-warning-600"
                        : "bg-gradient-to-r from-success-500 to-success-600"
                    }}
                  />
                  {/* Enhanced Motivational Message */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {/* Goal Context
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-primary-500" />
                      <span className="text-xs text-foreground/60">
                        Goal: Weight {weightGoal}
                      </span>
                    </div> */}

                    {/* Motivational Message */}
                    {(() => {
                      const motivation = getMotivationalMessage(weightChange, weightGoal);
                      return (
                        <div className="space-y-2">
                          <div className={cn(
                            "flex items-center gap-2",
                            `text-${motivation.color}-600`
                          )}>
                            <span className="text-lg">{motivation.emoji}</span>
                            <span className="font-medium text-sm">
                              {motivation.message}
                            </span>
                          </div>
                          {motivation.tip && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 }}
                              className="text-xs text-foreground/60 pl-7"
                            >
                              Tip: {motivation.tip}
                            </motion.div>
                          )}
                        </div>
                      );
                    })()}
                  </motion.div>
                </motion.div>
              </div>

              {/* Progress Stats Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-medium text-primary-500">
                    Progress Stats
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-foreground/60">
                    {weightChange.isGain 
                      ? "From previous weight"
                      : "Weight reduction"}
                  </p>
                  <p className="text-lg font-semibold text-primary-600">
                    {weightChange.percentage}% {weightChange.isGain ? "increase" : "decrease"}
                  </p>
                </div>
              </motion.div>
            </div>
          )}

          {/* Weight Tracking Tips */}
          <div className="p-4 rounded-xl bg-primary-500/5 border border-primary-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-500">
                Tips for Accurate Weight Tracking
              </span>
            </div>
            <div className="space-y-2">
              {weightTrackingTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-sm">{tip.icon}</span>
                  <span className="text-sm text-foreground/60">{tip.tip}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Unit Switch */}
          <div className="flex justify-center items-center gap-3">
            <span className={cn(
              "text-sm font-medium",
              !isLbs ? "text-primary-500" : "text-foreground/60"
            )}>
              KG
            </span>
            <Switch
              isSelected={isLbs}
              size="lg"
              color="primary"
              onValueChange={handleUnitToggle}
            />
            <span className={cn(
              "text-sm font-medium",
              isLbs ? "text-primary-500" : "text-foreground/60"
            )}>
              LB
            </span>
          </div>

          {/* Weight Input */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Scale className="w-4 h-4 text-primary" />
              <label className="text-sm font-medium">Weight ({isLbs ? "lb" : "kg"})</label>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={weight}
                onValueChange={handleWeightChange}
                placeholder={`Enter weight in ${isLbs ? "pounds" : "kilograms"}`}
                className="flex-1"
                classNames={{
                  label: "text-black/50 dark:text-white/90",
                  input: [
                    "text-lg",
                    "bg-transparent",
                    "text-black/90 dark:text-white/90",
                    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                  ],
                  innerWrapper: "bg-transparent",
                  inputWrapper: [
                    "shadow-xl",
                    "bg-default-200/50",
                    "dark:bg-default/50",
                    "backdrop-blur-xl",
                    "backdrop-saturate-200",
                    "hover:bg-default-200/70",
                    "dark:hover:bg-default/70",
                    "group-data-[focus=true]:bg-default-200/50",
                    "dark:group-data-[focus=true]:bg-default/60",
                    "!cursor-text",
                  ],
                }}
                min={0}
                startContent={
                  <Scale className="w-4 h-4" />
                }
              />
              <div className="flex flex-col gap-1">
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  onPress={() => handleQuickIncrement(0.5)}
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  onPress={() => handleQuickIncrement(-0.5)}
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 p-4 rounded-lg bg-danger-500/10 border border-danger-500/20"
            >
              <AlertTriangle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-danger font-medium">{error}</p>
                <p className="text-xs text-danger/60">
                  Remember to enter your total current weight, not the amount changed
                </p>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="bordered"
              onPress={onClose}
              className="flex-1"
              color="danger"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              className="flex-1"
              onPress={handleSubmit}
              isLoading={loading}
              startContent={!loading && <CheckCircle className="w-4 h-4" />}
            >
              Save Weight
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};