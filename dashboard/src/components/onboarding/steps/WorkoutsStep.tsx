// src/components/onboarding/steps/WorkoutsStep.tsx
import { useState, useEffect } from 'react';
import { Card, CardBody, Chip } from "@nextui-org/react";
import { Calendar, Clock, Dumbbell, Trophy, ChartBar, Timer, Info, Activity } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useStepValidation } from '@/hooks/useStepValidation';

interface WorkoutsStepProps {
  onComplete: (value: number) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialValue?: number;
}

type WeekDay = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
const WEEK_DAYS: WeekDay[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const workoutOptions = [
  {
    value: 3,
    title: '3 Times a Week',
    description: 'Beginner Friendly',
    schedule: ['Mon', 'Wed', 'Fri'] as WeekDay[],
    duration: '45-60 min',
    intensity: 1,
    color: 'primary',
    features: ['Full body workouts', 'Good recovery time', 'PPL split'],
    details: {
      splits: ['Rest', 'Push', 'Rest', 'Pull', 'Rest', 'Legs', 'Rest'],
      recovery: 'Excellent recovery between sessions',
      ideal: 'Perfect for beginners or those with busy schedules',
      results: 'Steady progress with focus on form and fundamentals'
    }
  },
  {
    value: 4,
    title: '4 Times a Week',
    description: 'Balanced Approach',
    schedule: ['Mon', 'Tue', 'Thu', 'Fri'] as WeekDay[],
    duration: '45-60 min',
    intensity: 2,
    color: 'secondary',
    features: ['Upper/Lower split', 'Balanced recovery', 'Consistent progress'],
    details: {
      splits: ['Rest', 'Upper', 'Lower', 'Rest', 'Upper', 'Lower', 'Rest'],
      recovery: 'Good balance of work and recovery',
      ideal: 'Great for consistent progress while maintaining work-life balance',
      results: 'Effective muscle targeting with adequate recovery'
    }
  },
  {
    value: 5,
    title: '5 Times a Week',
    description: 'Intermediate Level',
    schedule: ['Mon', 'Tue', 'Tue', 'Thu', 'Fri', 'Sat'] as WeekDay[],
    duration: '60-75 min',
    intensity: 3,
    color: 'success',
    features: ['Body part splits', 'Enhanced focus', 'Faster progress'],
    details: {
      splits: ['Push', 'Pull', 'Legs', 'Rest', 'Upper', 'Lower', 'Rest'],
      recovery: 'Strategic split for optimal muscle recovery',
      ideal: 'Perfect for those focused on muscle growth and strength',
      results: 'Significant strength gains and muscle development'
    }
  },
  {
    value: 6,
    title: '6 Times a Week',
    description: 'Advanced Training',
    schedule: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as WeekDay[],
    duration: '60-90 min',
    intensity: 4,
    color: 'warning',
    features: ['PPL split 2x', 'Maximum volume', 'Elite results'],
    details: {
      splits: ['Rest', 'Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs'],
      recovery: 'Advanced recovery management required',
      ideal: 'For experienced trainers and athletes',
      results: 'Maximum muscle growth and strength development'
    }
  }
] as const;

const WorkoutsStep = ({ onComplete, onValidationChange, initialValue }: WorkoutsStepProps) => {
  const { selected, handleSelect } = useStepValidation(initialValue, onComplete, onValidationChange);
  const [expandedDetails, setExpandedDetails] = useState<number | null>(null);

  return (
    <div className="space-y-4">

      {/* Workout Options */}
      <div className="grid gap-3">
        {workoutOptions.map(({
          value,
          title,
          description,
          schedule,
          duration,
          intensity,
          color,
          features,
          details
        }) => (
          <button
            key={value}
            onClick={() => {
              handleSelect(value);
              setExpandedDetails(expandedDetails === value ? null : value);
            }}
            className="w-full text-left focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
          >
            <Card className={cn(
              "w-full transition-all",
              selected === value 
                ? `border-2 border-${color}-500 bg-gradient-to-r from-${color}-500/10 to-background`
                : "border border-divider hover:border-foreground/20"
            )}>
              <CardBody className="p-4">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="relative flex items-start gap-3">
                    {/* Left Column - Icon & Intensity */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        selected === value ? `bg-${color}-500` : `bg-${color}-500/10`
                      )}>
                        <Dumbbell className={selected === value ? "text-white" : `text-${color}-500`} size={24} />
                      </div>
                      {/* <div className="flex flex-col gap-0.5">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              i < intensity
                                ? selected === value ? `bg-${color}-500` : `bg-${color}-500/40`
                                : "bg-foreground/10"
                            )}
                          />
                        ))}
                      </div> */}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={cn(
                          "text-base font-semibold",
                          selected === value && `text-${color}-500`
                        )}>{title}</h3>
                        <Chip size="sm" variant="flat" color={color} startContent={<Timer className="w-3 h-3" />}>
                          {duration}
                        </Chip>
                      </div>
                      <p className="text-sm text-foreground/60 mt-1">{description}</p>
                    </div>
                  </div>

                  {/* Weekly Calendar */}
                  <div className="grid grid-cols-7 gap-1">
                    {WEEK_DAYS.map((day, index) => (
                      <div key={day} className="text-center">
                        <div className={cn(
                          "mx-auto w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium",
                          schedule.includes(day)
                            ? selected === value
                              ? `bg-${color}-500 text-white`
                              : `bg-${color}-500/20 text-${color}-500`
                            : "bg-content2/20 text-foreground/20"
                        )}>
                          {day}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5">
                    {features.map(feature => (
                      <div
                        key={feature}
                        className={cn(
                          "text-xs px-2 py-1 rounded-md",
                          selected === value
                            ? `bg-${color}-500/10 text-${color}-500`
                            : "bg-content1 text-foreground/70"
                        )}
                      >
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Expanded Details */}
                  {expandedDetails === value && (
                    <div className={`mt-3 pt-3 border-t border-${color}-500/20 space-y-2`}>
                      <div className={cn(
                        "text-sm rounded-lg p-3",
                        `bg-${color}-500/10`
                      )}>
                        <p className={`font-medium text-${color}-500`}>{details.ideal}</p>
                        <p className="text-foreground/60 mt-1 text-xs">{details.recovery}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </button>
        ))}
        <Card className="bg-content2">
          <CardBody className="p-3">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/70">
              Choose a frequency that fits your lifestyle. I'll design your program to maximize results while ensuring proper recovery.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutsStep;