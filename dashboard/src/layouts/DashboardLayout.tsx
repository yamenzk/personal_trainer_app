// src/layouts/DashboardLayout.tsx
import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  Home,
  Dumbbell,
  Utensils,
  MessageSquare,
  Book,
  User,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { RouteTransition } from '@/components/ui/route-transition';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useCheckWizardRequirements } from '@/hooks/useCheckWizardRequirements';

const DashboardLayout: React.FC = () => {
  useCheckWizardRequirements();
  const navigate = useNavigate();
  const location = useLocation();
  const { client, logout } = useAuthStore();

  const navigationItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Dumbbell, label: 'Workouts', path: '/workout-plans' },
    { icon: Utensils, label: 'Meals', path: '/meal-plans' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: Book, label: 'Resources', path: '/resources' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Logo */}
          <div className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            byShujaa
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile Button */}
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="relative">
                <img
                  src={client?.image || '/assets/ptrainer/images/male_default.png'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20">
        <div className="container mx-auto px-4 py-6">
          <ErrorBoundary>
            <RouteTransition>
              <Outlet />
            </RouteTransition>
          </ErrorBoundary>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 z-50">
        <div className="flex items-center justify-around h-16">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center space-y-1 w-16 h-16 transition-colors ${
                  isActive 
                    ? 'text-blue-500 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-500 dark:text-blue-400' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Quick Actions Menu (optional) */}
      <div className="fixed right-4 bottom-20 flex flex-col items-end space-y-2">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardLayout;