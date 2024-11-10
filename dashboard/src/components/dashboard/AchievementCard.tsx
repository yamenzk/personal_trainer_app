// src/components/dashboard/AchievementCard.tsx
import { useMemo } from 'react';
import { 
  Trophy, Crown, Award, Star, Medal, TrendingUp, 
  Dumbbell, Flame, Scale, Zap, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { Card, CardBody, CardHeader, CircularProgress, Button, ScrollShadow } from '@nextui-org/react';
import { Client } from '@/types/client';
import { useTheme } from '../../contexts/ThemeContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

  const progressStats = [
    {
      title: "Exercises",
      icon: Dumbbell,
      color: "primary",
      level: Math.floor(client.total_exercises_completed / 50) + 1,
      progress: milestoneProgress.exercises.progress,
      current: client.total_exercises_completed,
      next: milestoneProgress.exercises.next
    },
    {
      title: "Sets",
      icon: TrendingUp,
      color: "secondary",
      level: Math.floor(client.total_sets_played / 100) + 1,
      progress: milestoneProgress.sets.progress,
      current: client.total_sets_played,
      next: milestoneProgress.sets.next
    },
    {
      title: "Reps",
      icon: Zap,
      color: "success",
      level: Math.floor(client.total_reps_played / 1000) + 1,
      progress: milestoneProgress.reps.progress,
      current: client.total_reps_played,
      next: milestoneProgress.reps.next
    }
  ];

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardBody className="p-4 space-y-6">
        {/* Main Achievement Card */}
        <Card className="border-none bg-content2/70">
          <CardHeader className="flex justify-between items-center">
            <div className="space-y-1">
              {/* <h3 className="text-xl font-semibold">Achievements</h3> */}
              <p className="text-sm text-foreground-500">Track your progress</p>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-warning" />
              <span className="text-xl font-semibold">
                {Math.floor(client.total_exercises_completed / 50) + 1}
              </span>
            </div>
          </CardHeader>

          <CardBody className="gap-6">
            {/* Progress Circles */}
            <div className="grid grid-cols-3 gap-4">
              {progressStats.map((stat) => (
                <div key={stat.title} className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <CircularProgress
                      value={stat.progress}
                      strokeWidth={4}
                      showValueLabel={false}
                      color={stat.color as any}
                      classNames={{
                        svg: "w-24 h-24 drop-shadow-md",
                        indicator: "stroke-foreground",
                        track: "stroke-default-300",
                        value: "font-semibold text-xl",
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                      <span className="text-xl font-bold">{stat.level}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{stat.title}</p>
                    <p className="text-sm text-foreground-500">
                      {formatNumber(stat.current)} / {formatNumber(stat.next)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Achievements Carousel */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground-500">Special Achievements</h4>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    isIconOnly
                    variant="flat"
                    className="achievement-prev"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    isIconOnly
                    variant="flat"
                    className="achievement-next"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={16}
                slidesPerView={2}
                navigation={{
                  nextEl: '.achievement-next',
                  prevEl: '.achievement-prev',
                }}
                className="achievement-swiper"
              >
                {oneTimeAchievements.map(({ id, name, description, icon: Icon, color, unlocked }) => (
                  <SwiperSlide key={id}>
                    <Card
                      shadow="none"
                      className={`bg-content1/5 transition-opacity ${!unlocked && 'opacity-50'}`}
                    >
                      <CardBody className="p-3">
                        <div className="flex items-start gap-3">
                          <div className={`
                            w-10 shrink-0 h-10 rounded-lg flex items-center justify-center
                            ${unlocked ? `bg-${color}-500` : 'bg-default-200'}
                          `}>
                            <Icon 
                              className={unlocked ? 'text-white' : 'text-default-500'} 
                              size={20} 
                            />
                          </div>
                          <div>
                            <p className="font-medium">{name}</p>
                            <p className="text-xs text-foreground-500">{description}</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Calories Summary */}
            <Card shadow="none" className="bg-gradient-to-r from-danger-500/10 to-danger-500/20">
              <CardBody className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-danger" />
                    <span className="font-medium">Total Calories</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-semibold">
                      {formatNumber(client.total_calories_burned)}
                    </span>
                    <span className="text-sm text-foreground-500">kcal</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </CardBody>
        </Card>
      </CardBody>
    </Card>
  );
};