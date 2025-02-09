// App.tsx
import React, { useState, useEffect } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "./contexts/ThemeContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { FrappeProvider } from "frappe-react-sdk";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WorkoutPlans from "./pages/WorkoutPlans";
import MealPlans from "./pages/MealPlans";
import Profile from "./pages/Profile";
import { getSiteName } from "./utils/frappe";
import OnboardingWizard from "./components/onboarding/OnboardingWizard";
import { AnimatePresence } from "framer-motion";
import { NavigationProvider } from "./contexts/NavigationContext";
import dayjs from "dayjs";
import { refetchClientData, useClientStore } from "@/stores/clientStore";
import { Client } from "@/types";
import Chat from '@/pages/Chat';

const getMissingSteps = (client: Client | null): string[] => {
  if (!client) return [];

  const stepChecks: Record<string, () => boolean> = {
    Name: () => !client.client_name?.trim(),
    DateOfBirth: () =>
      !client.date_of_birth || !dayjs(client.date_of_birth).isValid(),
    Gender: () => !client.gender || !["Male", "Female"].includes(client.gender),
    Email: () => !client.email?.trim() || !client.email.includes("@"),
    Nationality: () => !client.nationality?.trim(),
    Height: () => !client.height || client.height <= 0,
    Weight: () => !client.weight?.length || client.weight[0].weight <= 0,
    TargetWeight: () => !client.target_weight || client.target_weight <= 0,
    ActivityLevel: () =>
      !client.activity_level ||
      ![
        "Sedentary",
        "Light",
        "Moderate",
        "Very Active",
        "Extra Active",
      ].includes(client.activity_level),
    Equipment: () =>
      !client.equipment || !["Gym", "Home"].includes(client.equipment),
    Goal: () =>
      !client.goal ||
      ![
        "Weight Loss",
        "Weight Gain",
        "Muscle Building",
        "Maintenance",
      ].includes(client.goal),
    Meals: () =>
      typeof client.meals !== "number" || client.meals < 3 || client.meals > 6,
    Workouts: () =>
      typeof client.workouts !== "number" ||
      client.workouts < 3 ||
      client.workouts > 6,
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
    "client_name",
    "email",
    "date_of_birth",
    "gender",
    "nationality",
    "height",
    "weight",
    "goal",
    "target_weight",
    "activity_level",
    "equipment",
    "workouts",
    "meals",
  ];

  return requiredFields.some((field) => {
    if (field === "weight") {
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
  const client = useClientStore((state) => state.client);
  const isLoading = useClientStore((state) => state.isLoading);
  const fetch = useClientStore((state) => state.fetch);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeSteps, setActiveSteps] = useState<string[]>([]);

  // Simplified state management - remove onboardingMode and onboardingJustCompleted

  // Single effect to handle onboarding state
  useEffect(() => {
    if (!isLoading && client) {
      const missingSteps = getMissingSteps(client);
      setShowOnboarding(missingSteps.length > 0);
      setActiveSteps(missingSteps);
    }
  }, [isLoading, client]);

  // Modified onboarding completion handler
  const handleOnboardingComplete = async () => {
    setShowOnboarding(false); // Hide onboarding immediately
    await refetchClientData();// Refresh client data
  };

  const handlePreferencesUpdate = (steps: string[]) => {
    setActiveSteps(steps);
    setShowOnboarding(true);
  };

  if (!isAuthenticated) {
    return <Navigate to="/client-login" replace />; // Changed from /login
  }

  if (isLoading) {
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
          {!showOnboarding && children}

          <AnimatePresence>
            {showOnboarding && client && (
              <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg">
                <OnboardingWizard
                  clientData={client}
                  steps={activeSteps}
                  onComplete={handleOnboardingComplete}
                />
              </div>
            )}
          </AnimatePresence>
        </WithPreferencesProvider>
      </Layout>
    </>
  );
};

// Context for preferences update
const PreferencesContext = React.createContext<
  ((steps: string[]) => void) | undefined
>(undefined);

const WithPreferencesProvider: React.FC<{
  children: React.ReactNode;
  value: (steps: string[]) => void;
}> = ({ children, value }) => (
  <PreferencesContext.Provider value={value}>
    {children}
  </PreferencesContext.Provider>
);

export const usePreferencesUpdate = () => {
  const context = React.useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error(
      "usePreferencesUpdate must be used within a WithPreferencesProvider"
    );
  }
  return context;
};

function App() {
  const { refreshIfNeeded, offlineMode, setOfflineMode, initializeOfflineData } = useClientStore();
  const { isAuthenticated } = useAuth();

  // Add version check on page load/visibility change
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkForUpdates = async () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        console.log('Checking for updates...');
        await refreshIfNeeded();
      }
    };

    // Check on mount
    checkForUpdates();

    // Check when page becomes visible
    document.addEventListener('visibilitychange', checkForUpdates);
    
    // Set up periodic checks (every 5 minutes)
    const interval = setInterval(checkForUpdates, 5 * 60 * 1000);

    return () => {
      document.removeEventListener('visibilitychange', checkForUpdates);
      clearInterval(interval);
    };
  }, [isAuthenticated, refreshIfNeeded]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setOfflineMode(false);
      if (offlineMode) {
        initializeOfflineData();
      }
    };

    const handleOffline = () => {
      setOfflineMode(true);
    };

    // Set initial state
    setOfflineMode(!navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineMode, initializeOfflineData, setOfflineMode]);

  useEffect(() => {
    if (isAuthenticated) {
      // Only check for updates when authenticated
      useClientStore.getState().refreshIfNeeded();
    }
  }, [isAuthenticated]);

  // Avoid rendering the React app for Frappe backend routes
  if (window.location.pathname.startsWith('/app') || window.location.pathname === '/login') {
    return null;
  }

  return (
    <FrappeProvider
      socketPort={import.meta.env.VITE_SOCKET_PORT ?? "9000"}
      siteName={getSiteName()}
    >
      <NextUIProvider>
        <ThemeProvider>
          <Router>
            <NavigationProvider>
              <AuthProvider>
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/client-login" element={<Login />} /> {/* Changed from /login */}
                    <Route
                      path="/*"
                      element={
                        <ProtectedRoute>
                          <Routes>
                            <Route index element={<Dashboard />} />
                            <Route path="workouts" element={<WorkoutPlans />} />
                            <Route path="meals" element={<MealPlans />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="chat" element={<Chat />} />
                            <Route
                              path="*"
                              element={<Navigate to="/" replace />}
                            />
                          </Routes>
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </AnimatePresence>
              </AuthProvider>
            </NavigationProvider>
          </Router>
        </ThemeProvider>
      </NextUIProvider>
    </FrappeProvider>
  );
}

export default App;
