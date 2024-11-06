// src/pages/Dashboard.tsx
import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useClientData } from '../hooks/useClientData';
import { usePlans } from '../hooks/usePlans';
import { calculatePlanProgress } from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';

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
import { Button, Card, CardBody, CardHeader, CardFooter } from '@nextui-org/react';

// src/pages/Dashboard.tsx (continued)
export default function Dashboard() {
  const { loading, error, client, plans, refreshData } = useClientData();
  const { activePlan, completedPlans, currentDay } = usePlans(plans ?? []);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const { theme } = useTheme();

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
        <Card className="max-w-md w-full">
          <CardHeader className="flex-col gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-danger/20 text-danger mx-auto flex items-center justify-center">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-semibold text-danger">Error Loading Dashboard</h3>
          </CardHeader>
          <CardBody className="text-center">
            <p className="text-danger/80 mb-4">{error || 'Failed to load dashboard data'}</p>
            <Button 
              color="danger" 
              variant="flat" 
              onPress={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardBody>
        </Card>
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
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background/90 to-background">
      <Card 
        isBlurred={theme === 'dark'}
        // ...other props
      >
        {/* ...card content... */}
      </Card>
      <div className="container mx-auto space-y-8">
        {/* Hero Section */}
        <div className="fade-in">
          <HeroSection
            client={client}
            activePlan={activePlan}
            currentDay={currentDay}
            planProgress={planProgress}
          />
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 fade-in-delayed">
          <QuickStats client={client} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Weight and Progress Section */}
          <div className="xl:col-span-8 space-y-6">
            <WeightTracker
              client={client}
              onLogWeight={() => setShowWeightModal(true)}
            />
            <WorkoutProgress
              client={client}
              activePlan={activePlan}
              completedPlans={completedPlans}
              currentDay={currentDay}
              planProgress={planProgress}
            />
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-4 space-y-6">
            <AchievementCard client={client} />
            <MuscleGroupsChart client={client} />
          </div>
        </div>
      </div>

      {/* Weight Modal */}
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