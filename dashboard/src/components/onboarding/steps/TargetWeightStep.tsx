// src/components/onboarding/steps/TargetWeightStep.tsx
import { useState, useEffect, useMemo } from 'react';
import { Input, Select, SelectItem, Card, CardBody, Chip, Switch } from "@nextui-org/react";
import { Target, Scale, TrendingDown, TrendingUp, Calendar, Trophy, Sparkles, Check, Info } from 'lucide-react';
import dayjs from 'dayjs';
import type { FitnessGoal } from './GoalStep';
import { cn } from '@/utils/cn';
import { BaseStepProps } from '@/types/onboarding';

// Configuration constants for easy adjustment
const WEIGHT_FACTORS = {
  WEIGHT_LOSS: {
    AGGRESSIVE: 1.0,    // kg per week
    MODERATE: 0.75,     // kg per week
    CONSERVATIVE: 0.5   // kg per week
  },
  WEIGHT_GAIN: {
    AGGRESSIVE: 0.5,    // kg per week
    MODERATE: 0.4,      // kg per week
    CONSERVATIVE: 0.3   // kg per week
  },
  MUSCLE_BUILDING: {
    BULK: 0.4,         // kg per week
    RECOMP: 0,         // maintain weight
    LEAN: 0.2          // kg per week
  },
  // Maximum allowed deviation from recommendations (percentage)
  MAX_DEVIATION: 100    // Allow up to 100% deviation from recommended changes
};

interface WeightTarget {
  id: string;
  label: string;
  weeklyRate: number;
  description: string;
  color: 'primary' | 'secondary' | 'success' | 'warning';
}

interface CalculatedTarget extends WeightTarget {
  targetWeight: number;
  totalChange: number;
}

interface GoalRecommendations {
  targets: WeightTarget[];
}

type GoalRecommendationMap = Record<FitnessGoal, GoalRecommendations>;

interface TargetWeightStepProps extends BaseStepProps {
  onComplete: (value: number) => void;
  onValidationChange?: (isValid: boolean) => void;
  currentWeight: number;
  selectedGoal?: FitnessGoal;
  initialValue?: number;
  membershipStart?: string;
  membershipEnd?: string;
}

