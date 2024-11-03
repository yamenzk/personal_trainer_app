// src/components/layout/BottomNavbar.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Dumbbell, Utensils, MessageSquare, FileText } from 'lucide-react';

const BottomNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Dumbbell, label: 'Workouts', path: '/workouts' },
    { icon: Utensils, label: 'Meals', path: '/meals' },
    { icon: MessageSquare, label: 'Chat', path: '/chat', disabled: true },
    { icon: FileText, label: 'Resources', path: '/resources', disabled: true }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-t border-divider">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ icon: Icon, label, path, disabled }) => {
            const active = isActive(path);
            return (
              <button
                key={path}
                onClick={() => !disabled && navigate(path)}
                className={`flex flex-col items-center gap-1 ${
                  active ? 'text-primary' : 'text-foreground/60'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={disabled}
                aria-label={label}
              >
                <Icon size={20} />
                <span className="text-xs">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavbar;