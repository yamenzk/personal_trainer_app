
import { cn } from '@/utils/cn';
import { StatsCardProps } from '@/types/stats';

export const StatsCard = ({ icon: Icon, label, value, color, className }: StatsCardProps) => (
  <div className={cn(
    "p-4 rounded-xl transition-all",
    `bg-${color}-500/10 hover:bg-${color}-500/20`,
    className
  )}>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-${color}-500/10`}>
        <Icon className={`w-5 h-5 text-${color}-500`} />
      </div>
      <div>
        <p className="text-sm text-foreground/60">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  </div>
);