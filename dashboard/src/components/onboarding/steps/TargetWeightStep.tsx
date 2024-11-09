// src/components/onboarding/steps/TargetWeightStep.tsx
import { useState, useEffect, useMemo } from 'react';
import { Input, Select, SelectItem, Card, CardBody, Chip, Switch } from "@nextui-org/react";
import { Target, Scale, TrendingDown, TrendingUp, Calendar, Trophy, Sparkles, Check } from 'lucide-react';
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
      {/* Summary Header */}
      <Card className="bg-primary-500/5 border-none">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            {/* Current Weight */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
                <Scale className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <p className="text-xs text-foreground/60">Current Weight</p>
                <p className="text-lg font-semibold">{currentWeightInUnit} {unit}</p>
              </div>
            </div>

            {/* Unit Toggle */}
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-sm transition-colors",
                unit === 'kg' ? "text-primary-500" : "text-foreground/40"
              )}>kg</span>
              <Switch
                size="sm"
                color="primary"
                isSelected={unit === 'lb'}
                onValueChange={handleUnitToggle}
              />
              <span className={cn(
                "text-sm transition-colors",
                unit === 'lb' ? "text-primary-500" : "text-foreground/40"
              )}>lb</span>
            </div>
          </div>

          {/* Duration Info */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-divider/30">
            <Calendar className="w-4 h-4 text-primary-500" />
            <p className="text-sm">
              <span className="text-foreground/60">Program Duration:</span>
              <span className="font-medium ml-1">{programDuration} weeks</span>
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Recommendations */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="w-4 h-4 text-primary-500" />
          <p className="text-sm font-medium">Recommended Targets</p>
        </div>

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
            className={cn(
              "w-full p-3 rounded-lg transition-all duration-200",
              "relative overflow-hidden",
              selectedTarget === id 
                ? `bg-${color}-500/10 border-2 border-${color}-500` 
                : `bg-${color}-500/5 hover:bg-${color}-500/10 border border-${color}-500/20`
            )}
          >
            {/* Selected Indicator */}
            {selectedTarget === id && (
              <div 
                className={cn(
                  "absolute right-2 bottom-2 w-5 h-5 rounded-full",
                  `bg-${color}-500 text-white`,
                  "flex items-center justify-center"
                )}
              >
                <Check size={12} />
              </div>
            )}

            {/* Rate Badge */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{label}</span>
              <Chip 
                size="sm" 
                color={color} 
                variant={selectedTarget === id ? "solid" : "flat"}
                className="capitalize transition-colors duration-200"
              >
                {weeklyRate === 0 ? 'Maintain' : 
                  `${Math.abs(weeklyRate)} ${unit}/week`}
              </Chip>
            </div>

            {/* Target Info */}
            <div className="text-sm space-y-1">
              <p className={cn(
                "text-foreground/60 text-left transition-colors duration-200",
                selectedTarget === id && `text-${color}-600`
              )}>{description}</p>
              <div className="flex items-center gap-2 font-medium">
                <span>Target: {targetWeight} {unit}</span>
                {totalChange > 0 && (
                  <>
                    <span className="text-foreground/30">•</span>
                    <span className={`text-${color}-500`}>
                      {weeklyRate > 0 ? 'Gain' : 'Lose'} {totalChange} {unit}
                    </span>
                  </>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Custom Input */}
      {recommendations.length > 1 && (
        <>
          <div className="flex items-center gap-3">
            <div className="h-px bg-default-200 flex-1" />
            <span className="text-xs text-default-400">or set custom target</span>
            <div className="h-px bg-default-200 flex-1" />
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
            startContent={<Target className="text-default-400 flex-shrink-0" size={18} />}
            className="max-w-xs mx-auto"
          />
        </>
      )}

      {/* Help Text */}
      <Card className="bg-content2">
        <CardBody className="p-3">
          <div className="flex gap-2">
            <Target className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/70">
              {selectedGoal === 'Maintenance' ?
                "We'll help you maintain your weight while improving strength, endurance, and overall fitness." :
                "These targets are calculated based on your goal and program duration for optimal, sustainable results."
              }
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TargetWeightStep;