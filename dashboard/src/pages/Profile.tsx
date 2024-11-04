import { useState } from 'react';
import { 
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Avatar,
  Tabs,
  Tab,
  Chip,
  Progress,
  Tooltip,
} from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User,
  Mail,
  Phone,
  Flag,
  Target,
  Activity,
  Dumbbell,
  Scale,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  Medal,
  Calendar,
  Clock,
  AlertTriangle,
  Settings,
  Check,
  ArrowRight,
  ChevronRight,
  LucideIcon,
  Flame,
  Trophy,
  Crown,
  Zap,
  Heart,
  ArrowUp,
  Save,
  Info,
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useClientData } from '../hooks/useClientData';
import { GlassCard } from '../components/shared/GlassCard';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import OnboardingWizard from '../components/onboarding/OnboardingWizard';
import { updateWeight } from '../utils/api';
import { Membership } from '@/types/membership';
import { Client } from '@/types/client';

const WeightModal = ({ 
  isOpen, 
  onClose, 
  onWeightLogged, 
  clientId, 
  currentWeight 
}: {
  isOpen: boolean;
  onClose: () => void;
  onWeightLogged: () => void;
  clientId: string;
  currentWeight: number;
}) => {
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!weight) {
      setError('Please enter your weight');
      return;
    }

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      setError('Please enter a valid weight');
      return;
    }

    setLoading(true);
    try {
      await updateWeight(clientId, weightValue);
      onWeightLogged();
      onClose();
    } catch (err) {
      setError('Failed to log weight');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      backdrop="blur"
      scrollBehavior="inside"
      placement="center"
      classNames={{
        backdrop: "bg-background/70",
        base: "bg-background/95",
        body: "p-0",
        closeButton: "hover:bg-white/5 active:bg-white/10",
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" }
          },
          exit: {
            y: 20,
            opacity: 0,
            transition: { duration: 0.2, ease: "easeIn" }
          }
        }
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 px-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">Track Weight</h3>
                  <p className="text-sm text-foreground/60">
                    Keep track of your progress
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-primary-500/10">
                  <Scale className="w-5 h-5 text-primary-500" />
                </div>
              </div>
            </ModalHeader>
            
            <ModalBody className="px-6 py-4 space-y-6">
              {/* Current Weight Display */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-secondary-500/5">
                <div className="p-3 rounded-xl bg-primary-500/10">
                  <Trophy className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Current Weight</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-semibold">{currentWeight}</p>
                    <p className="text-sm text-foreground/60">kg</p>
                  </div>
                </div>
              </div>

              {/* Weight Input */}
              <div className="space-y-4">
                <Input
                  type="number"
                  label="New Weight"
                  placeholder="Enter weight in kg"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                    setError('');
                  }}
                  errorMessage={error}
                  startContent={
                    <Scale className="text-default-400 flex-shrink-0" size={16} />
                  }
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">kg</span>
                    </div>
                  }
                  classNames={{
                    input: "text-lg",
                    inputWrapper: [
                      "bg-content/10",
                      "backdrop-blur-sm",
                      "hover:bg-content/20",
                      "group-data-[focused=true]:bg-content/20",
                    ],
                  }}
                />
              </div>

              {/* Tips */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary-500/5">
                <div className="p-2 rounded-lg bg-secondary-500/10">
                  <Info className="w-4 h-4 text-secondary-500" />
                </div>
                <p className="text-sm text-foreground/60">
                  For best results, weigh yourself at the same time each day
                </p>
              </div>
            </ModalBody>
            
            <ModalFooter className="px-6 py-4">
              <Button 
                variant="light" 
                onPress={onClose}
                className="font-medium"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={loading}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 font-medium"
                startContent={!loading && <Save size={18} />}
              >
                Save Weight
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const StatsCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  color 
}: {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon: any;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}) => (
  <GlassCard className="overflow-visible hover:scale-105 transition-transform duration-300">
    <div className="p-6 relative">
      <div className={`absolute -top-3 -right-3 w-12 h-12 rounded-xl 
        bg-${color}-500/10 flex items-center justify-center shadow-lg 
        border border-${color}-500/20`}
      >
        <Icon className={`w-6 h-6 text-${color}-500`} />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm text-foreground/60">{title}</h3>
        <div className="space-y-1">
          <p className="text-2xl font-semibold">{value}</p>
          {change && (
            <div className="flex items-center gap-1 text-sm">
              {trend && (
                trend === 'up' ? 
                  <ChevronUp className="w-4 h-4 text-success-500" /> :
                  <ChevronDown className="w-4 h-4 text-danger-500" />
              )}
              <span className="text-foreground/60">{change}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  </GlassCard>
);

const WeightChart = ({ 
  weights, 
  targetWeight,
  onAddWeight 
}: {
  weights: { date: string; weight: number; }[];
  targetWeight: number;
  onAddWeight: () => void;
}) => {
  const chartData = weights
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(w => ({
      date: format(new Date(w.date), 'MMM d'),
      weight: w.weight,
      target: targetWeight
    }));

  return (
    <GlassCard>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Weight Progress</h3>
            <p className="text-sm text-foreground/60">Track your journey</p>
          </div>
          <Button
            className="bg-primary-500/10 text-primary-500"
            endContent={<Scale size={16} />}
            onPress={onAddWeight}
          >
            Log Weight
          </Button>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                stroke="currentColor" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="currentColor"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background/95 backdrop-blur-md p-3 rounded-lg border border-border shadow-xl">
                        <p className="text-sm text-foreground/60">{payload[0].payload.date}</p>
                        <p className="text-base font-semibold">
                          {payload[0].value} kg
                        </p>
                        <p className="text-sm text-success-500">
                          Target: {payload[0].payload.target} kg
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="var(--primary)"
                fill="url(#weightGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="var(--success)"
                strokeDasharray="5 5"
                fill="none"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-primary-500/5 space-y-1">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary-500" />
              <p className="text-sm text-foreground/60">Latest</p>
            </div>
            <p className="text-lg font-semibold">
              {weights[weights.length - 1]?.weight} kg
            </p>
          </div>

          <div className="p-4 rounded-xl bg-success-500/5 space-y-1">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-success-500" />
              <p className="text-sm text-foreground/60">Target</p>
            </div>
            <p className="text-lg font-semibold">
              {targetWeight} kg
            </p>
          </div>

          <div className="p-4 rounded-xl bg-secondary-500/5 space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-secondary-500" />
              <p className="text-sm text-foreground/60">Change</p>
            </div>
            <p className="text-lg font-semibold">
              {(weights[weights.length - 1]?.weight - weights[0]?.weight).toFixed(1)} kg
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

const AchievementsSection = ({ membership, client }: { membership: Membership; client: Client }) => {
  type AchievementColor = "primary" | "secondary" | "success" | "warning" | "danger";

  const achievements: Array<{
    title: string;
    description: string;
    icon: LucideIcon;
    progress: number;
    color: AchievementColor;
  }> = [
    {
      title: "Weight Loss Champion",
      description: "Lost over 5kg since starting",
      icon: Trophy,
      progress: 75,
      color: "warning"
    },
    {
      title: "Consistency King",
      description: "Logged weight for 7 days straight",
      icon: Crown,
      progress: 100,
      color: "success"
    },
    {
      title: "Workout Warrior",
      description: `Completed ${client.workouts} workouts`,
      icon: Zap,
      progress: 60,
      color: "primary"
    },
    {
      title: "Goal Setter",
      description: "Set and achieved first target",
      icon: Target,
      progress: 45,
      color: "secondary"
    }
  ];


  return (
    <GlassCard>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Achievements</h3>
            <p className="text-sm text-foreground/60">Your fitness milestones</p>
          </div>
          <div className="flex items-center gap-2">
            <Medal className="w-5 h-5 text-warning-500" />
            <span className="font-medium">4 Unlocked</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className={`p-4 rounded-xl bg-${achievement.color}-500/5 border border-${achievement.color}-500/10`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg bg-${achievement.color}-500/10`}>
                  <achievement.icon className={`w-5 h-5 text-${achievement.color}-500`} />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-foreground/60">{achievement.description}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <Progress 
                      value={achievement.progress} 
                      color={achievement.color}
                      size="sm"
                      radius="full"
                      classNames={{
                        base: "h-2",
                        indicator: achievement.progress === 100 ? "bg-gradient-to-r from-success-500 to-success-300" : undefined
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

const ProfileStats = ({ client }: { client: Client }) => {
  const stats = [
    {
      title: "Total Workouts",
      value: `${client.workouts}`,
      change: "+2 this week",
      trend: "up" as const,
      icon: Dumbbell,
      color: "primary" as const
    },
    {
      title: "Daily Meals",
      value: `${client.meals}`,
      change: "On track",
      icon: Flame,
      color: "secondary" as const
    },
    {
      title: "Weight Change",
      value: `${(client.weight[client.weight.length - 1].weight - client.weight[0].weight).toFixed(1)} kg`,
      change: "Since start",
      trend: "down" as const,
      icon: Scale,
      color: "success" as const
    },
    {
      title: "Activity Level",
      value: client.activity_level,
      change: "Consistent",
      icon: Activity,
      color: "warning" as const
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

const MembershipCard = ({ membership }: { membership: Membership }) => {
  const daysRemaining = differenceInDays(new Date(membership.end), new Date());
  const progress = ((differenceInDays(new Date(), new Date(membership.start)) / 
    differenceInDays(new Date(membership.end), new Date(membership.start))) * 100);

  return (
    <GlassCard gradient="from-primary-500/10 via-background to-secondary-500/10">
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{membership.package}</h3>
            <p className="text-sm text-foreground/60">Active Membership</p>
          </div>
          <Chip
            className="bg-success-500/10 text-success-500"
            startContent={<Heart size={14} />}
          >
            Active
          </Chip>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-500/10">
              <Calendar className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium">{daysRemaining} days remaining</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary-500/10">
              <Clock className="w-4 h-4 text-secondary-500" />
              <span className="text-sm font-medium">
                {format(new Date(membership.start), 'MMM d')} - {format(new Date(membership.end), 'MMM d, yyyy')}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Membership Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress 
              value={progress}
              color="primary"
              size="md"
              radius="lg"
              classNames={{
                base: "h-3",
                indicator: "bg-gradient-to-r from-primary-500 to-secondary-500"
              }}
            />
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default function Profile() {
  const { loading, error, client, membership, refreshData } = useClientData();
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          </div>
          <div className="text-foreground/60 font-medium">Loading your profile...</div>
        </div>
      </div>
    );
  }

  if (error || !client || !membership) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <GlassCard className="max-w-md w-full p-6 text-center space-y-4 bg-danger/10">
          <div className="w-16 h-16 rounded-full bg-danger/20 text-danger mx-auto flex items-center justify-center">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-semibold text-danger">Error Loading Profile</h3>
          <p className="text-danger/80">{error || 'Failed to load profile data'}</p>
          <Button 
            color="danger" 
            variant="flat" 
            onPress={() => window.location.reload()}
          >
            Try Again
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] 
          bg-gradient-to-b from-primary-500/20 via-secondary-500/20 to-transparent 
          blur-3xl opacity-50" 
        />
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      <div className="container mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <GlassCard gradient="from-primary-500/5 via-background to-secondary-500/5">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar
                  src={client.image}
                  className="w-24 h-24"
                  showFallback
                  name={client.client_name}
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-success-500 flex items-center justify-center border-4 border-background">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h1 className="text-2xl font-bold">{client.client_name}</h1>
                  <p className="text-foreground/60">
                    Member since {format(new Date(client.creation), 'MMMM d, yyyy')}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-500/10">
                    <Calendar className="w-4 h-4 text-primary-500" />
                    <span className="text-sm">{client.age} years</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary-500/10">
                    <User className="w-4 h-4 text-secondary-500" />
                    <span className="text-sm">{client.gender}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success-500/10">
                    <Flag className="w-4 h-4 text-success-500" />
                    <span className="text-sm">{client.nationality}</span>
                  </div>
                </div>
              </div>

              {client.allow_preference_update === 1 && (
                <Button
                  color="primary"
                  variant="flat"
                  startContent={<Settings size={18} />}
                  onPress={() => setShowPreferences(true)}
                  className="md:self-start"
                >
                  Update Preferences
                </Button>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Quick Stats */}
        <ProfileStats client={client} />

        {/* Membership Info */}
        <MembershipCard membership={membership} />

        {/* Weight Progress */}
        <WeightChart
          weights={client.weight}
          targetWeight={client.target_weight}
          onAddWeight={() => setShowWeightModal(true)}
        />

        {/* Achievements */}
        <AchievementsSection
          membership={membership}
          client={client}
        />

        {/* Personal Info */}
        <GlassCard>
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/10">
                    <Mail className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Email</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary-500/10">
                    <Phone className="w-5 h-5 text-secondary-500" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Mobile</p>
                    <p className="font-medium">{client.mobile}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success-500/10">
                    <Flag className="w-5 h-5 text-success-500" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Nationality</p>
                    <p className="font-medium">{client.nationality}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/10">
                    <Target className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Goal</p>
                    <p className="font-medium">{client.goal}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary-500/10">
                    <Activity className="w-5 h-5 text-secondary-500" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Activity Level</p>
                    <p className="font-medium">{client.activity_level}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success-500/10">
                    <Dumbbell className="w-5 h-5 text-success-500" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Equipment</p>
                    <p className="font-medium">{client.equipment}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-primary-500/5 space-y-1">
                <p className="text-sm text-foreground/60">Height</p>
                <p className="text-lg font-semibold">{client.height} cm</p>
              </div>

              <div className="p-4 rounded-xl bg-secondary-500/5 space-y-1">
                <p className="text-sm text-foreground/60">Target Weight</p>
                <p className="text-lg font-semibold">{client.target_weight} kg</p>
              </div>

              <div className="p-4 rounded-xl bg-success-500/5 space-y-1">
                <p className="text-sm text-foreground/60">Daily Meals</p>
                <p className="text-lg font-semibold">{client.meals} meals</p>
              </div>

              <div className="p-4 rounded-xl bg-warning-500/5 space-y-1">
                <p className="text-sm text-foreground/60">Weekly Workouts</p>
                <p className="text-lg font-semibold">{client.workouts} sessions</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Training History */}
        <GlassCard>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Training History</h3>
                <p className="text-sm text-foreground/60">Your fitness journey progress</p>
              </div>
              <Button
                variant="flat"
                color="secondary"
                endContent={<ArrowRight size={16} />}
              >
                View Details
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-primary-500/5 space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  <p className="text-sm text-foreground/60">Active Days</p>
                </div>
                <p className="text-2xl font-semibold">24</p>
                <p className="text-sm text-success-500">+3 this week</p>
              </div>

              <div className="p-4 rounded-xl bg-secondary-500/5 space-y-2">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-secondary-500" />
                  <p className="text-sm text-foreground/60">Workouts Completed</p>
                </div>
                <p className="text-2xl font-semibold">48</p>
                <p className="text-sm text-success-500">92% completion rate</p>
              </div>

              <div className="p-4 rounded-xl bg-success-500/5 space-y-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-success-500" />
                  <p className="text-sm text-foreground/60">Total Calories Burned</p>
                </div>
                <p className="text-2xl font-semibold">24,680</p>
                <p className="text-sm text-success-500">Avg. 1,028 per session</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {[
                { label: "Chest", value: 12, change: "+2" },
                { label: "Back", value: 14, change: "+3" },
                { label: "Legs", value: 10, change: "+1" },
                { label: "Arms", value: 12, change: "+2" },
              ].map((stat, index) => (
                <div key={index} className="p-4 rounded-xl bg-content/5 space-y-2">
                  <p className="text-sm text-foreground/60">{stat.label} Workouts</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">{stat.value}</p>
                    <Chip 
                      size="sm" 
                      className="bg-success-500/10 text-success-500"
                      startContent={<ArrowUp size={12} />}
                    >
                      {stat.change}
                    </Chip>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Program Overview */}
        <GlassCard>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Program Overview</h3>
                <p className="text-sm text-foreground/60">Current training focus and goals</p>
              </div>
              <Chip
                className="bg-primary-500/10 text-primary-500"
                startContent={<Target size={14} />}
              >
                In Progress
              </Chip>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/10">
                    <Target className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Primary Goal</p>
                    <p className="font-medium">{client.goal}</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground/60">Goal Progress</span>
                    <span>65%</span>
                  </div>
                  <Progress
                    value={65}
                    color="primary"
                    size="md"
                    radius="lg"
                    classNames={{
                      base: "h-3",
                      indicator: "bg-gradient-to-r from-primary-500 to-secondary-500"
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  {['Strength', 'Endurance', 'Weight Loss'].map((tag, index) => (
                    <Chip
                      key={index}
                      className="bg-content/10"
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-content/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-primary-500" />
                      <p className="font-medium">Weekly Targets</p>
                    </div>
                    <Chip size="sm" className="bg-success-500/10 text-success-500">
                      On Track
                    </Chip>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-sm text-foreground/60">Workouts</p>
                      <p className="font-medium">4 of 5 completed</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Calories</p>
                      <p className="font-medium">2,400 / 3,000</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-warning-500/5 border border-warning-500/10">
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-warning-500" />
                    <div>
                      <p className="font-medium">Next Assessment</p>
                      <p className="text-sm text-foreground/60">In 2 weeks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showWeightModal && (
          <WeightModal
            isOpen={showWeightModal}
            onClose={() => setShowWeightModal(false)}
            onWeightLogged={refreshData}
            clientId={client.name}
            currentWeight={client.current_weight}
          />
        )}

        {showPreferences && (
          <OnboardingWizard 
            clientData={client} 
            onComplete={() => {
              setShowPreferences(false);
              refreshData();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}