// src/components/dashboard/QuickStats.tsx
import { Activity, Flame, Target, Scale, ArrowUp, ArrowDown } from 'lucide-react';
import { Client } from '@/types/client';
import { Card, CardBody } from '@nextui-org/react';
import { useTheme } from '../../contexts/ThemeContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

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
    <Swiper
      slidesPerView="auto"
      spaceBetween={16}
      className="w-full quick-stats-slider"
      centerInsufficientSlides={true}
    >
      {todayStats.map((stat, index) => (
        <SwiperSlide
          key={stat.label}
          className="!w-[280px] first:ml-6 last:mr-6"
        >
          <Card
            isBlurred
            shadow="sm"
            className="w-full bg-content-secondary"
          >
            <CardBody className="p-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full bg-${stat.color}-500/10`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                </div>
                <div className="space-y-2 flex-1">
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
              </div>
            </CardBody>
          </Card>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};