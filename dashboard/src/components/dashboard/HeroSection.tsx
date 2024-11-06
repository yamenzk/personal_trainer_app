// src/components/dashboard/HeroSection.tsx
import { Avatar, Chip } from "@nextui-org/react";
import { Target, TrendingDown, TrendingUp, Dumbbell, ArrowRight } from 'lucide-react';
import { Client } from '@/types/client';
import { Plan } from '@/types/plan';
import { GlassCard } from '../shared/GlassCard';


interface HeroSectionProps {
  client: Client;
  activePlan: Plan | null;
  currentDay: number;
  planProgress: number;
}

export const HeroSection = ({ client, activePlan, currentDay, planProgress }: HeroSectionProps) => {
  const firstName = client.client_name?.split(' ')[0] ?? 'there';
  const weightChange = client.weight[0]?.weight - client.current_weight;
  const isWeightLoss = client.goal === 'Weight Loss';
  const isWeightGain = client.goal === 'Weight Gain';
  const isMaintenance = client.goal === 'Maintenance';
  
  // Get contextual greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <GlassCard 
    variant="gradient" 
    gradient="from-primary-500/20 via-transparent to-secondary-500/20"
    intensity="heavy"
  >
      <div className="p-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full blur-3xl" />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar and Greeting */}
          <div className="flex items-center gap-4">
            <div className="scale-in-center">
              <Avatar
                src={client.image}
                className="w-20 h-20"
                showFallback
                name={client.client_name ?? ''}
              />
            </div>

            <div className="space-y-1">
              <p className="text-foreground/60">{getGreeting()},</p>
              <h1 className="text-2xl font-bold">{firstName}!</h1>
              <div className="flex items-center gap-2">
                {client.goal && (
                  <Chip
                    size="sm"
                    className={
                      isWeightLoss ? "bg-success-500/10 text-success-500" :
                      isWeightGain ? "bg-warning-500/10 text-warning-500" :
                      "bg-primary-500/10 text-primary-500"
                    }
                  >
                    {client.goal}
                  </Chip>
                )}
                {client.equipment && (
                  <Chip
                    size="sm"
                    className="bg-secondary-500/10 text-secondary-500"
                  >
                    {client.equipment}
                  </Chip>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {/* Weight Progress */}
            <div className={`p-4 rounded-xl ${
              isWeightLoss ? "bg-success-500/10" :
              isWeightGain ? "bg-warning-500/10" :
              "bg-primary-500/10"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  isWeightLoss ? "bg-success-500/20" :
                  isWeightGain ? "bg-warning-500/20" :
                  "bg-primary-500/20"
                }`}>
                  <Target className={
                    isWeightLoss ? "w-5 h-5 text-success-500" :
                    isWeightGain ? "w-5 h-5 text-warning-500" :
                    "w-5 h-5 text-primary-500"
                  } />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">
                    {isWeightLoss ? 'Weight Lost' :
                     isWeightGain ? 'Weight Gained' :
                     'Weight Change'}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold">
                      {Math.abs(weightChange).toFixed(1)} kg
                    </p>
                    {weightChange !== 0 && (
                      weightChange < 0 ? 
                        <TrendingDown className="w-4 h-4 text-success-500" /> :
                        <TrendingUp className="w-4 h-4 text-warning-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Plan */}
            {activePlan && (
              <div className="p-4 rounded-xl bg-secondary-500/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary-500/20">
                    <Dumbbell className="w-5 h-5 text-secondary-500" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Current Plan</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-lg font-semibold">Day {currentDay}</p>
                      <p className="text-xs text-foreground/60">of 7</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Overall Progress */}
            <div className="p-4 rounded-xl bg-content/5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-foreground/60">Overall Progress</p>
                  <p className="text-sm font-medium">{Math.round(planProgress)}%</p>
                </div>
                <div className="h-2 bg-content/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-1000"
                    style={{ width: `${planProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};