import { useState, useEffect } from "react";
import { Modal, ModalContent, Button, Input, Progress, Switch } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Target, Trophy, AlertTriangle, CheckCircle, History, ChevronDown, ChevronUp, Dumbbell, Repeat, Scale, Timer} from "lucide-react";
import { cn } from "@/utils/cn";
import { refetchClientData } from "@/stores/clientStore";



const getPerformanceMessage = (
  current: { weight: number; reps: number },
  previous: { weight: number; reps: number } | null,
  personalBest: { weight: number; reps: number }
) => {
  if (!previous) return {
    emoji: "🎯",
    message: "First set! Let's establish your baseline.",
    color: "primary"
  };

  const isNewPB = current.weight > personalBest.weight || 
    (current.weight === personalBest.weight && current.reps > personalBest.reps);

  if (isNewPB) return {
    emoji: "🏆",
    message: "New Personal Best!",
    color: "success",
    tip: "Keep challenging yourself with progressive overload"
  };

  const weightDiff = current.weight - previous.weight;
  const repsDiff = current.reps - previous.reps;

  if (weightDiff > 0) return {
    emoji: "💪",
    message: `Added ${weightDiff}kg to your lift!`,
    color: "success",
    tip: "Great progress on increasing the weight"
  };

  if (repsDiff > 0) return {
    emoji: "⚡",
    message: `${repsDiff} more reps than last time!`,
    color: "success",
    tip: "Keep pushing your endurance"
  };

  if (weightDiff < 0) return {
    emoji: "🔄",
    message: "Focus on proper form at this weight",
    color: "warning",
    tip: "Quality reps are better than heavy sloppy ones"
  };

  return {
    emoji: "✨",
    message: "Consistency is key!",
    color: "primary"
  };
};

interface PerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (weight: number, reps: number) => Promise<void>;
  exerciseName: string;
  targetReps: number;
  previousPerformance?: {
    weight: number;
    reps: number;
    date: string;
  }[];
}

