// src/components/dashboard/WeightTracker.tsx
import { Card, CardBody, Button, Chip, Divider } from "@nextui-org/react";
import { 
  Scale, 
  TrendingDown,
  TrendingUp,
  Target,
  Activity,
  ChevronRight,
  InfoIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { Client } from '@/types/client';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip as RechartsTooltip
} from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

interface WeightTrackerProps {
  client: Client;
  onLogWeight: () => void;
}

export const WeightTracker = ({ client, onLogWeight }: WeightTrackerProps) => {
  const { theme } = useTheme();
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

  // Add progress evaluation logic
  const evaluateProgress = () => {
    if (client.weight.length < 2) return 'neutral';
    
    const latestWeight = client.current_weight;
    const previousWeight = client.weight[client.weight.length - 2].weight;
    const weightDiff = latestWeight - previousWeight;

    if (isWeightLoss) {
      return weightDiff < 0 ? 'good' : 'bad';
    }
    if (isWeightGain) {
      return weightDiff > 0 ? 'good' : 'bad';
    }
    if (isMaintenance) {
      return Math.abs(weightDiff) < 0.5 ? 'good' : 'bad';
    }
    return 'neutral';
  };

  // Update the color helper function
  const getChartColors = () => {
    const progress = evaluateProgress();
    
    switch (progress) {
      case 'good':
        return {
          gradient: [
            { offset: '0%', color: '#22c55e', opacity: 0.4 },  // success
            { offset: '100%', color: '#22c55e', opacity: 0.1 }
          ],
          line: '#22c55e',
          reference: '#22c55e'
        };
      case 'bad':
        return {
          gradient: [
            { offset: '0%', color: '#ef4444', opacity: 0.4 },  // danger
            { offset: '100%', color: '#ef4444', opacity: 0.1 }
          ],
          line: '#ef4444',
          reference: '#ef4444'
        };
      default:
        return {
          gradient: [
            { offset: '0%', color: '#06b6d4', opacity: 0.4 },  // neutral/primary
            { offset: '100%', color: '#06b6d4', opacity: 0.1 }
          ],
          line: '#06b6d4',
          reference: '#06b6d4'
        };
    }
  };

  const chartColors = getChartColors();

  // Add progress message
  const getProgressMessage = () => {
    if (client.weight.length < 2) return 'Start logging your weight to track progress';
    
    const latestWeight = client.current_weight;
    const previousWeight = client.weight[client.weight.length - 2].weight;
    const weightDiff = Math.abs(latestWeight - previousWeight).toFixed(1);
    
    if (isWeightLoss) {
      return latestWeight < previousWeight
        ? `Great progress! You lost ${weightDiff}kg`
        : `Gained ${weightDiff}kg - Keep working towards your goal`;
    }
    if (isWeightGain) {
      return latestWeight > previousWeight
        ? `Great progress! You gained ${weightDiff}kg`
        : `Lost ${weightDiff}kg - Keep working towards your goal`;
    }
    return Math.abs(latestWeight - previousWeight) < 0.5
      ? 'Good job maintaining your weight!'
      : 'Try to maintain a more stable weight';
  };

  // Add weight range calculations
  const weights = client.weight.map(w => w.weight);
  const minWeight = Math.min(...weights, client.target_weight);
  const maxWeight = Math.max(...weights, client.target_weight);
  const weightRange = maxWeight - minWeight;
  
  // Calculate padding for y-axis (10% of weight range)
  const yAxisPadding = weightRange * 0.1;
  const yMin = Math.max(0, Math.floor(minWeight - yAxisPadding));
  const yMax = Math.ceil(maxWeight + yAxisPadding);

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardBody className="p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-12 gap-4">
          {/* Weight Stats Card */}
          <Card className="col-span-6 border-none bg-gradient-to-br from-primary-500/5 via-primary-500/10 to-primary-500/20">
            <CardBody className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary-500/10">
                  <Target className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Weight Goals</p>
                  <p className="text-lg font-semibold">{client.goal}</p>
                </div>
              </div>
              <Divider className="my-3 bg-primary-500/10" />
              <div className="grid grid-cols-3 gap-2">
                {weightStats.map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <p className="text-xs text-foreground/60">{stat.label}</p>
                    <p className="text-base font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* BMI Card */}
          <Card className="col-span-6 border-none bg-gradient-to-br from-secondary-500/5 via-secondary-500/10 to-secondary-500/20">
            <CardBody className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-secondary-500/10">
                    <Activity className="w-5 h-5 text-secondary-500" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">BMI Score</p>
                    <p className="text-lg font-semibold">{bmi.toFixed(1)}</p>
                  </div>
                </div>
                <Chip
                  size="sm"
                  color={bmiCategory.color as any}
                  variant="flat"
                  className="capitalize"
                >
                  {bmiCategory.label}
                </Chip>
              </div>
              <Divider className="my-3 bg-secondary-500/10" />
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-xs text-foreground/60">Height</p>
                  <p className="text-base font-semibold">{client.height} cm</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-foreground/60">Weight</p>
                  <p className="text-base font-semibold">{client.current_weight} kg</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Progress Message Card */}
          <Card className="col-span-12 border-none bg-gradient-to-br from-success-500/5 via-success-500/10 to-success-500/20">
            <CardBody className="py-3 px-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-success-500/10">
                  <TrendingUp className="w-5 h-5 text-success-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Progress Update</p>
                  <p className="text-base font-medium">{getProgressMessage()}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Chart Section */}
        <div className="space-y-4 bg-content2/0 rounded-xl p-4">
          <div className="flex items-center justify-between">
            {/* <div className="space-y-1">
              <h3 className="text-xl font-semibold">Weight Progress</h3>
              <p className="text-sm text-foreground/60">
                {weightData.length > 1 
                  ? getProgressMessage()
                  : "Start logging your weight to see progress"}
              </p>
            </div> */}
            <div className="flex items-center gap-4 justify-end w-full">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chartColors.line }} />
                <span className="text-sm text-foreground/60">Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: chartColors.reference }} />
                <span className="text-sm text-foreground/60">Target</span>
              </div>
            </div>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer>
              <AreaChart 
                data={weightData} 
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    {getChartColors().gradient.map((stop, index) => (
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
                  stroke="var(--nextui-content)"
                  opacity={0.1}
                  vertical={false}
                />
                <XAxis 
                  dataKey="date" 
                  stroke="currentColor"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis 
                  stroke="currentColor"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={35}
                  domain={[yMin, yMax]}
                  tickCount={5}
                  tickFormatter={(value) => `${value.toFixed(0)}`}
                />
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <Card className="border-small border-foreground/10">
                          <CardBody className="p-2">
                            <p className="text-sm font-medium">{payload[0].payload.date}</p>
                            <div className="flex items-baseline gap-2">
                              <p className="text-lg font-semibold">
                                {Number(payload[0].value).toFixed(1)}
                              </p>
                              <p className="text-xs text-foreground/60">kg</p>
                            </div>
                          </CardBody>
                        </Card>
                      );
                    }
                    return null;
                  }}
                  cursor={{ stroke: chartColors.line, strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <ReferenceLine 
                  y={client.target_weight} 
                  stroke={chartColors.reference}
                  strokeDasharray="3 3" 
                  strokeWidth={2}
                  label={{
                    value: 'Target',
                    position: 'right',
                    fill: chartColors.reference,
                    fontSize: 12
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke={chartColors.line}
                  strokeWidth={2}
                  fill="url(#weightGradient)"
                  dot={{
                    stroke: chartColors.line,
                    strokeWidth: 2,
                    fill: 'var(--nextui-background)',
                    r: 3
                  }}
                  activeDot={{
                    stroke: chartColors.line,
                    strokeWidth: 2,
                    fill: 'var(--nextui-background)',
                    r: 4
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight Logging CTA */}
        <div className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
          <div className="relative py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <p className="font-medium text-white">
                  Track your daily weight for better progress tracking
                </p>
              </div>
              <Button
                className="bg-white text-primary-500 font-medium px-8"
                size="sm"
                onPress={onLogWeight}
              >
                Log Weight
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};