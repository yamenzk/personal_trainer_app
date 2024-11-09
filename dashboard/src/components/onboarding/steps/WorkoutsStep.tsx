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
    schedule: ['Sun', 'Mon', 'Tue', 'Thu', 'Fri'] as WeekDay[],
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

  return (
    <div className="space-y-6">
      {/* Workout Options */}
      <div className="grid gap-4">
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
          <Card
            key={value}
            isPressable
            isHoverable
            onPress={() => handleSelect(value)}
            className={cn(
              "w-full border-2 transition-all duration-200",
              selected === value 
                ? `border-${color}-500 bg-${color}-500/5`
                : "border-transparent hover:bg-content1"
            )}
          >
            <CardBody className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="font-medium flex items-center gap-2">
                    {title}
                    {/* <Chip
                      size="sm"
                      color={color}
                      variant="flat"
                      startContent={<Timer className="w-3 h-3" />}
                    >
                      {duration}
                    </Chip> */}
                  </h3>
                  <p className="text-sm text-foreground/60">{description}</p>
                </div>

                {/* Intensity Indicator */}
                <div className="flex gap-1 absolute top-3 right-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-1 h-6 rounded-full transition-colors duration-200",
                        i < intensity
                          ? selected === value
                            ? `bg-${color}-500`
                            : `bg-${color}-500/40`
                          : 'bg-content/10'
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Weekly Schedule */}
              <div className="mb-4">
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className={`w-4 h-4 text-${color}-500`} />
                  Weekly Schedule
                </p>
                <div className="grid grid-cols-7 gap-1">
                  {WEEK_DAYS.map((day, index) => (
                    <div
                      key={day}
                      className="text-center"
                    >
                      <div className={cn(
                        "mx-auto w-8 h-8 rounded-lg flex items-center justify-center text-xs mb-1",
                        "transition-colors duration-200",
                        schedule.includes(day)
                          ? selected === value
                            ? `bg-${color}-500 text-white`
                            : `bg-${color}-500/20 text-${color}-500`
                          : 'bg-content2/20 text-foreground/20'
                      )}>
                        {day}
                      </div>
                      <div className={cn(
                        "text-[10px] px-1 py-0.5 rounded",
                        schedule.includes(day)
                          ? selected === value
                            ? `bg-${color}-500/10 text-${color}-600`
                            : "bg-content2/60"
                          : "bg-content2/20 text-foreground/20",
                      )}>
                        {details.splits[index]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {features.map((feature) => (
                    <Chip
                      key={feature}
                      size="sm"
                      variant="solid"
                      color={color}
                      startContent={<Activity className="w-3 h-3" />}
                      className={selected === value ? 'opacity-70' : 'opacity-30'}
                    >
                      {feature}
                    </Chip>
                  ))}
                </div>

                {selected === value && (
                  <div className={cn(
                    "flex items-start gap-2 p-2 rounded-lg text-sm",
                    `bg-${color}-500/10`
                  )}>
                    <Info className={`w-4 h-4 text-${color}-500 flex-shrink-0 mt-0.5`} />
                    <div className="space-y-1">
                      <p>{details.ideal}</p>
                      <p className="text-foreground/60">{details.recovery}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Help Text */}
      <Card className="bg-content2">
        <CardBody className="p-3">
          <div className="flex gap-2">
            <Info className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/70">
              Choose a workout frequency that matches your experience level and availability. 
              I'll design your program to maximize results while ensuring proper recovery between sessions.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default WorkoutsStep;