// src/components/dashboard/ProgressCard.tsx
interface ProgressCardProps {
    title: string;
    current: number;
    target: number;
    unit: string;
    color: string;
  }
  
  export const ProgressCard: React.FC<ProgressCardProps> = ({
    title,
    current,
    target,
    unit,
    color
  }) => {
    const percentage = Math.min((current / target) * 100, 100);
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
        <h3 className="font-medium text-gray-600 dark:text-gray-300">{title}</h3>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold">{current}{unit}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">of {target}{unit}</span>
        </div>
        <div className="mt-3 h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <div
            className={`h-full rounded-full ${color} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };