// src/pages/Profile/index.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User,
  Mail,
  Phone,
  Flag,
  Calendar,
  Target,
  Settings,
  Trophy,
  Dumbbell,
  Clock,
  Gauge,
  ChevronRight,
  Activity
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useWizard } from '@/providers/WizardProvider';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

const ProfileSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    delay?: number;
  }> = ({ title, icon, children, delay = 0 }) => (
    <div 
      className="animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          {icon}
        </div>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
        {children}
      </div>
    </div>
  );

interface ProfileItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  onClick?: () => void;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ icon, label, value, onClick }) => (
  <div 
    className={`flex items-center space-x-4 p-4 ${
      onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''
    }`}
    onClick={onClick}
  >
    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
    {onClick && <ChevronRight className="w-5 h-5 text-gray-400" />}
  </div>
);

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, trend, trendUp }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
        {icon}
      </div>
      {trend && (
        <span className={`text-sm ${
          trendUp ? 'text-green-500' : 'text-red-500'
        }`}>
          {trend}
        </span>
      )}
    </div>
    <p className="mt-3 text-2xl font-semibold">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

const WeightChart: React.FC<{ data: { weight: number; date: string }[] }> = ({ data }) => {
  const chartHeight = 120;
  const chartWidth = 300;
  const maxWeight = Math.max(...data.map(d => d.weight));
  const minWeight = Math.min(...data.map(d => d.weight));
  const range = maxWeight - minWeight;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((point.weight - minWeight) / range) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative h-[120px] w-full overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[...Array(5)].map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={i * (chartHeight / 4)}
            x2={chartWidth}
            y2={i * (chartHeight / 4)}
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-gray-200 dark:text-gray-700"
          />
        ))}

        {/* Weight line */}
        <polyline
          points={points}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Y-axis labels */}
      <div className="absolute top-0 left-2 h-full flex flex-col justify-between text-xs text-gray-400">
        <span>{Math.round(maxWeight)}kg</span>
        <span>{Math.round(minWeight)}kg</span>
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { client, logout, membership } = useAuthStore();
  const { openWizard } = useWizard();

  if (!client || !membership) return null;

  const age = parseInt(client.age);
  const weightHistory = client.weight;
  const lastWeight = weightHistory[weightHistory.length - 1]?.weight;
  const startWeight = weightHistory[0]?.weight;
  const weightChange = lastWeight - startWeight;
  const progressPercentage = Math.abs(
    ((lastWeight - startWeight) / (client.target_weight - startWeight)) * 100
  ).toFixed(0);

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Header */}
      <div className="relative h-48 -mx-4 -mt-6">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-purple-500" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center space-x-4">
            <img
              src={client.image}
              alt={client.client_name}
              className="w-20 h-20 rounded-2xl border-2 border-white object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold">{client.client_name}</h1>
              <p className="text-white/80">Member since {new Date(client.creation).toLocaleDateString()}</p>
              <div className="flex items-center mt-2 text-sm">
                <span className="px-3 py-1 bg-white/20 rounded-full">
                  {membership.package} Package
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<Target className="w-5 h-5 text-blue-500" />}
          label="Progress to Goal"
          value={`${progressPercentage}%`}
          trend={`${Math.abs(weightChange).toFixed(0)} kg ${weightChange < 0 ? 'lost' : 'gained'}`}
          trendUp={client.goal === 'Weight Loss' ? weightChange < 0 : weightChange > 0}
        />
        <StatCard
          icon={<Activity className="w-5 h-5 text-purple-500" />}
          label="Workouts/Week"
          value={client.workouts}
        />
      </div>

      {/* Weight Progress */}
      <ProfileSection title="Weight Progress" icon={<Gauge className="w-5 h-5 text-red-500" />} delay={200}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Weight</p>
              <p className="text-2xl font-semibold">{lastWeight} kg</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Target Weight</p>
              <p className="text-2xl font-semibold">{client.target_weight} kg</p>
            </div>
          </div>
          <WeightChart data={client.weight} />
        </div>
      </ProfileSection>

      {/* Personal Information */}
      <ProfileSection title="Personal Information" icon={<User className="w-5 h-5 text-blue-500" />} delay={200}>
        <ProfileItem
          icon={<User className="w-5 h-5 text-blue-500" />}
          label="Full Name"
          value={client.client_name}
        />
        <div className="h-px bg-gray-100 dark:bg-gray-700" />
        <ProfileItem
          icon={<Mail className="w-5 h-5 text-blue-500" />}
          label="Email"
          value={client.email}
        />
        <div className="h-px bg-gray-100 dark:bg-gray-700" />
        <ProfileItem
          icon={<Phone className="w-5 h-5 text-blue-500" />}
          label="Phone"
          value={client.mobile}
        />
        <div className="h-px bg-gray-100 dark:bg-gray-700" />
        <ProfileItem
          icon={<Flag className="w-5 h-5 text-blue-500" />}
          label="Nationality"
          value={client.nationality}
        />
        <div className="h-px bg-gray-100 dark:bg-gray-700" />
        <ProfileItem
          icon={<Calendar className="w-5 h-5 text-blue-500" />}
          label="Age"
          value={`${age} years`}
        />
      </ProfileSection>

      {/* Training Preferences */}
      <ProfileSection title="Training Preferences" icon={<Dumbbell className="w-5 h-5 text-purple-500" />} delay={300}>
  <div className="grid grid-cols-2 gap-4 p-4">
    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
      <div className="flex items-center space-x-2">
        <Target className="w-5 h-5 text-purple-500" />
        <p className="font-medium">{client.goal}</p>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Goal</p>
    </div>
    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
      <div className="flex items-center space-x-2">
        <Dumbbell className="w-5 h-5 text-purple-500" />
        <p className="font-medium">{client.equipment}</p>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Equipment</p>
    </div>
    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
      <div className="flex items-center space-x-2">
        <Activity className="w-5 h-5 text-purple-500" />
        <p className="font-medium">{client.activity_level}</p>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Activity Level</p>
    </div>
    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
      <div className="flex items-center space-x-2">
        <Clock className="w-5 h-5 text-purple-500" />
        <p className="font-medium">{client.workouts}/week</p>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Workout Frequency</p>
    </div>
    {client?.allow_preference_update === 1 && (
      <button
        onClick={() => openWizard('preferences')}
        className="col-span-2 flex items-center justify-center space-x-2 p-4 bg-purple-500 text-white rounded-xl shadow-lg hover:bg-purple-600 transition-colors"
      >
        <Settings className="w-5 h-5" />
        <span className="text-sm font-medium">Update Preferences</span>
      </button>
    )}
  </div>
</ProfileSection>


      {/* Membership */}
      <ProfileSection title="Membership Details" icon={<Trophy className="w-5 h-5 text-yellow-500" />} delay={400}>
            <div className="p-4">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80">Current Package</p>
                    <h3 className="text-2xl font-bold mt-1">{membership.package}</h3>
                  </div>
                  <Trophy className="w-8 h-8 text-white/80" />
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80">Valid Until</p>
                      <p className="font-medium">
                        {new Date(membership.end).toLocaleDateString()}
                      </p>
                    </div>
                    <Calendar className="w-5 h-5 text-white/80" />
                  </div>
                </div>
              </div>
            </div>
          </ProfileSection>

      {/* Actions */}
      <div className="space-y-4 flex flex-col">
        <button
          onClick={() => logout()}
          className="p-4 bg-red-500 text-white rounded-xl shadow-lg font-medium hover:bg-red-600 transition-colors"
        >
          Log Out
        </button>
      </div>

    </div>
  );
};

export default Profile;