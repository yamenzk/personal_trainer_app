// src/App.tsx
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { FrappeProvider } from 'frappe-react-sdk';
import { AuthProvider } from './contexts/AuthContext';
import Layout from "./components/layout/layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WorkoutPlans from "./pages/WorkoutPlans";
import MealPlans from "./pages/MealPlans";
import Profile from "./pages/Profile";
import { getSiteName } from './utils/frappe';
import { useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
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
                    <Layout>
                      <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path="workouts" element={<WorkoutPlans />} />
                        <Route path="meals" element={<MealPlans />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </Layout>
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