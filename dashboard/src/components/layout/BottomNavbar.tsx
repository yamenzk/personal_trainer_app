// src/components/layout/BottomNavbar.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import {
  Home,
  Dumbbell,
  Utensils,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { Tooltip } from '@nextui-org/react';

const BottomNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      path: '/', 
      disabled: false,
      color: 'primary'
    },
    { 
      icon: Dumbbell, 
      label: 'Workouts', 
      path: '/workouts', 
      disabled: false,
      color: 'secondary'
    },
    { 
      icon: Utensils, 
      label: 'Meals', 
      path: '/meals', 
      disabled: false,
      color: 'success'
    },
    { 
      icon: MessageSquare, 
      label: 'Chat', 
      path: '/chat', 
      disabled: true,
      color: 'warning'
    },
    { 
      icon: FileText, 
      label: 'Resources', 
      path: '/resources', 
      disabled: true,
      color: 'primary'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 sm:h-20">
      {/* Blurred backdrop */}
      <div className="absolute inset-0 backdrop-blur-xl bg-background/80 border-t border-divider shadow-lg" />

      <div className="container mx-auto h-full px-4">
        <div className="h-full flex items-center justify-around relative z-10">
          {navItems.map(({ icon: Icon, label, path, disabled, color }) => {
            const active = isActive(path);
            
            const NavButton = (
              <button
                key={path}
                onClick={() => !disabled && navigate(path)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300",
                  "hover:scale-110 active:scale-95",
                  disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                  active && `text-${color}-500`
                )}
                disabled={disabled}
                aria-label={label}
              >
                <Icon 
                  size={20} 
                  className={cn(
                    "transition-transform duration-300",
                    active && "scale-110"
                  )}
                />
                <span className={cn(
                  "text-xs font-medium transition-colors duration-300",
                  active ? `text-${color}-500` : "text-foreground/60"
                )}>
                  {label}
                </span>
              </button>
            );

            return disabled ? (
              <Tooltip
                key={path}
                content="Coming soon"
                placement="top"
                delay={0}
                closeDelay={0}
              >
                {NavButton}
              </Tooltip>
            ) : (
              NavButton
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavbar;