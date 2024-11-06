// src/components/dashboard/WeightTracker.tsx
import { Button, Chip, Tooltip } from "@nextui-org/react";
import { 
  Scale, 
  TrendingUp, 
  TrendingDown,
  Target,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { Client } from '@/types/client';
import { GlassCard } from '../shared/GlassCard';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface WeightTrackerProps {
  client: Client;
  onLogWeight: () => void;
}

export const WeightTracker = ({ client, onLogWeight }: WeightTrackerProps) => {
  const weightData = client.weight
    .map(w => ({
      date: format(new Date(w.date), 'MMM d'),
      weight: w.weight,
      target: client.target_weight
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const isWeightLoss = client.goal === 'Weight Loss';
  const isWeightGain = client.goal === 'Weight Gain';
  const isMaintenance = client.goal === 'Maintenance';

  // Calculate BMI
  const heightInMeters = client.height / 100;
  const bmi = client.current_weight / (heightInMeters * heightInMeters);
  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'warning' };
    if (bmi < 25) return { label: 'Healthy', color: 'success' };
    if (bmi < 30) return { label: 'Overweight', color: 'warning' };
    return { label: 'Obese', color: 'danger' };
  };
  const bmiCategory = getBmiCategory(bmi);

  const weightStats = [
    { label: 'Starting', value: `${client.weight[0].weight} kg` },
    { label: 'Current', value: `${client.current_weight} kg` },
    { label: 'Target', value: `${client.target_weight} kg` }
  ];

  // Add these color helper functions
  const getChartColors = (type: 'Weight Loss' | 'Weight Gain' | 'Maintenance' | 'Muscle Building') => {
    switch (type) {
      case 'Weight Loss':
        return {
          gradient: [
            { offset: '0%', color: 'var(--success)', opacity: 0.4 },
            { offset: '100%', color: 'var(--success)', opacity: 0.1 }
          ],
          line: 'var(--success)',
          reference: 'var(--success)'
        };
      case 'Weight Gain':
        return {
          gradient: [
            { offset: '0%', color: 'var(--warning)', opacity: 0.4 },
            { offset: '100%', color: 'var(--warning)', opacity: 0.1 }
          ],
          line: 'var(--warning)',
          reference: 'var(--warning)'
        };
      default:
        return {
          gradient: [
            { offset: '0%', color: 'var(--primary)', opacity: 0.4 },
            { offset: '100%', color: 'var(--primary)', opacity: 0.1 }
          ],
          line: 'var(--primary)',
          reference: 'var(--primary)'
        };
    };
  };

  const chartColors = getChartColors(client.goal);

  return (
    <GlassCard 
      variant="frosted"
      className="h-full"
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Weight Progress</h3>
            <p className="text-sm text-foreground/60">
              {isWeightLoss ? 'Weight Loss Journey' :
               isWeightGain ? 'Weight Gain Journey' :
               'Weight Maintenance'}
            </p>
          </div>
          <Button
            className={`bg-${isWeightLoss ? 'success' : 
                          isWeightGain ? 'warning' : 
                          'primary'}-500/10`}
            endContent={<Scale size={16} />}
            onPress={onLogWeight}
          >
            Log Weight
          </Button>
        </div>

        {/* Weight Stats */}
        <div className="grid grid-cols-3 gap-4">
          {weightStats.map((stat, index) => (
            <div
              key={stat.label}
              className="fade-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-4 rounded-xl bg-content/5 space-y-1">
                <p className="text-sm text-foreground/60">{stat.label}</p>
                <p className="font-semibold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Weight Chart */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weightData}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  {chartColors.gradient.map((stop, index) => (
                    <stop
                      key={index}
                      offset={stop.offset}
                      stopColor={stop.color}
                      stopOpacity={stop.opacity}
                    />
                  ))}
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--content)"
                opacity={0.1}
              />
              <XAxis 
                dataKey="date" 
                stroke="currentColor" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="currentColor"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={40}
                domain={['auto', 'auto']}
                dx={-10}
              />
              <ReferenceLine 
                y={client.target_weight} 
                stroke={chartColors.reference}
                strokeDasharray="3 3" 
                strokeWidth={2}
                label={{
                  value: 'Target',
                  fill: chartColors.reference,
                  fontSize: 12,
                  position: 'right'
                }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke={chartColors.line}
                strokeWidth={3}
                fill="url(#weightGradient)"
                dot={{
                  stroke: chartColors.line,
                  strokeWidth: 2,
                  fill: 'var(--background)',
                  r: 4
                }}
                activeDot={{
                  stroke: chartColors.line,
                  strokeWidth: 2,
                  fill: 'var(--background)',
                  r: 6
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* BMI Info */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-content/5">
          <div className="p-2 rounded-lg bg-content/10">
            <Scale className="w-5 h-5 text-foreground/60" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">BMI: {bmi.toFixed(1)}</p>
              <Chip
                size="sm"
                className={`bg-${bmiCategory.color}-500/10 text-${bmiCategory.color}-500`}
              >
                {bmiCategory.label}
              </Chip>
            </div>
            <p className="text-sm text-foreground/60 mt-1">
              Based on your height of {client.height}cm and current weight
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};