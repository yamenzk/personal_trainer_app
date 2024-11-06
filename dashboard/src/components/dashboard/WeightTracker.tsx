// src/components/dashboard/WeightTracker.tsx
import { motion } from "framer-motion";
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
          <div className="p-4 rounded-xl bg-content/5 space-y-1">
            <p className="text-sm text-foreground/60">Starting</p>
            <p className="font-semibold">{client.weight[0].weight} kg</p>
          </div>
          <div className="p-4 rounded-xl bg-content/5 space-y-1">
            <p className="text-sm text-foreground/60">Current</p>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{client.current_weight} kg</p>
              {client.current_weight !== client.weight[0].weight && (
                client.current_weight < client.weight[0].weight ?
                  <TrendingDown className="w-4 h-4 text-success-500" /> :
                  <TrendingUp className="w-4 h-4 text-warning-500" />
              )}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-content/5 space-y-1">
            <p className="text-sm text-foreground/60">Target</p>
            <p className="font-semibold">{client.target_weight} kg</p>
          </div>
        </div>

        {/* Weight Chart */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weightData}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="0%" 
                    stopColor={
                      isWeightLoss ? "var(--success)" :
                      isWeightGain ? "var(--warning)" :
                      "var(--primary)"
                    } 
                    stopOpacity={0.2} 
                  />
                  <stop 
                    offset="100%" 
                    stopColor={
                      isWeightLoss ? "var(--success)" :
                      isWeightGain ? "var(--warning)" :
                      "var(--primary)"
                    } 
                    stopOpacity={0} 
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-content/10" />
              <XAxis 
                dataKey="date" 
                stroke="currentColor" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="currentColor"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={40}
                domain={['auto', 'auto']}
              />
              <ReferenceLine 
                y={client.target_weight} 
                stroke={
                  isWeightLoss ? "var(--success)" :
                  isWeightGain ? "var(--warning)" :
                  "var(--primary)"
                }
                strokeDasharray="3 3" 
                label="Target" 
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke={
                  isWeightLoss ? "var(--success)" :
                  isWeightGain ? "var(--warning)" :
                  "var(--primary)"
                }
                fill="url(#weightGradient)"
                strokeWidth={2}
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