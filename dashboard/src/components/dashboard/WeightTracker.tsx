// src/components/dashboard/WeightTracker.tsx
import { Card, CardBody, CardHeader, Button, Chip, Tooltip, Divider } from "@nextui-org/react";
import { 
  Scale, 
  TrendingUp, 
  TrendingDown,
  Target,
  AlertCircle,
  ChevronRight
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

  return (
    <Card isBlurred={theme === 'dark'} shadow="sm">
      <CardHeader className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Weight Progress</h3>
          <p className="text-sm text-foreground-500">
            {getProgressMessage()}
          </p>
        </div>
        <Button
          color="primary"
          variant="flat"
          endContent={<Scale size={16} />}
          onPress={onLogWeight}
          size="sm"
        >
          Log Weight
        </Button>
      </CardHeader>

      <CardBody className="gap-6">
        {/* Weight Overview */}
        <div className="grid grid-cols-3 gap-4">
          {weightStats.map((stat, index) => (
            <Card
              key={stat.label}
              shadow="none"
              className={`bg-content-100/5 border border-foreground/20 ${
                stat.label === 'Current' ? 'relative overflow-visible' : ''
              }`}
            >
              <CardBody className="p-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-foreground-500">{stat.label} Weight</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-semibold">{stat.value}</span>
                    {stat.label === 'Current' && (
                      <div className="absolute -top-2 -right-2">
                        {/* <Chip
                          size="sm"
                          variant="flat"
                          color={evaluateProgress() === 'good' ? 'success' : 
                                evaluateProgress() === 'bad' ? 'danger' : 
                                'primary'}
                          className="shadow-sm"
                        >
                          {client.goal}
                        </Chip> */}
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Chart Section */}
        <Card className="bg-content-100/5" shadow="none">
          <CardBody className="p-0">
            <div className="p-4 border-b border-foreground/20">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Weight Trend</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors.line }} />
                    <span className="text-xs text-foreground-500">Current</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: chartColors.reference }} />
                    <span className="text-xs text-foreground-500">Target</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[300px] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-content-100/90 backdrop-blur-sm border border-content-100/20 rounded-lg p-2 shadow-lg">
                            <p className="text-sm font-medium">{payload[0].payload.date}</p>
                            <p className="text-sm text-foreground-500">
                              {payload[0].value} kg
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine 
                    y={client.target_weight} 
                    stroke={chartColors.reference}
                    strokeDasharray="3 3" 
                    strokeWidth={2}
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
                      fill: '#ffffff',
                      r: 4
                    }}
                    activeDot={{
                      stroke: chartColors.line,
                      strokeWidth: 2,
                      fill: '#ffffff',
                      r: 6
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* BMI Section */}
        <Card shadow="none" className="bg-content-100/5">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-content/10">
                  <Scale className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">BMI Score</span>
                    <Tooltip content="Body Mass Index based on your current weight and height">
                      <AlertCircle className="w-4 h-4 text-foreground-500 cursor-help" />
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-semibold">{bmi.toFixed(1)}</span>
                    <Chip
                      size="sm"
                      color={bmiCategory.color as any}
                      variant="flat"
                    >
                      {bmiCategory.label}
                    </Chip>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-foreground-500" />
            </div>
          </CardBody>
        </Card>
      </CardBody>
    </Card>
  );
};