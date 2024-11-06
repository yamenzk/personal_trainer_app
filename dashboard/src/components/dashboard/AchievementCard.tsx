// src/components/dashboard/AchievementCard.tsx
import { useMemo } from 'react';
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
import { Card, CardBody, CardHeader, Chip, Progress, Tooltip } from '@nextui-org/react';
import { Client } from '@/types/client';
import { useTheme } from '../../contexts/ThemeContext';

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
  const { theme } = useTheme();

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

  const progressCards = [
    {
      title: "Total Exercises",
      icon: <Dumbbell className="text-primary" />,
      color: "primary",
      data: milestoneProgress.exercises
    },
    {
      title: "Sets",
      icon: <TrendingUp className="text-secondary" />,
      color: "secondary",
      data: milestoneProgress.sets
    },
    {
      title: "Reps",
      icon: <Zap className="text-success" />,
      color: "success",
      data: milestoneProgress.reps
    }
  ];

  return (
    <Card 
      isBlurred={theme === 'dark'} 
      shadow="sm"
    >
      <CardHeader className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Achievements</h3>
          <p className="text-sm text-foreground-500">Track your progress</p>
        </div>
        <Chip
          startContent={<Crown className="w-4 h-4" />}
          variant="shadow"
          color="warning"
        >
          Level {Math.floor(client.total_exercises_completed / 50) + 1}
        </Chip>
      </CardHeader>

      <CardBody className="gap-6">
        {/* Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {progressCards.map((card, index) => (
            <Card key={index} shadow="none" className="bg-content-100/5">
              <CardBody className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {card.icon}
                    <span className="text-sm font-medium">{card.title}</span>
                  </div>
                  <Tooltip content={`${card.data.current} / ${card.data.next}`}>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={card.color as any}
                      className="cursor-help"
                    >
                      {formatNumber(card.data.current)}
                    </Chip>
                  </Tooltip>
                </div>
                <Progress
                  value={card.data.progress}
                  color={card.color as any}
                  size="sm"
                  radius="sm"
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-foreground-500">
                  <span>Progress</span>
                  <span>{Math.round(card.data.progress)}%</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Special Achievements */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground-500">Special Achievements</h4>
          <div className="grid grid-cols-2 gap-4">
            {oneTimeAchievements.map(({ id, name, description, icon: Icon, color, unlocked }) => (
              <Card
                key={id}
                shadow="none"
                className={`bg-content-100/5 transition-opacity ${!unlocked && 'opacity-50'}`}
              >
                <CardBody className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${unlocked ? `bg-${color}-500` : 'bg-default-200'}
                    `}>
                      <Icon 
                        className={unlocked ? 'text-white' : 'text-default-500'} 
                        size={20} 
                      />
                    </div>
                    <div>
                      <p className="font-medium">{name}</p>
                      <p className="text-sm text-foreground-500">{description}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Calories Summary */}
        <Card shadow="none" className="bg-content-100/5">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-danger" />
                <span className="font-medium">Total Calories Burned</span>
              </div>
              <Chip
                size="lg"
                variant="flat"
                color="danger"
                startContent={<Scale className="w-4 h-4" />}
              >
                {formatNumber(client.total_calories_burned)} kcal
              </Chip>
            </div>
          </CardBody>
        </Card>
      </CardBody>
    </Card>
  );
};