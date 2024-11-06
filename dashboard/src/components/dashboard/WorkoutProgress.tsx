// src/components/dashboard/WorkoutProgress.tsx
import { motion } from "framer-motion";
import { Button, Chip, Progress } from "@nextui-org/react";
import { 
  Dumbbell,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { Client } from '@/types/client';
import { Plan } from '@/types/plan';
import { GlassCard } from '../shared/GlassCard';

interface WorkoutProgressProps {
  client: Client;
  activePlan: Plan | null;
  completedPlans: Plan[];
  currentDay: number;
  planProgress: number;
}

export const WorkoutProgress = ({
  client,
  activePlan,
  completedPlans,
  currentDay,
  planProgress
}: WorkoutProgressProps) => {
  if (!activePlan) return null;

  const todayExercises = activePlan.days[`day_${currentDay}`]?.exercises || [];
  const completedExercises = todayExercises.filter(ex => 
    ex.type === 'regular' ? ex.exercise.logged === 1 :
    ex.type === 'superset' && ex.exercises.every(e => e.logged === 1)
  ).length;

  return (
    <GlassCard 
      variant="frosted"
      gradient="from-secondary-500/10 via-background to-primary-500/10"
      className="h-full"
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Today's Workout</h3>
            <p className="text-sm text-foreground/60">
              Day {currentDay} of 7
            </p>
          </div>
          <Button
            className="bg-primary-500/10"
            endContent={<ArrowRight size={16} />}
            href="/workouts"
            as="a"
          >
            Go to Workouts
          </Button>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-primary-500/5 space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-500" />
              <p className="text-sm font-medium">Week</p>
            </div>
            <p className="text-2xl font-semibold">{completedPlans.length + 1}</p>
          </div>

          <div className="p-4 rounded-xl bg-secondary-500/5 space-y-2">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-secondary-500" />
              <p className="text-sm font-medium">Exercises</p>
            </div>
            <p className="text-2xl font-semibold">
              {client.total_exercises_completed}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-success-500/5 space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-success-500" />
              <p className="text-sm font-medium">Sets</p>
            </div>
            <p className="text-2xl font-semibold">{client.total_sets_played}</p>
          </div>
        </div>

        {/* Today's Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Today's Progress</p>
            <span className="text-sm text-foreground/60">
              {completedExercises} of {todayExercises.length} exercises
            </span>
          </div>
          <Progress
            value={(completedExercises / todayExercises.length) * 100}
            size="lg"
            radius="lg"
            classNames={{
              base: "h-8",
              indicator: "bg-gradient-to-r from-primary-500 to-secondary-500"
            }}
          />
        </div>

        {/* Exercises List */}
        <div className="space-y-3">
          {todayExercises.map((exercise, index) => (
            <motion.div
              key={index}
              className="p-4 rounded-xl bg-content/5 flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-content/10">
                  <Dumbbell className="w-4 h-4 text-foreground/60" />
                </div>
                <div>
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
              </div>
              {exercise.type === 'regular' ? (
                exercise.exercise.logged === 1 && (
                  <CheckCircle2 className="w-5 h-5 text-success-500" />
                )
              ) : (
                exercise.exercises.every(e => e.logged === 1) && (
                  <CheckCircle2 className="w-5 h-5 text-success-500" />
                )
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};