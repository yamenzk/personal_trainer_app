// src/components/dashboard/MuscleGroupsChart.tsx
import { useMemo } from 'react';
import { 
  Dumbbell, 
  Heart,  // For chest
  Activity, // For overall balance
  ArrowDown, // For back
  ArrowUp,  // For shoulders
  Circle,   // For biceps
  CircleDot,// For triceps
  MoveDown,  // For legs
  Crown
} from 'lucide-react';
import { Client } from '@/types/client';
import { Card, CardBody, Divider, Progress, Chip } from '@nextui-org/react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarGrid,
  Legend
} from 'recharts';

interface MuscleGroupsChartProps {
  client: Client;
}

export const MuscleGroupsChart = ({ client }: MuscleGroupsChartProps) => {
  const muscleData = useMemo(() => [
    {
      name: 'Chest',
      exercises: client.total_chest_exercises,
      fill: '#0ea5e9',
      icon: Heart,
      gradient: 'from-primary-500/40 to-primary-500/70'
    },
    {
      name: 'Back',
      exercises: client.total_lats_exercises,
      fill: '#22c55e',
      icon: ArrowDown,
      gradient: 'from-success-500/40 to-success-500/70'
    },
    {
      name: 'Shoulders',
      exercises: client.total_shoulders_exercises,
      fill: '#8b5cf6',
      icon: ArrowUp,
      gradient: 'from-secondary-500/40 to-secondary-500/70'
    },
    {
      name: 'Biceps',
      exercises: client.total_biceps_exercises,
      fill: '#f97316',
      icon: Circle,
      gradient: 'from-warning-500/40 to-warning-500/70'
    },
    {
      name: 'Triceps',
      exercises: client.total_triceps_exercises,
      fill: '#ef4444',
      icon: CircleDot,
      gradient: 'from-danger-500/40 to-danger-500/70'
    },
    {
      name: 'Legs',
      exercises: client.total_hamstrings_exercises,
      fill: '#06b6d4',
      icon: MoveDown,
      gradient: 'from-cyan-500/20 to-cyan-500/5'
    }
  ].sort((a, b) => b.exercises - a.exercises), [client]);

  const totalExercises = muscleData.reduce((acc, curr) => acc + curr.exercises, 0);
  const mostWorkedMuscle = muscleData[0];
  
  const getPercentage = (value: number) => {
    if (!totalExercises) return 0;
    return ((value / totalExercises) * 100).toFixed(0);
  };
  
  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardBody className="p-4 space-y-6">
        {/* Main Layout */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left Side Muscle Cards */}
          <div className="col-span-3 space-y-2">
            {muscleData.slice(0, 3).map((muscle, index) => (
              <Card
                key={muscle.name}
                shadow="none"
                className={`bg-gradient-to-r ${muscle.gradient} border border-content1`}
              >
                <CardBody className="p-2">
                  <div className="flex flex-col items-center gap-1 text-center relative">
                    {index === 0 && (
                      <Chip
                      size="sm"  // Make the chip smaller
                      variant="solid"
                      className="absolute -top-1 -right-1 z-10 px-1 py-4 bg-background-100/50 text-xs ring-2 ring-yellow-500"  // Adjust padding and text size for a more compact chip
                    >
                      <Crown className="w-4 h-4 text-yellow-500" />
                    </Chip>
                    )}
                    <div className="p-1.5 rounded-lg bg-content2/50">
                      <muscle.icon className="w-4 h-4" style={{ color: muscle.fill }} />
                    </div>
                    <p className="text-xs font-medium">{muscle.name}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-semibold">
                        {getPercentage(muscle.exercises)}
                      </span>
                      <span className="text-xs text-white">%</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Center Chart */}
          <div className="col-span-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="30%"
                  outerRadius="100%"
                  barSize={12}
                  data={muscleData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarGrid gridType="circle" strokeOpacity={0.1} />
                  <RadialBar
                    dataKey="exercises"
                    cornerRadius={8}
                    label={false}
                    background={{ fill: 'var(--nextui-content2)', opacity: 0.2 }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Side Muscle Cards */}
          <div className="col-span-3 space-y-2">
            {muscleData.slice(3).map((muscle) => (
              <Card
                key={muscle.name}
                shadow="none"
                className={`bg-gradient-to-r ${muscle.gradient} border border-content1`}
              >
                <CardBody className="p-2">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <div className="p-1.5 rounded-lg bg-content2/50">
                      <muscle.icon className="w-4 h-4" style={{ color: muscle.fill }} />
                    </div>
                    <p className="text-xs font-medium">{muscle.name}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-semibold">
                        {getPercentage(muscle.exercises)}
                      </span>
                      <span className="text-xs text-white">%</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Total Summary */}
        <Card 
          shadow="none" 
          className="bg-gradient-to-r from-success-500 to-success-400 border-none"
        >
          <CardBody className="py-2 px-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">Total Exercises</span>
              </div>
              <span className="text-lg font-semibold text-white">{totalExercises}</span>
            </div>
          </CardBody>
        </Card>
      </CardBody>
    </Card>
  );
};