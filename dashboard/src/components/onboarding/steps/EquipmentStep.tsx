// src/components/onboarding/steps/EquipmentStep.tsx
import { useState, useEffect } from "react";
import { Card, CardBody, Chip } from "@nextui-org/react";
import {
  Dumbbell,
  Building2,
  Home,
  Clock,
  Ruler,
  CircleDollarSign,
  Trophy,
  AlertCircle,
  Check,
  Sparkles,
  ChevronRight,
  Info,
} from "lucide-react";
import { cn } from "@/utils/cn";

interface EquipmentStepProps {
  onComplete: (value: WorkoutLocation) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialValue?: WorkoutLocation;
}

type WorkoutLocation = "Gym" | "Home";

const equipmentOptions = [
  {
    value: "Gym" as const,
    title: "Gym Access",
    description: "Full equipment availability",
    icon: Building2,
    color: "primary",
    features: [
      {
        icon: Dumbbell,
        text: "Professional Setup",
        detail: "Full range of equipment",
      },
      { icon: Clock, text: "Flexible Hours", detail: "Train on your schedule" },
      {
        icon: Trophy,
        text: "Maximum Options",
        detail: "Varied workout styles",
      },
    ],
    equipment: [
      "Weight machines",
      "Free weights",
      "Cardio equipment",
      "Cable machines",
      "Benches & racks",
    ],
  },
  {
    value: "Home" as const,
    title: "Home Workouts",
    description: "Minimal equipment needed",
    icon: Home,
    color: "secondary",
    features: [
      { icon: Clock, text: "Time-Efficient", detail: "No commute needed" },
      {
        icon: CircleDollarSign,
        text: "Cost-Effective",
        detail: "Minimal investment",
      },
      { icon: Dumbbell, text: "Space-Efficient", detail: "Compact workouts" },
    ],
    equipment: [
      "Bodyweight exercises",
      "Exercise mat",
      "Resistance bands",
      "Small dumbbells",
      "Pull-up bar",
    ],
  },
] as const;

const EquipmentStep = ({
  onComplete,
  onValidationChange,
  initialValue,
}: EquipmentStepProps) => {
  const [selected, setSelected] = useState<WorkoutLocation | null>(
    initialValue || null
  );
  const [expandedDetails, setExpandedDetails] =
    useState<WorkoutLocation | null>(null);

  useEffect(() => {
    onValidationChange?.(!!selected);
  }, [selected, onValidationChange]);

  useEffect(() => {
    if (initialValue && !selected) {
      setSelected(initialValue);
      setExpandedDetails(initialValue);
    }
  }, [initialValue]);

  // Handle selection change without causing infinite loop
  const handleSelection = (value: WorkoutLocation) => {
    setSelected(value);
    setExpandedDetails(value);
    onComplete(value);
  };

  return (
    <div className="space-y-4">
      {/* Options */}
      <div className="grid gap-3">
        {equipmentOptions.map(
          ({
            value,
            title,
            description,
            icon: Icon,
            color,
            features,
            equipment,
          }) => (
            <button
              key={value}
              onClick={() => handleSelection(value)}
              className="w-full text-left focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
            >
              <Card
                className={cn(
                  "w-full transition-all",
                  selected === value
                    ? `border-2 border-${color}-500 bg-gradient-to-r from-${color}-500/10 to-background`
                    : "border border-divider hover:border-foreground/20"
                )}
              >
                <div className="p-4 space-y-4">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
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
                        size={20}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3
                          className={cn(
                            "text-base font-semibold",
                            selected === value && `text-${color}-500`
                          )}
                        >
                          {title}
                        </h3>
                        {selected === value && (
                          <Check className={`w-4 h-4 text-${color}-500`} />
                        )}
                      </div>
                      <p className="text-sm text-foreground/60 mt-0.5">
                        {description}
                      </p>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {features.map(({ icon: FeatureIcon, text, detail }) => (
                      <div
                        key={text}
                        className={cn(
                          "p-2 rounded-lg",
                          selected === value
                            ? `bg-${color}-500/10`
                            : "bg-content1"
                        )}
                      >
                        <div className="flex flex-col items-center text-center gap-1">
                          <FeatureIcon
                            className={cn(
                              "w-4 h-4",
                              selected === value
                                ? `text-${color}-500`
                                : "text-foreground/50"
                            )}
                          />
                          <span className="text-xs font-medium">{text}</span>
                          <span className="text-[10px] text-foreground/60">
                            {detail}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Equipment List */}
                  {selected === value && (
                    <div
                      className={`pt-3 mt-3 border-t border-${color}-500/20`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className={`w-4 h-4 text-${color}-500`} />
                        <p className="text-xs font-medium">
                          Available Equipment
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {equipment.map((item) => (
                          <div
                            key={item}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg bg-${color}-500/10 text-xs`}
                          >
                            <ChevronRight
                              className={`w-3 h-3 text-${color}-500`}
                            />
                            <span className={`text-${color}-500`}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </button>
          )
        )}
        <Card className="bg-content2">
          <CardBody className="p-3">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/70">
                Choose based on your access and preferences. Both options
                provide effective workouts when followed consistently. I'll
                customize your program based on available equipment.{" "}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default EquipmentStep;
