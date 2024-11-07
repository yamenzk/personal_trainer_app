import { Modal, ModalContent, Button, Input, Progress } from "@nextui-org/react";
import { Scale, Dumbbell, Timer, AlertTriangle, Repeat, History, ChevronUp, ChevronDown, CheckCircle, Target, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";

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
  
      try {
        await onSubmit(weightNum, repsNum);
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
        className="bg-background/98"
        classNames={{
          backdrop: "bg-[#000000]/80 backdrop-blur-md",
        }}
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
                showPrevious ? "max-h-80" : "max-h-0"
              )}>
                <div className="grid grid-cols-2 gap-4">
                  {/* Personal Best Card */}
                  <div className="p-4 rounded-xl bg-primary-500/10 space-y-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-primary-500" />
                      <span className="text-sm font-medium">Personal Best</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {personalBest.weight} kg × {personalBest.reps}
                    </div>
                    <div className="text-xs text-foreground/60">
                      {new Date(personalBest.date).toLocaleDateString()}
                    </div>
                  </div>
  
                  {/* Last Performance Card */}
                  <div className="p-4 rounded-xl bg-secondary-500/10 space-y-2">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-secondary-500" />
                      <span className="text-sm font-medium">Last Performance</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {lastPerformance.weight} kg × {lastPerformance.reps}
                    </div>
                    <div className="text-xs text-foreground/60">
                      {new Date(lastPerformance.date).toLocaleDateString()}
                    </div>
                  </div>
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
  
            {/* Input Section */}
            <div className="space-y-4">
              {/* Weight Input */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Scale className="w-4 h-4 text-primary" />
                  <label className="text-sm font-medium">Weight (kg)</label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={weight}
                    onValueChange={setWeight}
                    placeholder="Enter weight"
                    className="flex-1"
                    classNames={{
                      input: "text-lg",
                    }}
                    min={0}
                    startContent={
                      <Dumbbell className="w-4 h-4 text-default-400" />
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
                      input: "text-lg",
                    }}
                    min={0}
                    startContent={
                      <Timer className="w-4 h-4 text-default-400" />
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