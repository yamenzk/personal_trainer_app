import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Progress,
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Tooltip,
  cn
} from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AreaChart,
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  Activity, 
  Scale, 
  Target, 
  TrendingUp,
  Calendar,
  ChevronRight,
  Plus,
  Award,
  Dumbbell,
  Flame,
  ChevronUp,
  ChevronDown,
  Clock,
  Users,
  Zap,
  ArrowUpRight,
  Flag,
  AlertTriangle
} from 'lucide-react';
import { useClientData } from '../hooks/useClientData';
import { usePlans } from '../hooks/usePlans';
import OnboardingWizard from '../components/onboarding/OnboardingWizard';
import { Client } from '@/types/client';
import { Plan } from '@/types/plan';
import { calculatePlanProgress, updateWeight } from '../utils/api';
import { GlassCard } from '@/components/shared/GlassCard';

// Helper functions for calculations
const calculateCaloriesBurned = (plan: Plan | null, weight: number, activityLevel: string) => {
  if (!plan) return 0;
  
  const bmr = weight * 24 * 0.5;
  
  const activityMultiplier = {
    'Sedentary': 1.2,
    'Light': 1.375,
    'Moderate': 1.55,
    'Very Active': 1.725,
    'Extra Active': 1.9
  }[activityLevel] || 1.2;

  const startDate = new Date(plan.start);
  const today = new Date();
  const daysActive = Math.max(1, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  return Math.round(bmr * activityMultiplier * daysActive);
};

const calculateWorkoutStats = (plan: Plan | null) => {
  if (!plan) return { completed: 0, total: 0, change: 0 };
  
  const today = new Date();
  const startDate = new Date(plan.start);
  const daysActive = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const weeksActive = Math.max(1, Math.floor(daysActive / 7));
  
  const totalPossibleWorkouts = weeksActive * parseInt(plan.config.weekly_workouts);
  
  // Get completed workouts
  const completedWorkouts = Object.values(plan.days)
    .filter(day => day.completed === true)
    .length;

  // Get workout counts for current and previous weeks
  const currentWeek = Math.ceil(daysActive / 7);
  
  const getDayNumber = (dayKey: string) => parseInt(dayKey.replace('day_', ''));
  
  const thisWeekWorkouts = Object.entries(plan.days)
    .filter(([dayKey, day]) => {
      const dayNum = getDayNumber(dayKey);
      return dayNum <= currentWeek * 7 && dayNum > (currentWeek - 1) * 7 && day.completed === true;
    })
    .length;

  const lastWeekWorkouts = Object.entries(plan.days)
    .filter(([dayKey, day]) => {
      const dayNum = getDayNumber(dayKey);
      return dayNum <= (currentWeek - 1) * 7 && dayNum > (currentWeek - 2) * 7 && day.completed === true;
    })
    .length;

  return {
    completed: completedWorkouts,
    total: totalPossibleWorkouts,
    change: thisWeekWorkouts - lastWeekWorkouts
  };
};

// Helper function for calories per day calculation
const calculateDailyCalories = (totalCalories: number, plan: Plan | null): number => {
  if (!plan) return 0;
  const daysCount = Object.keys(plan.days).length;
  return daysCount > 0 ? Math.round(totalCalories / daysCount) : 0;
};

const calculateAchievement = (client: Client, planProgress: number) => {
  const weightProgress = client.weight.length > 1 
    ? (client.current_weight - client.target_weight) / 
      (client.weight[0].weight - client.target_weight)
    : 0;
  
  const score = (weightProgress + planProgress) / 2;
  
  if (score >= 0.8) return { level: "Gold", change: "Top 10%" };
  if (score >= 0.6) return { level: "Silver", change: "Top 25%" };
  if (score >= 0.4) return { level: "Bronze", change: "Top 50%" };
  return { level: "Starting", change: "Keep going!" };
};

const getDaysCount = (plan: Plan) => {
  return Object.keys(plan.days).length;
};
// Weight Modal Component
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
      className="bg-content/95 backdrop-blur-lg"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut"
            }
          },
          exit: {
            y: 20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn"
            }
          }
        }
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Log Weight</h3>
          <p className="text-sm text-foreground/60">Keep track of your progress</p>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {/* Current Weight Display */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-primary-500/20">
              <div className="p-3 rounded-lg bg-primary-500/20">
                <Scale className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <p className="text-sm text-foreground/60">Current Weight</p>
                <p className="text-xl font-semibold">{currentWeight} kg</p>
              </div>
            </div>

            {/* Weight Input */}
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
                <Scale className="text-default-400 pointer-events-none flex-shrink-0" size={16} />
              }
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">kg</span>
                </div>
              }
              classNames={{
                input: "bg-transparent",
                inputWrapper: "bg-content/50 backdrop-blur-xl"
              }}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="light" 
            onPress={onClose}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={loading}
            className="bg-gradient-to-r from-primary-500 to-secondary-500"
          >
            Save Weight
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Helper Components
const StatCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  color 
}: {
  title: string;
  value: string;
  change: string;
  trend?: 'up' | 'down';
  icon: any;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}) => (
  <GlassCard 
    className="overflow-visible hover:scale-105 transition-transform duration-300"
    gradient="from-content/5 to-background"
  >
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
          <div className="flex items-center gap-1 text-sm">
            {trend && (
              trend === 'up' ? 
                <ChevronUp className="w-4 h-4 text-success-500" /> :
                <ChevronDown className="w-4 h-4 text-danger-500" />
            )}
            <span className="text-foreground/60">{change}</span>
          </div>
        </div>
      </div>
    </div>
  </GlassCard>
);

