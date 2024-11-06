// src/pages/Dashboard.tsx
import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useClientData } from '../hooks/useClientData';
import { usePlans } from '../hooks/usePlans';
import { calculatePlanProgress } from '../utils/api';

// Import components
import { HeroSection } from '../components/dashboard/HeroSection';
import { QuickStats } from '../components/dashboard/QuickStats';
import { WeightTracker } from '../components/dashboard/WeightTracker';
import { WorkoutProgress } from '../components/dashboard/WorkoutProgress';
import { AchievementCard } from '../components/dashboard/AchievementCard';
import { MuscleGroupsChart } from '../components/dashboard/MuscleGroupsChart';
import { WeightModal } from '../components/shared/WeightModal';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import { GlassCard } from '@/components/shared/GlassCard';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@nextui-org/react';

// src/pages/Dashboard.tsx (continued)
export default function Dashboard() {
  const { loading, error, client, plans, refreshData } = useClientData();
  const { activePlan, completedPlans, currentDay } = usePlans(plans ?? []);
  const [showWeightModal, setShowWeightModal] = useState(false);

  // Loading state
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

  // Error state
  if (error || !client) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <GlassCard className="max-w-md w-full p-6 text-center space-y-4 bg-danger/10">
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
        </GlassCard>
      </div>
    );
  }

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
    <div className="min-h-screen w-full">
      {/* Main content with CSS transitions */}
      <div className="container mx-auto space-y-6 fade-in">
        {/* Hero Section */}
        <div className="slide-in">
          <HeroSection
            client={client}
            activePlan={activePlan}
            currentDay={currentDay}
            planProgress={planProgress}
          />
        </div>

        {/* Quick Stats */}
        <div className="slide-in-delayed">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <QuickStats client={client} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Weight Tracking */}
          <div className="slide-in-from-left">
            <WeightTracker
              client={client}
              onLogWeight={() => setShowWeightModal(true)}
            />
          </div>

          {/* Workout Progress */}
          <div className="slide-in-from-right">
            <WorkoutProgress
              client={client}
              activePlan={activePlan}
              completedPlans={completedPlans}
              currentDay={currentDay}
              planProgress={planProgress}
            />
          </div>
        </div>

        {/* Achievement and Muscle Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="slide-in-delayed-2">
            <AchievementCard client={client} />
          </div>

          <div className="slide-in-delayed-2">
            <MuscleGroupsChart client={client} />
          </div>
        </div>
      </div>

      {/* Modal with CSSTransition */}
      <CSSTransition
        in={showWeightModal}
        timeout={300}
        classNames="modal"
        unmountOnExit
      >
        <WeightModal
          isOpen={showWeightModal}
          onClose={() => setShowWeightModal(false)}
          onWeightLogged={refreshData}
          clientId={client.name}
          currentWeight={client.current_weight}
        />
      </CSSTransition>
    </div>
  );
}