const TargetWeightStep = ({ 
  onComplete, 
  onValidationChange, 
  currentWeight,
  selectedGoal = 'Weight Loss',
  initialValue,
  membershipStart = dayjs().format('YYYY-MM-DD'),
  membershipEnd = dayjs().add(3, 'month').format('YYYY-MM-DD')
}: TargetWeightStepProps) => {
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');

  const currentWeightInUnit = useMemo(() => {
    const value = unit === 'lb' ? currentWeight * 2.20462 : currentWeight;
    return Math.round(value);
  }, [currentWeight, unit]);

  const programDuration = useMemo(() => {
    return dayjs(membershipEnd).diff(dayjs(membershipStart), 'week');
  }, [membershipStart, membershipEnd]);

  const recommendations = useMemo(() => {
    const baseRecommendations: GoalRecommendationMap = {
      'Weight Loss': {
        targets: [
          {
            id: 'aggressive',
            label: 'Aggressive',
            weeklyRate: -WEIGHT_FACTORS.WEIGHT_LOSS.AGGRESSIVE,
            description: 'Faster results with disciplined approach',
            color: 'primary'
          },
          {
            id: 'moderate',
            label: 'Recommended',
            weeklyRate: -WEIGHT_FACTORS.WEIGHT_LOSS.MODERATE,
            description: 'Balanced and sustainable approach',
            color: 'success'
          },
          {
            id: 'conservative',
            label: 'Conservative',
            weeklyRate: -WEIGHT_FACTORS.WEIGHT_LOSS.CONSERVATIVE,
            description: 'Gradual and easy to maintain',
            color: 'secondary'
          }
        ]
      },
      'Weight Gain': {
        targets: [
          {
            id: 'aggressive',
            label: 'Aggressive',
            weeklyRate: WEIGHT_FACTORS.WEIGHT_GAIN.AGGRESSIVE,
            description: 'Maximum muscle gain potential',
            color: 'primary'
          },
          {
            id: 'moderate',
            label: 'Recommended',
            weeklyRate: WEIGHT_FACTORS.WEIGHT_GAIN.MODERATE,
            description: 'Optimal muscle-to-fat ratio',
            color: 'success'
          },
          {
            id: 'conservative',
            label: 'Conservative',
            weeklyRate: WEIGHT_FACTORS.WEIGHT_GAIN.CONSERVATIVE,
            description: 'Minimize fat gain',
            color: 'secondary'
          }
        ]
      },
      'Muscle Building': {
        targets: [
          {
            id: 'bulk',
            label: 'Bulk',
            weeklyRate: WEIGHT_FACTORS.MUSCLE_BUILDING.BULK,
            description: 'Focus on maximum muscle gain',
            color: 'primary'
          },
          {
            id: 'recomp',
            label: 'Recomposition',
            weeklyRate: WEIGHT_FACTORS.MUSCLE_BUILDING.RECOMP,
            description: 'Maintain weight while building muscle',
            color: 'success'
          },
          {
            id: 'lean',
            label: 'Lean Gain',
            weeklyRate: WEIGHT_FACTORS.MUSCLE_BUILDING.LEAN,
            description: 'Slow gain with minimal fat',
            color: 'secondary'
          }
        ]
      },
      'Maintenance': {
        targets: [
          {
            id: 'maintain',
            label: 'Maintenance',
            weeklyRate: 0,
            description: 'Focus on performance and health',
            color: 'warning'
          }
        ]
      }
    };

    const calculateTargetWeight = (weeklyRate: number) => {
      const totalChange = weeklyRate * programDuration;
      const weightInKg = currentWeight + totalChange;
      return unit === 'lb' ? Math.round(weightInKg * 2.20462) : Math.round(weightInKg);
    };

    return baseRecommendations[selectedGoal].targets.map((target): CalculatedTarget => ({
      ...target,
      weeklyRate: unit === 'lb' ? 
        Math.round(target.weeklyRate * 2.20462 * 10) / 10 :
        Math.round(target.weeklyRate * 10) / 10,
      targetWeight: calculateTargetWeight(target.weeklyRate),
      totalChange: Math.abs(calculateTargetWeight(target.weeklyRate) - currentWeightInUnit)
    }));
  }, [selectedGoal, currentWeight, programDuration, unit, currentWeightInUnit]);

  const validateWeight = (value: string) => {
    if (!value) {
      setError('Please enter your target weight');
      return false;
    }

    const weightValue = parseFloat(value);
    if (isNaN(weightValue) || weightValue <= 0) {
      setError('Please enter a valid weight');
      return false;
    }

    const weightInKg = unit === 'lb' ? weightValue * 0.453592 : weightValue;
    const weightDiff = Math.abs(weightInKg - currentWeight);
    
    // Calculate maximum allowed change based on goal and duration
    const maxWeeklyChange = selectedGoal === 'Weight Loss' ? 
      WEIGHT_FACTORS.WEIGHT_LOSS.AGGRESSIVE : 
      WEIGHT_FACTORS.WEIGHT_GAIN.AGGRESSIVE;
    
    const maxTotalChange = programDuration * maxWeeklyChange * (1 + WEIGHT_FACTORS.MAX_DEVIATION / 100);

    if (weightDiff > maxTotalChange) {
      const maxChangeInUnit = Math.round(maxTotalChange * (unit === 'lb' ? 2.20462 : 1));
      setError(`Maximum recommended change is ${maxChangeInUnit}${unit} for your program duration`);
      return false;
    }

    setError('');
    onComplete(Math.round(weightInKg));
    return true;
  };

  const handleWeightChange = (value: string) => {
    setWeight(value);
    const isValid = validateWeight(value);
    onValidationChange?.(isValid);
  };

  const handleUnitToggle = (isSelected: boolean) => {
    const newUnit = isSelected ? 'lb' : 'kg';
    if (newUnit === unit) return;
    
    setUnit(newUnit);
    if (weight && !isNaN(parseFloat(weight))) {
      const newWeight = newUnit === 'lb' ? 
        Math.round(parseFloat(weight) * 2.20462) : 
        Math.round(parseFloat(weight) * 0.453592);
      handleWeightChange(newWeight.toString());
    } else {
      setWeight('');
      setError('');
      onValidationChange?.(false);
    }
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as 'kg' | 'lb';
    setUnit(newUnit);
    if (weight && !isNaN(parseFloat(weight))) {
      const newWeight = newUnit === 'lb' ? 
        Math.round(parseFloat(weight) * 2.20462) : 
        Math.round(parseFloat(weight) * 0.453592);
      handleWeightChange(newWeight.toString());
    } else {
      setWeight('');
      setError('');
      onValidationChange?.(false);
    }
  };

  useEffect(() => {
    if (initialValue) {
      const displayWeight = unit === 'lb' ? 
        Math.round(initialValue * 2.20462) : 
        Math.round(initialValue);
      setWeight(displayWeight.toString());
      handleWeightChange(displayWeight.toString());
    }
  }, [initialValue, unit]);

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card className="bg-content2">
          <CardBody className="p-3">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
              <h4 className="text-sm font-medium text-foreground">Set your target weight</h4>
              <p className="text-xs text-foreground/70">
              {selectedGoal === 'Maintenance' 
                ? "I'll help you maintain your weight while improving strength and fitness."
                : "Choose from AI recommended targets or set a custom goal for your journey."}
              </p>
              </div>
            </div>
          </CardBody>
        </Card>

      {/* Current Weight & Duration Card */}
      <Card className="bg-gradient-to-r from-primary-500/10 to-background border-none">
        <CardBody className="p-4">
          <div className="flex flex-col gap-4">
            {/* Weight Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Current Weight</p>
                  <p className="text-xl font-semibold">{currentWeightInUnit} {unit}</p>
                </div>
              </div>

              {/* Unit Toggle */}
              <div className="flex items-center gap-3 bg-background/40 p-2 rounded-full">
                <span className={cn(
                  "text-sm font-medium transition-colors",
                  unit === 'kg' ? "text-primary-500" : "text-foreground/40"
                )}>KG</span>
                <Switch
                  size="sm"
                  color="primary"
                  isSelected={unit === 'lb'}
                  onValueChange={handleUnitToggle}
                />
                <span className={cn(
                  "text-sm font-medium transition-colors",
                  unit === 'lb' ? "text-primary-500" : "text-foreground/40"
                )}>LB</span>
              </div>
            </div>

            {/* Duration Section */}
            <div className="flex items-center gap-3 pt-3 border-t border-divider/30">
              <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary-500" />
              </div>
              <div>
                <p className="text-sm text-foreground/60">Program Duration</p>
                <p className="text-base font-medium">{programDuration} weeks</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Recommendations Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="w-4 h-4 text-primary-500" />
          <h3 className="text-base font-medium">Recommended for you</h3>
        </div>

        <div className="grid gap-3">
          {recommendations.map(({
            id,
            label,
            weeklyRate,
            targetWeight,
            totalChange,
            description,
            color
          }: CalculatedTarget) => (
            <button
              key={id}
              onClick={() => {
                setSelectedTarget(id);
                handleWeightChange(targetWeight.toString());
              }}
              className="w-full text-left focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl"
            >
              <Card
                className={cn(
                  "w-full transition-all",
                  selectedTarget === id 
                    ? `border-2 border-${color}-500 bg-gradient-to-r from-${color}-500/10 to-background`
                    : "border border-divider hover:border-foreground/20"
                )}
              >
                <CardBody className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className={cn(
                          "font-semibold",
                          selectedTarget === id && `text-${color}-500`
                        )}>{label}</h4>
                        {selectedTarget === id && (
                          <Check className={`w-4 h-4 text-${color}-500`} />
                        )}
                      </div>
                      <Chip
                        size="sm"
                        color={color}
                        variant={selectedTarget === id ? "solid" : "flat"}
                        className="capitalize"
                      >
                        {weeklyRate === 0 ? 'Maintain' : 
                          `${Math.abs(weeklyRate)} ${unit}/week`}
                      </Chip>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-foreground/60">{description}</p>

                    {/* Target Details */}
                    <div className={cn(
                      "flex items-center gap-3 p-3 rounded-lg",
                      selectedTarget === id
                        ? `bg-${color}-500/10`
                        : "bg-content1"
                    )}>
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        `bg-${color}-500/20`
                      )}>
                        {weeklyRate > 0 ? (
                          <TrendingUp className={`w-4 h-4 text-${color}-500`} />
                        ) : weeklyRate < 0 ? (
                          <TrendingDown className={`w-4 h-4 text-${color}-500`} />
                        ) : (
                          <Target className={`w-4 h-4 text-${color}-500`} />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          Target: {targetWeight} {unit}
                        </div>
                        {totalChange > 0 && (
                          <div className={`text-sm text-${color}-500`}>
                            {weeklyRate > 0 ? 'Gain' : 'Lose'} {totalChange} {unit}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Input Section */}
      {recommendations.length > 1 && (
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-divider/30" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-sm text-foreground/40">
                or set custom target
              </span>
            </div>
          </div>

          <Input
            type="number"
            label="Custom Target Weight"
            placeholder={`Enter target weight in ${unit}`}
            value={weight}
            onValueChange={(value) => {
              setSelectedTarget(null);
              handleWeightChange(value);
            }}
            errorMessage={error}
            isInvalid={!!error}
            variant="bordered"
            radius="lg"
            startContent={
              <div className="pointer-events-none">
                <Target className="w-4 h-4 text-foreground/50" />
              </div>
            }
            endContent={
              <div className="pointer-events-none text-foreground/50">
                {unit}
              </div>
            }
            className="max-w-xs mx-auto"
          />
        </div>
      )}
    </div>
  );
};

export default TargetWeightStep;