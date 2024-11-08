import { Button, Card, CardBody, CardHeader, Chip, Progress } from "@nextui-org/react";
import { 
  Dumbbell,
  CheckCircle2,
  ArrowRight,
  Trophy,
  Target,
  TimerIcon
} from 'lucide-react';
import { Client } from '@/types/client';
import { Plan } from '@/types/plan';
import { useTheme } from '../../contexts/ThemeContext';

interface WorkoutProgressProps {
  client: Client;
  activePlan: Plan | null;
  completedPlans: Plan[];
  currentDay: number;
  planProgress: number;
}

export const WorkoutProgress = ({
  activePlan,
  completedPlans,
  currentDay,
  planProgress
}: WorkoutProgressProps) => {
  const { theme } = useTheme();
  if (!activePlan) return null;

  const todayExercises = activePlan.days[`day_${currentDay}`]?.exercises || [];
  const completedExercises = todayExercises.filter(ex => 
    ex.type === 'regular' ? ex.exercise.logged === 1 :
    ex.type === 'superset' && ex.exercises.every(e => e.logged === 1)
  ).length;

  const miniStats = [
    {
      icon: Trophy,
      value: completedPlans.length,
      label: "Plans",
      color: "success"
    },
    {
      icon: Target,
      value: `${currentDay}/7`,
      label: "Day",
      color: "warning"
    },
    {
      icon: TimerIcon,
      value: `${Math.round(planProgress)}%`,
      label: "Progress",
      color: "primary"
    }
  ];

  return (
    <Card className="border-none shadow-none bg-transparent overflow-hidden">
      <CardBody className="gap-6 p-4">
        {/* Today's Overview Card with Texture */}
        <Card className="border-none overflow-hidden">
          <CardBody 
            className="p-4 relative bg-gradient-to-br from-secondary-600 via-secondary-700 to-secondary-800"
          >
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(at_top_right,rgba(255,255,255,0.12),transparent_50%)]" />
         

            <div className="relative space-y-6">
              {/* Header and Progress */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-white">Today's Workout</h3>
                  <div className="w-32">
                    <Progress
                      value={(completedExercises / todayExercises.length) * 100}
                      color="danger"
                      size="sm"
                      radius="sm"
                      classNames={{
                        base: "w-full",
                        track: "bg-white/20",
                        indicator: "bg-success-500",
                      }}
                    />
                  </div>
                </div>
                <Button
                  color="secondary"
                  variant="shadow"
                  endContent={<ArrowRight size={16} />}
                  href="/workouts"
                  as="a"
                  size="sm"
                >
                  Start Workout
                </Button>
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-3 gap-3">
                {miniStats.map((stat, index) => (
                  <Card 
                    key={index} 
                    className="bg-transparent border-none shadow-none "
                  >
                    <CardBody className="p-1 flex justify-between items-start">
                      <div className="flex flex gap-1 text-white">
                        <div className={`p-1.5 rounded-full bg-secondary`}>
                          <stat.icon className={`w-3.5 h-3.5 text-white`} />
                        </div>
                        <span className="text-base font-semibold">{stat.value}</span>
                        {/* <span className="text-xs opacity-80">{stat.label}</span> */}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Timeline Exercise List */}
        <div className="space-y-3">
          {todayExercises.map((exercise, index) => {
            const isCompleted = exercise.type === 'regular' 
              ? exercise.exercise.logged === 1
              : exercise.exercises.every(e => e.logged === 1);

            return (
              <Card 
                key={index}
                shadow="none"
                className={`
                  transition-all duration-300
                  ${isCompleted 
                    ? 'bg-success-500/5 border-success-500/20' 
                    : 'bg-content-100/5 hover:bg-content-100/10'
                  }
                `}
              >
                <CardBody className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {exercise.type === 'regular' 
                          ? exercise.exercise.ref
                          : 'Superset'
                        }
                      </p>
                      <p className="text-sm text-foreground/60">
                        {exercise.type === 'regular'
                          ? `${exercise.exercise.sets} × ${exercise.exercise.reps}`
                          : `${exercise.exercises.length} exercises`
                        }
                      </p>
                    </div>
                    {isCompleted && (
                      <Chip
                        startContent={<CheckCircle2 className="w-3 h-3" />}
                        color="success"
                        variant="flat"
                        size="sm"
                      >
                        Done
                      </Chip>
                    )}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};