// src/components/onboarding/steps/MealsStep.tsx
import { useState, useEffect } from "react";
import { Card, CardBody, Chip } from "@nextui-org/react";
import {
  Coffee,
  Utensils,
  Cookie,
  ChefHat,
  Timer,
  Check,
  Info,
  ArrowRight,
  Clock,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useStepValidation } from "@/hooks/useStepValidation";

interface MealsStepProps {
  onComplete: (value: number) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialValue?: number;
}

const mealOptions = [
  {
    value: 3,
    title: "3 Meals",
    description: "Traditional schedule",
    icon: Coffee,
    color: "primary",
    schedule: [
      { time: "Morning", meal: "Breakfast" },
      { time: "Afternoon", meal: "Lunch" },
      { time: "Evening", meal: "Dinner" },
    ],
    benefits: ["Easier to maintain", "Simple meal prep", "Traditional timing"],
    idealFor: "Best for busy schedules and traditional lifestyles",
  },
  {
    value: 4,
    title: "4 Meals",
    description: "With afternoon snack",
    icon: Cookie,
    color: "secondary",
    schedule: [
      { time: "Morning", meal: "Breakfast" },
      { time: "Noon", meal: "Lunch" },
      { time: "3-4 PM", meal: "Snack" },
      { time: "Evening", meal: "Dinner" },
    ],
    benefits: [
      "Stable energy levels",
      "Reduced hunger",
      "Better portion control",
    ],
    idealFor:
      "Perfect for weight management and steady energy throughout the day",
  },
  {
    value: 5,
    title: "5 Meals",
    description: "Frequent small portions",
    icon: Utensils,
    color: "success",
    schedule: [
      { time: "Early Morning", meal: "Breakfast" },
      { time: "Mid-Morning", meal: "Snack" },
      { time: "Afternoon", meal: "Lunch" },
      { time: "Mid-Afternoon", meal: "Snack" },
      { time: "Evening", meal: "Dinner" },
    ],
    benefits: [
      "Enhanced metabolism",
      "Better nutrient absorption",
      "Increased muscle gains",
    ],
    idealFor: "Optimal for muscle building and active lifestyles",
  },
  {
    value: 6,
    title: "6 Meals",
    description: "Professional athlete plan",
    icon: ChefHat,
    color: "warning",
    schedule: [
      { time: "7 AM", meal: "Early Breakfast" },
      { time: "10 AM", meal: "Late Breakfast" },
      { time: "1 PM", meal: "Lunch" },
      { time: "4 PM", meal: "Afternoon Snack" },
      { time: "7 PM", meal: "Dinner" },
      { time: "9 PM", meal: "Evening Snack" },
    ],
    benefits: [
      "Maximum nutrient timing",
      "Optimal protein synthesis",
      "Enhanced recovery",
    ],
    idealFor: "Designed for athletes and intensive training programs",
  },
] as const;

const MealsStep = ({
  onComplete,
  onValidationChange,
  initialValue,
}: MealsStepProps) => {
  const { selected, handleSelect } = useStepValidation(
    initialValue,
    onComplete,
    onValidationChange
  );
  const [expandedDetails, setExpandedDetails] = useState<number | null>(null);

  return (
    <div className="space-y-4">

      {/* Meal Options */}
      <div className="grid gap-2">
        {mealOptions.map(
          ({
            value,
            title,
            description,
            icon: Icon,
            color,
            schedule,
            benefits,
            idealFor,
          }) => (
            <Card
              key={value}
              isPressable
              className={cn(
                "w-full transition-all",
                selected === value
                  ? `border-2 border-${color}-500 bg-gradient-to-r from-${color}-500/10 to-background`
                  : "border border-divider hover:border-foreground/20"
              )}
              onClick={() => {
                handleSelect(value);
                setExpandedDetails(expandedDetails === value ? null : value);
              }}
            >
              <CardBody className="p-3">
                <div className="flex gap-3 items-start">
                  {/* Icon and Count */}
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center",
                        selected === value
                          ? `bg-${color}-500`
                          : `bg-${color}-500/10`
                      )}
                    >
                      <Icon
                        className={
                          selected === value
                            ? "text-white"
                            : `text-${color}-500`
                        }
                        size={18}
                      />
                    </div>
                    {/* <div className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-full",
                    selected === value
                      ? `bg-${color}-500 text-white`
                      : "bg-content1 text-foreground/60"
                  )}>
                    {value}×
                  </div> */}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={cn(
                          "text-sm font-semibold",
                          selected === value && `text-${color}-500`
                        )}
                      >
                        {title}
                      </h3>
                    </div>

                    {/* Compact Schedule Display */}
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      {schedule.map(({ time, meal }, index) => (
                        <div
                          key={`${time}-${meal}`}
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded",
                            selected === value
                              ? `bg-${color}-500/10 text-${color}-500`
                              : "bg-content1 text-foreground/60"
                          )}
                        >
                          {meal}
                        </div>
                      ))}
                    </div>

                    {/* Expandable Benefits */}
                    {expandedDetails === value && (
                      <div className="mt-2 pt-2 border-t border-divider/50">
                        <div className="flex flex-wrap gap-1">
                          {benefits.map((benefit) => (
                            <span
                              key={benefit}
                              className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded",
                                `bg-${color}-500/10 text-${color}-500`
                              )}
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selected Indicator */}
                  {selected === value && (
                    <Check
                      className={`w-4 h-4 text-${color}-500 flex-shrink-0`}
                    />
                  )}
                </div>
              </CardBody>
            </Card>
          )
        )}
        <Card className="bg-content2">
          <CardBody className="p-3">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/70">
                Choose a meal frequency that fits your lifestyle and schedule.
                You can always adjust this later as your routine changes. I'll
                help you plan portions and timing for optimal results.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default MealsStep;
