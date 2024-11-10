// src/pages/Dashboard.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useClientData } from '../hooks/useClientData';
import { usePlans } from '../hooks/usePlans';
import { calculatePlanProgress } from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';
import { PageTransition } from '@/components/shared/PageTransition';
import { Card, CardBody, CardHeader, Skeleton } from '@nextui-org/react';

// Import components
import { HeroSection } from '../components/dashboard/HeroSection';
import { QuickStats } from '../components/dashboard/QuickStats';
import { WeightTracker } from '../components/dashboard/WeightTracker';
import { WorkoutProgress } from '../components/dashboard/WorkoutProgress';
import { AchievementCard } from '../components/dashboard/AchievementCard';
import { MuscleGroupsChart } from '../components/dashboard/MuscleGroupsChart';
import { WeightModal } from '../components/shared/WeightModal';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import { Client } from '@/types/client';
import { Plan } from '@/types/plan';
import { ExerciseReference } from '@/types/workout';

// Skeleton Component
const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary-500/10 via-background to-secondary-500/10">
      <div className="container mx-auto space-y-8">
        {/* Hero Section Skeleton */}
        <Skeleton className="w-full h-[180px] rounded-xl" />

        {/* Quick Stats Skeleton */}
        <div className="space-y-4">
          <div className="px-6">
            <Skeleton className="w-48 h-7 rounded-lg" />
            <Skeleton className="w-72 h-5 mt-2 rounded-lg" />
          </div>
          <div className="flex gap-4 px-6 overflow-x-hidden">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-[280px] h-[120px] rounded-xl flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Workout Progress Skeleton */}
        <div className="space-y-4">
          <div className="px-6">
            <Skeleton className="w-48 h-7 rounded-lg" />
            <Skeleton className="w-72 h-5 mt-2 rounded-lg" />
          </div>
          <Skeleton className="w-full h-[350px] rounded-xl" />
        </div>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="xl:col-span-8">
            <Skeleton className="w-full h-[400px] rounded-xl" />
          </div>

          {/* Right Column */}
          <div className="xl:col-span-4 space-y-6">
            <Skeleton className="w-full h-[300px] rounded-xl" />
            <Skeleton className="w-full h-[300px] rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Content Component
const DashboardContent = ({
  client,
  plans,
  refreshData
}: {
  client: Client;
  plans: Plan[];
  refreshData: () => Promise<void>;
}) => {
  const { activePlan, completedPlans, currentDay } = usePlans(plans);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const { theme } = useTheme();
  const { references = { exercises: {} } } = useClientData(); // Add default value

  // Check for onboarding needs
  const needsOnboarding = !client.date_of_birth || !client.gender || !client.email ||
    !client.nationality || !client.meals || !client.workouts || !client.activity_level ||
    !client.equipment || !client.height || !client.weight.length || !client.target_weight ||
    !client.goal || !client.client_name;

  if (needsOnboarding) {
    return (
      <OnboardingWizard 
        clientData={client} 
        onComplete={refreshData}
      />
    );
  }

  const planProgress = activePlan ? calculatePlanProgress(activePlan) : 0;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br">
      <div className="container mx-auto space-y-12">
        {/* Hero Section */}
        <div className="fade-in">
          <HeroSection
            client={client}
            activePlan={activePlan}
            currentDay={currentDay}
            planProgress={planProgress}
          />
        </div>

        {/* Quick Stats Section */}
        <div className="space-y-4 fade-in-delayed">
          <div className="px-4">
            <h2 className="text-xl font-semibold">Your Statistics</h2>
            <p className="text-sm text-foreground/60">Track your daily progress and achievements.</p>
          </div>
          <div className="w-full">
            <QuickStats client={client} />
          </div>
        </div>

        {/* Workout Progress Section */}
        <div className="space-y-4 fade-in-delayed">
          <div className="px-4">
            <h2 className="text-xl font-semibold">Today's Workout</h2>
            <p className="text-sm text-foreground/60">Keep track of your workout progress.</p>
          </div>
          <WorkoutProgress
            client={client}
            activePlan={activePlan}
            completedPlans={completedPlans}
            currentDay={currentDay}
            planProgress={planProgress}
            exerciseRefs={references?.exercises || {}}
          />
        </div>

        {/* Weight Journey Section */}
        <div className="space-y-4 fade-in-delayed">
          <div className="px-4">
            <h2 className="text-xl font-semibold">Your Weight Journey</h2>
            <p className="text-sm text-foreground/60">Stay focused on your health goals</p>
          </div>
          <WeightTracker
            client={client}
            onLogWeight={() => setShowWeightModal(true)}
          />
        </div>

        {/* Achievement Section */}
        <div className="space-y-4 fade-in-delayed">
          <div className="px-4">
            <h2 className="text-xl font-semibold">Your Achievements</h2>
            <p className="text-sm text-foreground/60">Track your milestones and progress</p>
          </div>
          <AchievementCard client={client} />
        </div>

        {/* Muscle Focus Section */}
        <div className="space-y-4 fade-in-delayed">
          <div className="px-4">
            <h2 className="text-xl font-semibold">What You've Been Focusing On</h2>
            <p className="text-sm text-foreground/60">Analyze your muscle group distribution</p>
          </div>
          <MuscleGroupsChart client={client} />
        </div>
      </div>

      {/* Weight Modal with AnimatePresence */}
      <AnimatePresence>
        {showWeightModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <WeightModal
              isOpen={showWeightModal}
              onClose={() => setShowWeightModal(false)}
              onWeightLogged={refreshData}
              clientId={client.name}
              currentWeight={client.current_weight}
              weightGoal={client.goal}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Component
export default function Dashboard() {
  const { loading, error, client, plans, refreshData } = useClientData();

  return (
    <PageTransition
      loading={loading}
      error={error}
      skeleton={<DashboardSkeleton />}
    >
      {client && (
        <DashboardContent
          client={client}
          plans={plans ?? []}
          refreshData={refreshData}
        />
      )}
    </PageTransition>
  );
}