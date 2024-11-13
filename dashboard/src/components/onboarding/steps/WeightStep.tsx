import { useState, useEffect } from "react";
import { Input, Switch, Card, CardBody } from "@nextui-org/react";
import { Scale, Info } from "lucide-react";
import { cn } from "@/utils/cn";
import { WeightStepProps } from "@/types";

const WeightStep = ({
  onComplete,
  onValidationChange,
  initialValue,
}: WeightStepProps) => {
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");
  const [baseWeightKg, setBaseWeightKg] = useState<number | null>(null);
  const [isLbs, setIsLbs] = useState(false); // Explicit state for the switch

  const validateWeight = (value: string, currentUnit: "kg" | "lb") => {
    if (!value) {
      setError("Please enter your current weight");
      return false;
    }

    const weightValue = parseFloat(value);
    if (isNaN(weightValue) || weightValue <= 0) {
      setError("Please enter a valid weight");
      return false;
    }

    const weightInKg =
      currentUnit === "lb" ? weightValue * 0.453592 : weightValue;

    if (weightInKg < 30 || weightInKg > 300) {
      setError("Please enter a reasonable weight (30kg - 300kg)");
      return false;
    }

    setError("");
    setBaseWeightKg(weightInKg);
    onComplete(Math.round(weightInKg * 10) / 10);
    return true;
  };

  const handleWeightChange = (value: string) => {
    setWeight(value);
    const isValid = validateWeight(value, unit);
    onValidationChange?.(isValid);
  };

  const updateDisplayWeight = (newUnit: "kg" | "lb", baseKg: number | null) => {
    if (baseKg === null) return;

    const newWeight =
      newUnit === "lb" ? (baseKg * 2.20462).toFixed(1) : baseKg.toFixed(1);
    setWeight(newWeight);
  };

  // Handle initial value
  useEffect(() => {
    if (initialValue) {
      setBaseWeightKg(initialValue);
      updateDisplayWeight(unit, initialValue);
      validateWeight(initialValue.toFixed(1), unit);
    }
  }, [initialValue]);

  // Handle unit toggle
  const handleUnitToggle = (isSelected: boolean) => {
    setIsLbs(isSelected);
    const newUnit = isSelected ? "lb" : "kg";
    setUnit(newUnit);
    updateDisplayWeight(newUnit, baseWeightKg);
  };

  // Calculate conversion display
  const getConversionDisplay = () => {
    if (!baseWeightKg) return null;

    if (unit === "kg") {
      return `${(baseWeightKg * 2.20462).toFixed(1)} lb`;
    } else {
      return `${baseWeightKg.toFixed(1)} kg`;
    }
  };

  return (
    <div className="space-y-6">

      {/* Weight Display */}
      {!error && weight && !isNaN(parseFloat(weight)) && (
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-b from-primary-500/20 to-background flex items-center justify-center">
            <Scale className="w-10 h-10 text-primary-500" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl font-semibold text-foreground">
              {parseFloat(weight).toFixed(1)} {unit}
            </p>
            <p className="text-sm text-foreground/60">
              {getConversionDisplay()}
            </p>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="space-y-4">
        {/* Unit Switch */}
        <div className="flex justify-center items-center gap-3">
          <span
            className={cn(
              "text-sm font-medium",
              !isLbs ? "text-primary-500" : "text-foreground/60"
            )}
          >
            KG
          </span>
          <Switch
            isSelected={isLbs}
            size="lg"
            color="primary"
            onValueChange={handleUnitToggle}
          />
          <span
            className={cn(
              "text-sm font-medium",
              isLbs ? "text-primary-500" : "text-foreground/60"
            )}
          >
            LB
          </span>
        </div>

        {/* Weight Input */}
        <Input
          type="number"
          label="Enter your weight"
          placeholder={`Weight in ${unit}`}
          value={weight}
          onValueChange={handleWeightChange}
          errorMessage={error}
          isInvalid={!!error}
          variant="bordered"
          color="primary"
          radius="lg"
          className="max-w-xs mx-auto"
          startContent={<Scale className="w-4 h-4 text-foreground/50" />}
          endContent={
            <div className="pointer-events-none text-foreground/50">{unit}</div>
          }
        />

        <Card className="bg-content2">
          <CardBody className="p-3">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/70">
              Your current weight helps me understand your starting point and
              calculate appropriate fitness goals for your journey.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default WeightStep;
