// src/components/dashboard/QuickStats.tsx
import { Activity, Flame, Target, Scale, ArrowUp, ArrowDown } from 'lucide-react';
import { Client } from '@/types/client';
import { Card, CardBody } from '@nextui-org/react';
import { useTheme } from '../../contexts/ThemeContext';

interface QuickStatsProps {
  client: Client;
}

export const QuickStats = ({ client }: QuickStatsProps) => {
  const { theme } = useTheme();

  const todayStats = [
    {
      icon: Activity,
      label: 'Activity Level',
      value: client.activity_level,
      color: 'primary',
      change: {
        value: `${client.total_exercises_completed} exercises completed`,
        trend: 'up'
      }
    },
    {
      icon: Flame,
      label: 'Calories Burned',
      value: `${(client.total_calories_burned / 1000).toFixed(1)}k`,
      color: 'secondary',
      change: {
        value: `${client.total_sets_played} sets completed`,
        trend: 'up'
      }
    },
    {
      icon: Target,
      label: 'Goal Progress',
      value: client.goal === 'Weight Loss' 
        ? `${Math.abs(client.weight[0].weight - client.current_weight).toFixed(1)} kg lost`
        : client.goal === 'Weight Gain'
          ? `${Math.abs(client.weight[0].weight - client.current_weight).toFixed(1)} kg gained`
          : 'Maintaining',
      color: 'success',
      change: {
        value: `${Math.round((client.current_weight - client.target_weight) / (client.weight[0].weight - client.target_weight) * 100)}% complete`,
        trend: 'up'
      }
    },
    {
      icon: Scale,
      label: 'Current Weight',
      value: `${client.current_weight} kg`,
      color: 'warning',
      change: {
        value: `Target: ${client.target_weight} kg`,
        trend: client.current_weight > client.target_weight ? 'down' : 'up'
      }
    }
  ];

  return (
    <>
      {todayStats.map((stat, index) => (
        <Card
          key={stat.label}
          isBlurred={theme === 'dark'}
          shadow="sm"
          className="hover:scale-102 transition-all duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardBody className="p-4">
            <div className="space-y-2">
              <h3 className="text-sm text-foreground/60">{stat.label}</h3>
              <div className="space-y-1">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <div className="flex items-center gap-1 text-sm">
                  {stat.change.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4 text-success-500" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-danger-500" />
                  )}
                  <span className="text-foreground/60">{stat.change.value}</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </>
  );
};