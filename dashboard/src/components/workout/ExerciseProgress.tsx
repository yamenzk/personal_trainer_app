// src/components/workout/ExerciseProgress.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Weight } from 'lucide-react';
import type { PerformanceEntry } from '@/types/api';

interface ExerciseProgressProps {
  performance: PerformanceEntry[];
}

export const ExerciseProgress: React.FC<ExerciseProgressProps> = ({ performance }) => {
  const sortedPerformance = [...performance].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const latestPerformance = sortedPerformance[sortedPerformance.length - 1];
  const previousPerformance = sortedPerformance[sortedPerformance.length - 2];
  const weightChange = latestPerformance && previousPerformance
    ? latestPerformance.weight - previousPerformance.weight
    : 0;

  return (
    <div className="space-y-4">
      {/* Latest Performance */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Weight className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Latest Weight</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(latestPerformance?.date || '').toLocaleDateString()}
            </span>
          </div>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-bold">{latestPerformance?.weight || 0}</span>
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">kg</span>
            {weightChange !== 0 && (
              <span className={`ml-2 text-sm ${weightChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {weightChange > 0 ? '+' : ''}{weightChange} kg
              </span>
            )}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Max Reps</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold">
              {latestPerformance?.reps || 0}
            </span>
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">reps</span>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      {sortedPerformance.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sortedPerformance}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <div className="text-sm font-medium">
                        {new Date(data.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Weight: {data.weight}kg
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Reps: {data.reps}
                      </div>
                    </div>
                  );
                }}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ strokeWidth: 2, r: 4 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};