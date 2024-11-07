// src/components/dashboard/MuscleGroupsChart.tsx
import { useMemo } from 'react';
import { Dumbbell } from 'lucide-react';
import { Client } from '@/types/client';
import { useTheme } from '../../contexts/ThemeContext';

import { Card, CardBody, CardHeader } from '@nextui-org/react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarGrid
} from 'recharts';

interface MuscleGroupsChartProps {
  client: Client;
}

export const MuscleGroupsChart = ({ client }: MuscleGroupsChartProps) => {
  const { theme } = useTheme();

  const muscleData = useMemo(() => [
    {
      name: 'Chest',
      exercises: client.total_chest_exercises,
      fill: '#0ea5e9' // primary-500
    },
    {
      name: 'Shoulders',
      exercises: client.total_shoulders_exercises,
      fill: '#8b5cf6' // secondary-500
    },
    {
      name: 'Back',
      exercises: client.total_lats_exercises,
      fill: '#22c55e' // success-500
    },
    {
      name: 'Biceps',
      exercises: client.total_biceps_exercises,
      fill: '#f97316' // warning-500
    },
    {
      name: 'Triceps',
      exercises: client.total_triceps_exercises,
      fill: '#ef4444' // danger-500
    },
    {
      name: 'Legs',
      exercises: client.total_hamstrings_exercises,
      fill: '#06b6d4' // cyan-500
    }
  ].sort((a, b) => b.exercises - a.exercises), [client]);

  const maxExercises = Math.max(...muscleData.map(d => d.exercises));

  return (
    <Card 
      isBlurred={theme === 'dark'} 
      className="border-none" 
      shadow="sm"
    >
      <CardHeader className="px-6 pb-0">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Muscle Focus</h3>
          <p className="text-sm text-foreground/60">Exercise distribution</p>
        </div>
      </CardHeader>
      <CardBody className="px-6">
        {/* Chart content */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="20%" 
              outerRadius="90%" 
              barSize={8} 
              data={muscleData}
            >
              <PolarGrid />
              <RadialBar
                label={{ fill: '#ffffff01', position: 'insideStart' }}
                background
                dataKey="exercises"
              />
              
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Muscle Groups Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {muscleData.map((group) => (
            <Card
              key={group.name}
              shadow="none"
              className="bg-content-100/5"
            >
              <div className="flex items-start gap-2">
                <div className="p-2 rounded-lg bg-content/10">
                  <Dumbbell className="w-4 h-4" style={{ color: group.fill }} />
                </div>
                <div>
                  <p className="text-sm font-medium">{group.name}</p>
                  <p className="text-xs text-foreground/60">
                    {group.exercises} exercises ({Math.round((group.exercises / maxExercises) * 100)}%)
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};