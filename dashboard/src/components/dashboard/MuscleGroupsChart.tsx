// src/components/dashboard/MuscleGroupsChart.tsx
import { useMemo } from 'react';
import { 
  Dumbbell, 
  ArrowDownWideNarrow,
  ChevronDown,
  ShieldHalf,
  Hand,
  LucideIcon,
  Baseline
} from 'lucide-react';
import { Client } from '@/types/client';
import { Card, CardBody, Divider, Progress } from '@nextui-org/react';
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
      icon: ShieldHalf, // Chest icon
      gradient: 'from-primary-500/20 to-primary-500/5'
    },
    {
      name: 'Back',
      exercises: client.total_lats_exercises,
      fill: '#22c55e',
      icon: ArrowDownWideNarrow, // Back icon
      gradient: 'from-success-500/20 to-success-500/5'
    },
    {
      name: 'Shoulders',
      exercises: client.total_shoulders_exercises,
      fill: '#8b5cf6',
      icon: ChevronDown, // Shoulders icon
      gradient: 'from-secondary-500/20 to-secondary-500/5'
    },
    {
      name: 'Biceps',
      exercises: client.total_biceps_exercises,
      fill: '#f97316',
      icon: Hand, // Hand icon
      gradient: 'from-warning-500/20 to-warning-500/5'
    },
    {
      name: 'Triceps',
      exercises: client.total_triceps_exercises,
      fill: '#ef4444',
      icon: Hand, // Hand icon
      gradient: 'from-danger-500/20 to-danger-500/5'
    },
    {
      name: 'Legs',
      exercises: client.total_hamstrings_exercises,
      fill: '#06b6d4',
      icon: Baseline, // Legs icon
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
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Most Trained Muscle Card */}
          <Card className="md:col-span-8 border-none bg-gradient-to-br from-primary-500/5 via-primary-500/10 to-primary-500/20">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary-500/10">
                  <Dumbbell className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Most Trained Muscle</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl font-semibold">{mostWorkedMuscle.name}</p>
                    <p className="text-sm text-foreground/60">
                      {getPercentage(mostWorkedMuscle.exercises)}% of workouts
                    </p>
                  </div>
                </div>
              </div>
              <Divider className="my-3 bg-primary-500/10" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-foreground/60">Total Exercises</p>
                  <p className="text-2xl font-semibold">{totalExercises}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary-500/10">
                  <mostWorkedMuscle.icon className="w-8 h-8 text-primary-500" />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Overall Balance Card */}
          <Card className="md:col-span-4 border-none bg-gradient-to-br from-secondary-500/5 via-secondary-500/10 to-secondary-500/20">
            <CardBody className="p-4">
              <div className="h-[140px] md:h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="40%"
                    outerRadius="100%"
                    barSize={8}
                    data={muscleData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarGrid gridType="circle" strokeOpacity={0.1} />
                    <RadialBar
                      dataKey="exercises"
                      cornerRadius={12}
                      background={{ fill: 'var(--nextui-content1)' }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Muscle Groups List */}
        <Card className="border-none">
          <CardBody className="gap-3">
            <h3 className="text-xl font-semibold">Muscle Distribution</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {muscleData.map((muscle) => (
                <Card
                  key={muscle.name}
                  shadow="none"
                  className={`bg-gradient-to-r ${muscle.gradient}`}
                >
                  <CardBody className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/10">
                        <muscle.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{muscle.name}</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-base font-semibold">
                              {getPercentage(muscle.exercises)}
                            </span>
                            <span className="text-xs text-foreground/60">%</span>
                          </div>
                        </div>
                        <Progress
                          value={muscle.exercises}
                          maxValue={Math.max(muscleData[0].exercises, 1)}
                          size="sm"
                          radius="full"
                          classNames={{
                            indicator: "bg-gradient-to-r",
                          }}
                          style={{
                            '--muscle-color': muscle.fill
                          } as any}
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </CardBody>
        </Card>
      </CardBody>
    </Card>
  );
};