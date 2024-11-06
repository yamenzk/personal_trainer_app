// src/components/dashboard/AchievementCard.tsx
import { useMemo } from 'react';
import { motion } from "framer-motion";
import { 
  Trophy, 
  Crown, 
  Award, 
  Star, 
  Medal,
  TrendingUp,
  Dumbbell,
  Flame,
  Scale,
  Zap
} from 'lucide-react';
import { GlassCard } from '../shared/GlassCard';
import { Chip, Tooltip } from '@nextui-org/react';
import { Client } from '@/types/client';

const MILESTONES = {
  exercises: [25, 50, 100, 200, 300, 500, 1000],
  sets: [100, 250, 500, 1000, 2000, 5000],
  reps: [1000, 2500, 5000, 10000, 25000, 50000],
  calories: [5000, 10000, 25000, 50000, 100000]
} as const;

interface AchievementCardProps {
  client: Client;
}

const getNextMilestone = (current: number, milestones: number[]) => {
  return milestones.find(m => m > current) || milestones[milestones.length - 1];
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    notation: num >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1
  }).format(num);
};

export const AchievementCard = ({ client }: AchievementCardProps) => {
  // Calculate progress towards next milestones
  const milestoneProgress = useMemo(() => ({
    exercises: {
      current: client.total_exercises_completed,
      next: getNextMilestone(client.total_exercises_completed, [...MILESTONES.exercises]),
      progress: (client.total_exercises_completed / getNextMilestone(client.total_exercises_completed, [...MILESTONES.exercises])) * 100
    },
    sets: {
      current: client.total_sets_played,
      next: getNextMilestone(client.total_sets_played, [...MILESTONES.sets]),
      progress: (client.total_sets_played / getNextMilestone(client.total_sets_played, [...MILESTONES.sets])) * 100
    },
    reps: {
      current: client.total_reps_played,
      next: getNextMilestone(client.total_reps_played, [...MILESTONES.reps]),
      progress: (client.total_reps_played / getNextMilestone(client.total_reps_played, [...MILESTONES.reps])) * 100
    },
    calories: {
      current: client.total_calories_burned,
      next: getNextMilestone(client.total_calories_burned, [...MILESTONES.calories]),
      progress: (client.total_calories_burned / getNextMilestone(client.total_calories_burned, [...MILESTONES.calories])) * 100
    }
  }), [client]);

  // One-time achievements
  const oneTimeAchievements = [
    { 
      id: 'personal_record_setter',
      name: 'Record Setter',
      description: 'First exercise record',
      icon: Trophy,
      color: 'warning',
      unlocked: client.personal_record_setter === 1
    },
    {
      id: 'stress_buster',
      name: 'Stress Buster',
      description: 'All weekly workouts completed',
      icon: Award,
      color: 'success',
      unlocked: client.stress_buster === 1
    },
    {
      id: 'first_step',
      name: 'First Step',
      description: 'First workout completed',
      icon: Star,
      color: 'secondary',
      unlocked: client.first_step === 1
    },
    {
      id: 'rise_and_grind',
      name: 'Early Bird',
      description: 'Morning workouts for a week',
      icon: Medal,
      color: 'primary',
      unlocked: client.rise_and_grind === 1
    }
  ];

  return (
    <GlassCard variant="frosted" gradient="from-background via-primary-500/5 to-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Achievements</h3>
            <p className="text-sm text-foreground/60">Track your progress</p>
          </div>
          <GlassCard 
            variant="frosted" 
            className="p-2 rounded-lg"
          >
            <Crown className="w-5 h-5 text-warning-500" />
          </GlassCard>
        </div>

        {/* Milestone Progress */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Exercises */}
          <GlassCard 
            variant="secondary"
            className="col-span-2 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium">Total Exercises</span>
              </div>
              <Tooltip content="Total exercises completed">
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-primary-500/10 border-primary-500/20"
                >
                  {formatNumber(milestoneProgress.exercises.current)}
                </Chip>
              </Tooltip>
            </div>
            <div className="h-2 bg-content/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${milestoneProgress.exercises.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-foreground/60">
              <span>Current: {formatNumber(milestoneProgress.exercises.current)}</span>
              <span>Next: {formatNumber(milestoneProgress.exercises.next)}</span>
            </div>
          </GlassCard>

          {/* Sets */}
          <GlassCard 
            variant="frosted"
            className="p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-secondary-500" />
                <span className="text-sm font-medium">Sets</span>
              </div>
              <Chip
                size="sm"
                variant="flat"
                className="bg-secondary-500/10"
              >
                {formatNumber(milestoneProgress.sets.current)}
              </Chip>
            </div>
            <div className="h-2 bg-content/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-secondary-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${milestoneProgress.sets.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </GlassCard>

          {/* Reps */}
          <GlassCard 
            variant="frosted"
            className="p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-success-500" />
                <span className="text-sm font-medium">Reps</span>
              </div>
              <Chip
                size="sm"
                variant="flat"
                className="bg-success-500/10"
              >
                {formatNumber(milestoneProgress.reps.current)}
              </Chip>
            </div>
            <div className="h-2 bg-content/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-success-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${milestoneProgress.reps.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </GlassCard>
        </div>

        {/* One-time Achievements */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground/60">Special Achievements</h4>
          <div className="grid grid-cols-2 gap-3">
            {oneTimeAchievements.map(({ id, name, description, icon: Icon, color, unlocked }) => (
              <GlassCard
                key={id}
                variant={unlocked ? "gradient" : "secondary"}
                gradient={unlocked ? `from-${color}-500/10 to-background` : undefined}
                className={`
                  transition-all duration-300
                  ${!unlocked && 'opacity-50'}
                `}
              >
                <div className="p-4 flex items-start gap-3">
                  <div className={`
                    w-8 h-8 rounded-lg 
                    ${unlocked 
                      ? `bg-${color}-500 shadow-lg shadow-${color}-500/20` 
                      : 'bg-content/10'
                    }
                    flex items-center justify-center
                  `}>
                    <Icon 
                      className={unlocked ? 'text-white' : 'text-foreground/40'} 
                      size={16} 
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{name}</p>
                    <p className="text-xs text-foreground/60">{description}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <GlassCard 
          variant="frosted" 
          className="p-4 bg-content/5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-danger-500" />
              <span className="text-sm font-medium">Total Calories Burned</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary-500" />
              <span className="text-lg font-semibold">
                {formatNumber(client.total_calories_burned)} kcal
              </span>
            </div>
          </div>
        </GlassCard>
      </div>
    </GlassCard>
  );
};