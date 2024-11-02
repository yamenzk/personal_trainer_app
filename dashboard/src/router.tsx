// src/router.tsx
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardLayout from '@/layouts/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import WorkoutPlans from '@/pages/WorkoutPlans';
import MealPlans from '@/pages/MealPlans';
import Chat from '@/pages/Chat';
import Resources from '@/pages/Resources';
import Profile from '@/pages/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'workout-plans',
        element: <WorkoutPlans />,
      },
      {
        path: 'meal-plans',
        element: <MealPlans />,
      },
      {
        path: 'chat',
        element: <Chat />,
      },
      {
        path: 'resources',
        element: <Resources />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};