const WeightStat = ({ 
  label, 
  value, 
  icon: Icon,
  color
}: {
  label: string;
  value: string;
  icon: any;
  color: 'primary' | 'warning' | 'success';
}) => (
  <div className={`p-4 rounded-xl bg-${color}-500/5 border border-${color}-500/10`}>
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 text-${color}-500`} />
        <span className="text-sm text-foreground/60">{label}</span>
      </div>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  </div>
);
// Main Dashboard Component
export default function Dashboard() {
  const navigate = useNavigate();
  const { loading, error, client, plans, refreshData } = useClientData();
  const { activePlan, currentDay } = usePlans(plans ?? []);
  const [showWeightModal, setShowWeightModal] = useState(false);

  useEffect(() => {
    if (client?.request_weight === 1) {
      setShowWeightModal(true);
    }
  }, [client?.request_weight]);

  // Check for onboarding needs
  const needsOnboarding = client && (
    !client.date_of_birth ||
    !client.gender ||
    !client.email ||
    !client.nationality ||
    !client.meals ||
    !client.workouts ||
    !client.activity_level ||
    !client.equipment ||
    !client.height ||
    !client.weight.length ||
    !client.target_weight
  );

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          </div>
          <div className="text-foreground/60 font-medium">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Card className="max-w-md w-full p-6 text-center space-y-4 bg-danger/10">
          <div className="w-16 h-16 rounded-full bg-danger/20 text-danger mx-auto flex items-center justify-center">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-semibold text-danger">Error Loading Dashboard</h3>
          <p className="text-danger/80">{error || 'Failed to load dashboard data'}</p>
          <Button 
            color="danger" 
            variant="flat" 
            onPress={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  // Calculate metrics
  const planProgress = activePlan ? calculatePlanProgress(activePlan) : 0;
  const initialWeight = client.weight[0]?.weight ?? client.current_weight;
  const totalWeightLoss = initialWeight - client.current_weight;
  const remainingWeight = Math.max(0, client.current_weight - client.target_weight);
  const goalProgress = Math.min(100, Math.max(0, (totalWeightLoss / (initialWeight - client.target_weight)) * 100));

  // Calculate stats
  const workoutStats = calculateWorkoutStats(activePlan);
  const caloriesBurned = calculateCaloriesBurned(activePlan, client.current_weight, client.activity_level);
  const achievement = calculateAchievement(client, planProgress);

  const stats = [
    {
      title: "Active Streak",
      value: `${workoutStats.completed} days`,
      change: `${workoutStats.change >= 0 ? '+' : ''}${workoutStats.change} this week`,
      trend: workoutStats.change >= 0 ? 'up' as const : 'down' as const,
      icon: Zap,
      color: "primary" as const
    },
    {
      title: "Calories Burned",
      value: `${(caloriesBurned / 1000).toFixed(1)}k`,
      change: "Based on activity",
      icon: Flame,
      color: "danger" as const
    },
    {
      title: "Weight Change",
      value: `${Math.abs(totalWeightLoss).toFixed(1)} kg`,
      change: totalWeightLoss <= 0 ? "Gained" : "Lost",
      trend: totalWeightLoss <= 0 ? 'down' as const : 'up' as const,
      icon: Scale,
      color: "success" as const
    },
    {
      title: "Achievement",
      value: achievement.level,
      change: achievement.change,
      icon: Award,
      color: "warning" as const
    }
  ];

  // Format weight data for chart
  const weightData = client.weight
    .map(w => ({
      date: new Date(w.date).toLocaleDateString(),
      weight: w.weight,
      target: client.target_weight
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const firstName = client.client_name?.split(' ')[0] ?? 'there';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      {needsOnboarding && (
        <OnboardingWizard 
          clientData={client} 
          onComplete={refreshData}
        />
      )}

      <div className="min-h-screen w-full bg-background relative overflow-x-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] 
            bg-gradient-to-b from-primary-500/20 via-secondary-500/20 to-transparent 
            blur-3xl opacity-50" 
          />
          <div className="absolute inset-0 backdrop-blur-3xl" />
        </div>

        {/* Main content */}
        <motion.div 
          className="container mx-auto p-4 space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Welcome Section */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            variants={itemVariants}
          >
            {/* Welcome Card */}
            <GlassCard className="lg:col-span-2">
              <div className="p-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar
                      src={client.image}
                      className="w-20 h-20"
                      showFallback
                      name={client.client_name}
                    />
                    {achievement.level !== "Starting" && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full 
                        bg-warning-500 flex items-center justify-center text-white"
                      >
                        <Award size={16} />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="space-y-1">
                      <h1 className="text-2xl font-bold">
                        Welcome back, {firstName}!
                      </h1>
                      <p className="text-foreground/60">
                        {activePlan 
                          ? "Here's your progress for this week" 
                          : "Let's start your fitness journey"}
                      </p>
                    </div>
                    {activePlan && (
                      <div className="flex flex-wrap gap-3 mt-3">
                        <div className="px-3 py-1 rounded-full bg-primary-500/10 
                          text-primary-500 text-sm font-medium flex items-center gap-2"
                        >
                          <Calendar size={14} />
                          Day {currentDay} of 7
                        </div>
                        <div className="px-3 py-1 rounded-full bg-success-500/10 
                          text-success-500 text-sm font-medium flex items-center gap-2"
                        >
                          <Target size={14} />
                          {Math.round(planProgress)}% Complete
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Quick Actions Card */}
            <GlassCard 
  className="flex flex-col"
  gradient="from-background via-background to-content/5"
>
              <div className="p-6 h-full flex flex-col">
                <h3 className="text-sm font-medium text-foreground/60 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3 flex-1">
                  <Button
                    className="h-auto flex-col gap-2 p-4 bg-primary-500/10 hover:bg-primary-500/20"
                    onClick={() => setShowWeightModal(true)}
                  >
                    <Scale className="w-5 h-5 text-primary-500" />
                    <span className="text-xs font-medium">Log Weight</span>
                  </Button>
                  <Button
                    className="h-auto flex-col gap-2 p-4 bg-secondary-500/10 hover:bg-secondary-500/20"
                    onClick={() => navigate('/workouts')}
                  >
                    <Dumbbell className="w-5 h-5 text-secondary-500" />
                    <span className="text-xs font-medium">View Workout</span>
                  </Button>
                  <Button
                    className="h-auto flex-col gap-2 p-4 bg-success-500/10 hover:bg-success-500/20"
                    onClick={() => navigate('/meals')}
                  >
                    <Flame className="w-5 h-5 text-success-500" />
                    <span className="text-xs font-medium">Meal Plan</span>
                  </Button>
                  <Button
                    className="h-auto flex-col gap-2 p-4 bg-warning-500/10 hover:bg-warning-500/20"
                    onClick={() => navigate('/profile')}
                  >
                    <Users className="w-5 h-5 text-warning-500" />
                    <span className="text-xs font-medium">Profile</span>
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            variants={itemVariants}
          >
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </motion.div>

          {/* Charts and Details */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            variants={itemVariants}
          >
            {/* Weight Progress Chart */}
            <GlassCard 
                className="lg:col-span-2"
                gradient="from-content/5 to-background"
              >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Weight Progress</h3>
                    <p className="text-sm text-foreground/60">Track your journey</p>
                  </div>
                  <Button
                    className="bg-primary-500/10 text-primary-500"
                    endContent={<Plus size={16} />}
                    onClick={() => setShowWeightModal(true)}
                  >
                    Log Weight
                  </Button>
                </div>

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weightData}>
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
                              <div className="bg-background/80 backdrop-blur-md p-3 
                                rounded-lg border border-border shadow-xl"
                              >
                                <p className="text-sm text-foreground/60">
                                  {payload[0].payload.date}
                                </p>
                                <p className="text-base font-semibold">
                                  Weight: {payload[0].value} kg
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
                  <WeightStat
                    label="Starting Weight"
                    value={`${initialWeight} kg`}
                    icon={Scale}
                    color="primary"
                  />
                  <WeightStat
                    label="Current Weight"
                    value={`${client.current_weight} kg`}
                    icon={Target}
                    color="warning"
                  />
                  <WeightStat
                    label="Target Weight"
                    value={`${client.target_weight} kg`}
                    icon={Flag}
                    color="success"
                  />
                </div>
              </div>
            </GlassCard>

            {/* Active Plan Card */}
            <GlassCard 
  className="h-full"
  gradient="from-content/5 to-background"
>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Active Plan</h3>
                  {activePlan && (
                    <Button
                      className="bg-primary-500/10 text-primary-500"
                      size="sm"
                      endContent={<ChevronRight size={16} />}
                      onClick={() => navigate('/workouts')}
                    >
                      Details
                    </Button>
                  )}
                </div>

                {activePlan ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/60">Progress</span>
                        <span className="text-sm font-medium">
                          {Math.round(planProgress)}%
                        </span>
                      </div>
                      <Progress 
                        value={planProgress}
                        size="md"
                        radius="sm"
                        classNames={{
                          base: "h-3",
                          indicator: "bg-gradient-to-r from-primary-500 to-secondary-500"
                        }}
                      />
                    </div>

                    {/* Active Plan Stats */}
                    <div className="space-y-4">
                      {/* Today's Progress */}
                      <div className="p-4 rounded-xl bg-gradient-to-br from-primary-500/5 to-secondary-500/5 border border-primary-500/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary-500/10">
                              <Activity className="w-5 h-5 text-primary-500" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Today's Goal</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-xl font-semibold">
                                  {workoutStats.completed}
                                </span>
                                <span className="text-sm text-foreground/60">
                                  of {workoutStats.total} completed
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="h-12 w-12 rounded-full border-2 border-primary-500/20 flex items-center justify-center">
                            <span className="text-lg font-semibold">
                              {Math.round((workoutStats.completed / workoutStats.total) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Weekly Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-secondary-500/5 border border-secondary-500/10">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-secondary-500" />
                              <span className="text-sm text-foreground/60">Week</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-semibold">
                                Day {currentDay}
                              </span>
                              <span className="text-sm text-foreground/60">/ 7</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-success-500/5 border border-success-500/10">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-success-500" />
                              <span className="text-sm text-foreground/60">Target</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-semibold">
                                {activePlan.config.weekly_workouts}
                              </span>
                              <span className="text-sm text-foreground/60">/ week</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Calories Card */}
                      <Tooltip content="Estimated based on your activity level and workout intensity">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-warning-500/5 to-danger-500/5 border border-warning-500/10 cursor-help">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-warning-500/10">
                                <Flame className="w-5 h-5 text-warning-500" />
                              </div>
                              <div>
                                <p className="text-sm text-foreground/60">Daily Burn</p>
                                <p className="text-lg font-semibold">
                                {calculateDailyCalories(caloriesBurned, activePlan)} kcal
                                </p>
                              </div>
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-success-500" />
                          </div>
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
                    <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mb-4">
                      <Dumbbell className="w-8 h-8 text-primary-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Active Plan</h3>
                    <p className="text-sm text-foreground/60 mb-6">
                      Start your fitness journey today
                    </p>
                    <Button
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
                      endContent={<ChevronRight size={16} />}
                    >
                      Create Plan
                    </Button>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>

      {/* Weight Modal */}
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
      </AnimatePresence>
      
      {/* Onboarding Dialog */}
      <AnimatePresence>
        {needsOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          >
            <OnboardingWizard 
              clientData={client} 
              onComplete={refreshData}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}