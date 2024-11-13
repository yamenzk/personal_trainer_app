
import { PreferenceCardProps } from '@/types';

export const PreferenceCard = ({ icon: Icon, label, value, color }: PreferenceCardProps) => (
  <div className="bg-white/10 rounded-xl p-4 space-y-2">
    <div className="flex items-center gap-2">
      <Icon className={`w-5 h-5 text-${color}-400`} />
      <span className="text-sm text-white/80">{label}</span>
    </div>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);