export const PerformanceModal: React.FC<PerformanceModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    exerciseName,
    targetReps,
    previousPerformance = [],
  }: PerformanceModalProps) => {
    const [weight, setWeight] = useState<string>("");
    const [actualReps, setActualReps] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPrevious, setShowPrevious] = useState(true);
    const [isLbs, setIsLbs] = useState(false);
    const [baseWeightKg, setBaseWeightKg] = useState<number | null>(null);
  
    // Calculate previous bests
    const personalBest = previousPerformance.reduce(
      (best, current) => {
        if (current.weight > best.weight) {
          return current;
        }
        if (current.weight === best.weight && current.reps > best.reps) {
          return current;
        }
        return best;
      },
      { weight: 0, reps: 0, date: "" }
    );
  
    const lastPerformance = previousPerformance[previousPerformance.length - 1];
  
    // Reset form when modal opens
    useEffect(() => {
      if (isOpen) {
        setWeight(lastPerformance ? lastPerformance.weight.toString() : "");
        setActualReps(targetReps.toString());
        setError("");
        setShowPrevious(true);
      }
    }, [isOpen, lastPerformance, targetReps]);
  
    const handleUnitToggle = (isSelected: boolean) => {
      setIsLbs(isSelected);
      if (weight) {
        const weightNum = parseFloat(weight);
        const newWeight = isSelected 
          ? (weightNum * 2.20462).toFixed(1)
          : (weightNum / 2.20462).toFixed(1);
        setWeight(newWeight);
      }
    };
  
    const handleWeightChange = (value: string) => {
      setWeight(value);
      const weightNum = parseFloat(value);
      if (!isNaN(weightNum)) {
        const weightInKg = isLbs ? weightNum / 2.20462 : weightNum;
        setBaseWeightKg(weightInKg);
      }
    };
  
    const handleSubmit = async () => {
      if (!weight || !actualReps) {
        setError("Please enter both weight and reps");
        return;
      }
  
      const weightNum = parseFloat(weight);
      const repsNum = parseInt(actualReps);
  
      if (isNaN(weightNum) || weightNum <= 0) {
        setError("Please enter a valid weight");
        return;
      }
  
      if (isNaN(repsNum) || repsNum <= 0) {
        setError("Please enter valid reps");
        return;
      }
  
      setLoading(true);
      setError("");
  
      const weightToSubmit = isLbs ? parseFloat(weight) / 2.20462 : parseFloat(weight);
  
      try {
        await onSubmit(weightToSubmit, repsNum);
        await refetchClientData();
        onClose();
      } catch (err) {
        setError("Failed to log performance");
      } finally {
        setLoading(false);
      }
    };
  
    const handleQuickIncrement = (type: 'weight' | 'reps', amount: number) => {
      if (type === 'weight') {
        const currentWeight = parseFloat(weight) || 0;
        setWeight((currentWeight + amount).toString());
      } else {
        const currentReps = parseInt(actualReps) || 0;
        setActualReps((currentReps + amount).toString());
      }
    };
  
    const getProgressColor = (current: number, target: number) => {
      const percentage = (current / target) * 100;
      if (percentage >= 100) return "success";
      if (percentage >= 80) return "primary";
      if (percentage >= 50) return "warning";
      return "danger";
    };
  
    return (
      <Modal
        size="2xl"
        radius="lg"
        isOpen={isOpen}
        onClose={onClose}
        hideCloseButton
        backdrop='blur'
        className="bg-white/50 dark:bg-black/50"
      >
        <ModalContent>
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">{exerciseName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground/60">
                    Target: {targetReps} reps
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
  
            {/* Previous Performance Section */}
            {previousPerformance.length > 0 && (
              <div className={cn(
                "space-y-4 overflow-hidden transition-all duration-300",
                showPrevious ? "max-h-96" : "max-h-0"
              )}>
                <div className="grid grid-cols-2 gap-4">
                  {/* Personal Best Card */}
                  <div className="p-4 rounded-xl bg-primary-500 space-y-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-white" />
                      <span className="text-sm font-medium text-white">Personal Best</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {personalBest.weight} kg × {personalBest.reps}
                    </div>
                    <div className="text-xs text-white/60">
                      {new Date(personalBest.date).toLocaleDateString("en-AE")}
                    </div>
                  </div>
  
                  {/* Last Performance Card */}
                  <div className="p-4 rounded-xl bg-secondary-500 space-y-2">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-white" />
                      <span className="text-sm font-medium text-white">Last Performance</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {lastPerformance.weight} kg × {lastPerformance.reps}
                    </div>
                    <div className="text-xs text-white/60">
                      {new Date(lastPerformance.date).toLocaleDateString("en-AE")}
                    </div>
                  </div>
  
                  {/* Motivational Message */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-2 p-4 rounded-xl bg-content1/5 border border-content1/10"
                  >
                    {(() => {
                      const current = { 
                        weight: parseFloat(weight) || 0, 
                        reps: parseInt(actualReps) || 0 
                      };
                      const motivation = getPerformanceMessage(
                        current,
                        lastPerformance,
                        personalBest
                      );
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
                              transition={{ delay: 0.2 }}
                              className="text-xs text-foreground/60 pl-7"
                            >
                              Tip: {motivation.tip}
                            </motion.div>
                          )}
                        </div>
                      );
                    })()}
                  </motion.div>
                </div>
  
                {/* Progress Indicators */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground/60">Weight Progress</span>
                      <span className="text-sm font-medium">
                        {((parseFloat(weight) / personalBest.weight) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={(parseFloat(weight) / personalBest.weight) * 100}
                      color={getProgressColor(parseFloat(weight), personalBest.weight)}
                      className="h-2"
                    />
                  </div>
  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground/60">Reps Progress</span>
                      <span className="text-sm font-medium">
                        {((parseInt(actualReps) / targetReps) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={(parseInt(actualReps) / targetReps) * 100}
                      color={getProgressColor(parseInt(actualReps), targetReps)}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            )}
  
            {/* Toggle Previous Performance */}
            {previousPerformance.length > 0 && (
              <Button
                variant="light"
                onPress={() => setShowPrevious(!showPrevious)}
                className="w-full"
                endContent={showPrevious ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              >
                {showPrevious ? "Hide" : "Show"} Previous Performance
              </Button>
            )}
  
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
  
            {/* Input Section */}
            <div className="space-y-4">
              {/* Weight Input */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Scale className="w-4 h-4 text-primary" />
                  <label className="text-sm font-medium">
                    Weight ({isLbs ? "lb" : "kg"})
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={weight}
                    onValueChange={handleWeightChange}
                    placeholder="Enter weight"
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
                      <Dumbbell className="w-4 h-4" />
                    }
                  />
                  <div className="flex flex-col gap-1">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onPress={() => handleQuickIncrement('weight', 2.5)}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onPress={() => handleQuickIncrement('weight', -2.5)}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
  
              {/* Reps Input */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Repeat className="w-4 h-4 text-primary" />
                  <label className="text-sm font-medium">Reps</label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={actualReps}
                    onValueChange={setActualReps}
                    placeholder="Enter reps"
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
                      <Timer className="w-4 h-4" />
                    }
                  />
                  <div className="flex flex-col gap-1">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onPress={() => handleQuickIncrement('reps', 1)}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onPress={() => handleQuickIncrement('reps', -1)}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-danger-500/10 text-danger">
                <AlertTriangle className="w-4 h-4" />
                <p className="text-sm">{error}</p>
              </div>
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
                Log Performance
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    );
  };