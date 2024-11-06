// App.tsx
import React, { useState, useEffect } from 'react';
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { FrappeProvider } from 'frappe-react-sdk';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WorkoutPlans from "./pages/WorkoutPlans";
import MealPlans from "./pages/MealPlans";
import Profile from "./pages/Profile";
import { getSiteName } from './utils/frappe';
import { useClientData } from './hooks/useClientData';
import OnboardingWizard from './components/onboarding/OnboardingWizard';
import { AnimatePresence } from "framer-motion";
import { Client } from './types/client';
import dayjs from 'dayjs';

// Interface for components that can receive preferences update
export interface WithPreferencesUpdate {
  onPreferencesUpdate?: (steps: string[]) => void;
}

const getMissingSteps = (client: Client | null): string[] => {
  if (!client) return [];
  
  const stepChecks: Record<string, () => boolean> = {
    'Name': () => !client.client_name?.trim(),
    'DateOfBirth': () => !client.date_of_birth || !dayjs(client.date_of_birth).isValid(),
    'Gender': () => !client.gender || !['Male', 'Female'].includes(client.gender),
    'Email': () => !client.email?.trim() || !client.email.includes('@'),
    'Nationality': () => !client.nationality?.trim(),
    'Height': () => !client.height || client.height <= 0,
    'Weight': () => !client.weight?.length || client.weight[0].weight <= 0,
    'TargetWeight': () => !client.target_weight || client.target_weight <= 0,
    'ActivityLevel': () => !client.activity_level || !['Sedentary', 'Light', 'Moderate', 'Very Active', 'Extra Active'].includes(client.activity_level),
    'Equipment': () => !client.equipment || !['Gym', 'Home'].includes(client.equipment),
    'Goal': () => !client.goal || !['Weight Loss', 'Weight Gain', 'Muscle Building', 'Maintenance'].includes(client.goal),
    'Meals': () => typeof client.meals !== 'number' || client.meals < 3 || client.meals > 6,
    'Workouts': () => typeof client.workouts !== 'number' || client.workouts < 3 || client.workouts > 6,
  };

  const missingSteps = Object.entries(stepChecks)
    .filter(([step, check]) => {
      const isMissing = check();
      // console.log(`Checking ${step}: ${isMissing ? 'missing' : 'present'} (${JSON.stringify(client[step.toLowerCase() as keyof Client])})`);
      return isMissing;
    })
    .map(([step]) => step);

  // console.log('Missing steps:', missingSteps);
  return missingSteps;
};

const needsOnboarding = (client: Client | null) => {
  if (!client) return false;
  
  const requiredFields: (keyof Client)[] = [
    'client_name',
    'date_of_birth',
    'gender',
    'email',
    'nationality',
    'height',
    'weight',
    'target_weight',
    'activity_level',
    'equipment',
    'goal',
    'meals',
    'workouts'
  ];

  return requiredFields.some(field => {
    if (field === 'weight') {
      return !client.weight?.length;
    }
    return !client[field];
  });
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { loading, client, refreshData } = useClientData();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingMode, setOnboardingMode] = useState<'full' | 'preferences'>('full');
  const [activeSteps, setActiveSteps] = useState<string[]>([]);
  const [onboardingJustCompleted, setOnboardingJustCompleted] = useState(false);

  // Effect for handling initial onboarding check
  useEffect(() => {
    if (!loading && client && !onboardingJustCompleted) {
      const missingSteps = getMissingSteps(client);
      if (missingSteps.length > 0) {
        setActiveSteps(missingSteps);
        setShowOnboarding(true);
        setOnboardingMode('full');
      }
    }
  }, [loading, client, onboardingJustCompleted]);

  // Add a new effect to handle data refresh after onboarding
  useEffect(() => {
    if (onboardingJustCompleted) {
      const checkCompleteness = async () => {
        await refreshData();
        // After refreshing, verify that all required fields are complete
        const missingSteps = getMissingSteps(client);
        if (missingSteps.length === 0) {
          // Only reset if everything is complete
          setOnboardingJustCompleted(false);
        }
      };
      checkCompleteness();
    }
  }, [onboardingJustCompleted]);

  const handlePreferencesUpdate = (steps: string[]) => {
    setActiveSteps(steps);
    setOnboardingMode('preferences');
    setShowOnboarding(true);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          </div>
          <div className="text-foreground/60 font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Layout hideNavigation={showOnboarding}>
        <WithPreferencesProvider value={handlePreferencesUpdate}>
          {children}
        </WithPreferencesProvider>

        <AnimatePresence>
          {showOnboarding && client && (
            <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg">
              <OnboardingWizard
                clientData={client}
                steps={activeSteps}
                onComplete={() => {
                  setShowOnboarding(false);
                  setOnboardingJustCompleted(true);
                }}
              />
            </div>
          )}
        </AnimatePresence>
      </Layout>
    </>
  );
};

// Context for preferences update
const PreferencesContext = React.createContext<((steps: string[]) => void) | undefined>(undefined);

const WithPreferencesProvider: React.FC<{ children: React.ReactNode; value: (steps: string[]) => void }> = ({ children, value }) => (
  <PreferencesContext.Provider value={value}>
    {children}
  </PreferencesContext.Provider>
);

export const usePreferencesUpdate = () => {
  const context = React.useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferencesUpdate must be used within a WithPreferencesProvider');
  }
  return context;
};

function App() {

  return (
    <FrappeProvider
      socketPort={import.meta.env.VITE_SOCKET_PORT ?? '9000'}
      siteName={getSiteName()}
    >
      <NextUIProvider>
        <ThemeProvider>
          <Router>
            <AuthProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <Routes>
                      <Route index element={<Dashboard />} />
                      <Route path="workouts" element={<WorkoutPlans />} />
                      <Route path="meals" element={<MealPlans />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </ProtectedRoute>
                } />
              </Routes>
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </NextUIProvider>
    </FrappeProvider>
  );
}

export default App;