// src/components/dashboard/StatCard.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUpward: boolean;
    isSuccess?: boolean;  // New prop to indicate if the trend aligns with the goal
  };
  color: 'blue' | 'purple' | 'green' | 'orange';
}

const colorMap = {
  blue: 'from-blue-500 to-blue-600 text-blue-500 bg-blue-100 dark:bg-blue-900/20',
  purple: 'from-purple-500 to-purple-600 text-purple-500 bg-purple-100 dark:bg-purple-900/20',
  green: 'from-green-500 to-green-600 text-green-500 bg-green-100 dark:bg-green-900/20',
  orange: 'from-orange-500 to-orange-600 text-orange-500 bg-orange-100 dark:bg-orange-900/20',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color
}) => {
  const colorClasses = colorMap[color];
  
  // Determine trend color based on success state or direction
  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.isSuccess !== undefined) {
      return trend.isSuccess ? 'text-green-500' : 'text-red-500';
    }
    return trend.isUpward ? 'text-green-500' : 'text-red-500';
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-xl ${colorClasses.split(' ').slice(2).join(' ')}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${getTrendColor()}`}>
            <span>{trend.value.toFixed(1)}%</span>
            <span>{trend.isUpward ? '↑' : '↓'}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-bold">{value}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{title}</p>
      </div>
    </div>
  );
};