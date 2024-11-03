// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Progress, 
  Button, 
  Avatar,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Activity, 
  Dumbbell, 
  Scale, 
  Target, 
  TrendingUp, 
  Calendar, 
  ChevronRight 
} from 'lucide-react';
import { useClientData } from '../hooks/useClientData';
import { usePlans } from '../hooks/usePlans';
import OnboardingWizard from '../components/onboarding/OnboardingWizard';
import WeightModal from '../components/dashboard/WeightModal';
import { calculatePlanProgress } from '../utils/api';

const MotionCard = motion(Card);

export default function Dashboard() {
  const navigate = useNavigate();
  const { loading, error, client, plans, refreshData } = useClientData();
  const { activePlan, currentDay } = usePlans(plans ?? []);
  const [showWeightModal, setShowWeightModal] = useState(false);

  useEffect(() => {
    // Check if we need to show the weight modal based on request_weight
    if (client?.request_weight === 1) {
      setShowWeightModal(true);
    }
  }, [client?.request_weight]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-foreground/60">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="text-center text-danger">
        {error || 'Failed to load dashboard'}
      </div>
    );
  }

  const needsOnboarding = !client.date_of_birth ||
    !client.gender ||
    !client.email ||
    !client.nationality ||
    !client.meals ||
    !client.workouts ||
    !client.activity_level ||
    !client.equipment ||
    !client.height ||
    !client.weight.length ||
    !client.target_weight;

  // Calculate progress metrics
  const planProgress = activePlan ? calculatePlanProgress(activePlan) : 0;
  const initialWeight = client.weight[0]?.weight ?? client.current_weight;
  const totalWeightLoss = initialWeight - client.current_weight;
  const remainingWeight = Math.max(0, client.current_weight - client.target_weight);
  const goalProgress = Math.min(100, Math.max(0, (totalWeightLoss / (initialWeight - client.target_weight)) * 100));

  // Format weight data for the chart
  const weightData = client.weight
    .map(w => ({
      date: new Date(w.date).toLocaleDateString(),
      weight: w.weight
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const firstName = client.client_name?.split(' ')[0] ?? 'there';

  return (
    <>
      {needsOnboarding && (
        <OnboardingWizard 
          clientData={client} 
          onComplete={refreshData}
        />
      )}

      <div className="space-y-6 pb-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row gap-6">
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            <CardBody className="flex flex-row items-center gap-4 py-8">
              <Avatar
                src={client.image}
                className="w-16 h-16"
                showFallback
                name={client.client_name}
              />
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome back, {firstName}!
                </h1>
                <p className="text-foreground/60">
                  {activePlan ? "Here's your progress for this week" : "Let's start your fitness journey"}
                </p>
              </div>
            </CardBody>
          </MotionCard>

          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1"
          >
            <CardBody className="flex flex-row items-center gap-4 py-8">
              <div className="p-4 rounded-xl bg-primary/10">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-foreground/60">Goal Progress</span>
                  <span className="text-sm font-medium">
                    {client.current_weight} kg / {client.target_weight} kg
                  </span>
                </div>
                <Progress 
                  value={goalProgress}
                  color="success"
                  className="h-2"
                  showValueLabel
                  valueLabel={`${Math.round(goalProgress)}%`}
                />
              </div>
            </CardBody>
          </MotionCard>
        </div>

        {/* Active Plan */}
        {activePlan && (
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardHeader className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Current Plan</h2>
                <p className="text-sm text-foreground/60">{activePlan.plan_name}</p>
              </div>
              <Button
                color="primary"
                variant="flat"
                size="sm"
                endContent={<ChevronRight size={16} />}
                onClick={() => navigate('/workouts')}
              >
                View Plan
              </Button>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Weekly Progress</span>
                    <span>{Math.round(planProgress)}%</span>
                  </div>
                  <Progress 
                    value={planProgress}
                    color="success"
                    className="h-2"
                  />
                  <div className="flex items-center gap-2 text-sm text-foreground/60">
                    <Calendar size={16} />
                    <span>Day {currentDay} of 7</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Dumbbell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Workouts</p>
                    <p className="font-semibold">
                      {activePlan.config.weekly_workouts} / week
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Activity Level</p>
                    <p className="font-semibold">{client.activity_level}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </MotionCard>
        )}

        {/* Weight Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <CardHeader className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Weight Progress</h2>
                <p className="text-sm text-foreground/60">Track your weight changes over time</p>
              </div>
              <Button
                color="primary"
                variant="flat"
                size="sm"
                startContent={<Scale size={16} />}
                onClick={() => setShowWeightModal(true)}
              >
                Log Weight
              </Button>
            </CardHeader>
            <CardBody className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <defs>
                    <linearGradient id="weightLine" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="currentColor" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="currentColor"
                    fontSize={12}
                    tickLine={false}
                    width={30}
                    domain={['dataMin - 1', 'dataMax + 1']}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: 'var(--primary)' }}
                    activeDot={{ r: 6, fill: 'var(--primary)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </MotionCard>

          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CardHeader>
              <h2 className="text-lg font-semibold">Quick Stats</h2>
            </CardHeader>
            <CardBody className="gap-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5">
                <Scale className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-foreground/60">Current Weight</p>
                  <p className="text-xl font-semibold">{client.current_weight} kg</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-success/5">
                <TrendingUp className="w-8 h-8 text-success" />
                <div>
                  <p className="text-sm text-foreground/60">Total Loss</p>
                  <p className="text-xl font-semibold">
                    {totalWeightLoss.toFixed(1)} kg
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-warning/5">
                <Target className="w-8 h-8 text-warning" />
                <div>
                  <p className="text-sm text-foreground/60">Remaining</p>
                  <p className="text-xl font-semibold">
                    {remainingWeight.toFixed(1)} kg
                  </p>
                </div>
              </div>
            </CardBody>
          </MotionCard>
        </div>
      </div>

      <WeightModal
        isOpen={showWeightModal}
        onClose={() => setShowWeightModal(false)}
        onWeightLogged={refreshData}
        clientId={client.name}
        currentWeight={client.current_weight}
      />
    </>
  );
}