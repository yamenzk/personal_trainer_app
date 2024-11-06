// src/components/dashboard/HeroSection.tsx
import { Avatar, Chip, Progress, Card, CardBody } from "@nextui-org/react";
import { 
  Target, 
  TrendingDown, 
  TrendingUp, 
  Dumbbell, 
  Clock,
  Award,
  Activity
} from 'lucide-react';
import { Client } from '@/types/client';
import { Plan } from '@/types/plan';
import { useTheme } from '../../contexts/ThemeContext';

interface HeroSectionProps {
  client: Client;
  activePlan: Plan | null;
  currentDay: number;
  planProgress: number;
}

export const HeroSection = ({ client, activePlan, currentDay, planProgress }: HeroSectionProps) => {
  const { theme } = useTheme();
  const firstName = client.client_name?.split(' ')[0] ?? 'there';
  const weightChange = client.weight[0]?.weight - client.current_weight;
  const isWeightLoss = client.goal === 'Weight Loss';
  const isWeightGain = client.goal === 'Weight Gain';
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = [
    {
      icon: Activity,
      label: "Weekly Progress",
      value: `${Math.round(planProgress)}%`,
      color: "primary",
      background: "bg-primary-500/10",
      textColor: "text-primary-500"
    },
    {
      icon: Target,
      label: isWeightLoss ? "Weight Lost" : isWeightGain ? "Weight Gained" : "Weight Change",
      value: `${Math.abs(weightChange).toFixed(1)} kg`,
      color: isWeightLoss ? "success" : isWeightGain ? "warning" : "secondary",
      background: isWeightLoss ? "bg-success-500/10" : isWeightGain ? "bg-warning-500/10" : "bg-secondary-500/10",
      textColor: isWeightLoss ? "text-success-500" : isWeightGain ? "text-warning-500" : "text-secondary-500"
    },
    {
      icon: Clock,
      label: "Current Day",
      value: `Day ${currentDay}/7`,
      color: "secondary",
      background: "bg-secondary-500/10",
      textColor: "text-secondary-500"
    },
    {
      icon: Award,
      label: "Level",
      value: `${Math.floor(client.total_exercises_completed / 50) + 1}`,
      color: "warning",
      background: "bg-warning-500/10",
      textColor: "text-warning-500"
    }
  ];

  return (
    <Card 
      isBlurred={theme === 'dark'} 
      className="border-none"
    >
      <CardBody className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full blur-xl opacity-20" />
              <Avatar
                src={client.image}
                className="w-24 h-24 text-large ring-2 ring-offset-2 ring-offset-background ring-primary-500/30"
                showFallback
                name={client.client_name ?? ''}
                classNames={{
                  base: "bg-gradient-to-br from-primary-500/20 to-secondary-500/20",
                  icon: "text-white/90"
                }}
              />
            </div>
            <div className="space-y-1">
              <div className="space-y-0.5">
                <p className="text-foreground-500">{getGreeting()}</p>
                <h1 className="text-2xl font-bold tracking-tight">{firstName}!</h1>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {client.goal && (
                  <Chip
                    startContent={<Award className="w-3 h-3" />}
                    variant="flat"
                    color={
                      isWeightLoss ? "success" :
                      isWeightGain ? "warning" : "primary"
                    }
                    size="sm"
                  >
                    {client.goal}
                  </Chip>
                )}
                {client.equipment && (
                  <Chip
                    startContent={<Dumbbell className="w-3 h-3" />}
                    variant="flat"
                    color="secondary"
                    size="sm"
                  >
                    {client.equipment}
                  </Chip>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  shadow="none"
                  className="bg-content-100/5"
                >
                  <CardBody className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl ${stat.background}`}>
                        <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                      </div>
                      <div>
                        <p className="text-sm text-foreground-500">{stat.label}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-semibold">{stat.value}</p>
                          {stat.label.includes('Weight') && weightChange !== 0 && (
                            weightChange < 0 ? 
                              <TrendingDown className="w-4 h-4 text-success-500" /> :
                              <TrendingUp className="w-4 h-4 text-warning-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};