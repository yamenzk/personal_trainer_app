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

  return (
    <Card isBlurred={theme === 'dark'} shadow="sm">
      <CardHeader className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Today's Workout</h3>
          <p className="text-sm text-foreground-500">
            Day {currentDay} of your fitness journey
          </p>
        </div>
        <Button
          color="primary"
          endContent={<ArrowRight size={16} />}
          variant="solid"
          href="/workouts"
          as="a"
        >
          Go to Workouts
        </Button>
      </CardHeader>

      <CardBody className="gap-6">
        {/* Stats Overview */}
        <Card className="bg-content-100/5" shadow="none">
          <CardBody>
            <div className="grid grid-cols-3 divide-x divide-foreground/20">
              <div className="px-4 py-2">
                <div className="flex flex-col items-center text-center">
                  <Trophy className="w-5 h-5 text-primary mb-2" />
                  <span className="text-xs text-foreground-500">Completed Plans</span>
                  <span className="text-xl font-semibold">{completedPlans.length}</span>
                </div>
              </div>
              <div className="px-4 py-2">
                <div className="flex flex-col items-center text-center">
                  <Target className="w-5 h-5 text-secondary mb-2" />
                  <span className="text-xs text-foreground-500">Current Day</span>
                  <span className="text-xl font-semibold">{currentDay}/7</span>
                </div>
              </div>
              <div className="px-4 py-2">
                <div className="flex flex-col items-center text-center">
                  <TimerIcon className="w-5 h-5 text-success mb-2" />
                  <span className="text-xs text-foreground-500">Week Progress</span>
                  <span className="text-xl font-semibold">{Math.round(planProgress)}%</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Today's Progress */}
        <Card shadow="none" className="bg-content-100/5">
          <CardBody className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-primary" />
                  <span className="font-medium">Today's Progress</span>
                </div>
                <Chip 
                  variant="bordered" 
                  color="primary"
                >
                  {completedExercises} of {todayExercises.length} exercises
                </Chip>
              </div>
              <Progress
                value={(completedExercises / todayExercises.length) * 100}
                color="primary"
                size="md"
                radius="sm"
                classNames={{
                  base: "max-w-full",
                  track: "drop-shadow-md border border-default",
                  indicator: "bg-gradient-to-r from-primary-500 to-secondary-500",
                  label: "tracking-wider font-medium text-default-600",
                  value: "text-foreground/50"
                }}
                showValueLabel={true}
              />
            </div>
          </CardBody>
        </Card>

        {/* Exercises List */}
        <div className="grid gap-3">
          {todayExercises.map((exercise, index) => (
            <Card
              key={index}
              shadow="none"
              className="bg-content-100/5 hover:scale-[1.02] hover:bg-content-100/10 transition-all duration-300"
            >
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-500/10">
                      <Dumbbell className="w-4 h-4 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {exercise.type === 'regular' 
                          ? exercise.exercise.ref
                          : 'Superset'
                        }
                      </p>
                      <p className="text-sm text-foreground-500">
                        {exercise.type === 'regular'
                          ? `${exercise.exercise.sets} × ${exercise.exercise.reps}`
                          : `${exercise.exercises.length} exercises`
                        }
                      </p>
                    </div>
                  </div>
                  {exercise.type === 'regular' ? (
                    exercise.exercise.logged === 1 && (
                      <Chip
                        startContent={<CheckCircle2 className="w-4 h-4" />}
                        color="success"
                        variant="flat"
                      >
                        Completed
                      </Chip>
                    )
                  ) : (
                    exercise.exercises.every(e => e.logged === 1) && (
                      <Chip
                        startContent={<CheckCircle2 className="w-4 h-4" />}
                        color="success"
                        variant="flat"
                      >
                        Completed
                      </Chip>
                    )
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};