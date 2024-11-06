// src/components/layout/TopNavbar.tsx
import { useNavigate } from 'react-router-dom';
import { 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem, 
  Avatar,
  Button 
} from "@nextui-org/react";
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon, LogOut, User, Settings } from 'lucide-react';
import { useClientData } from '@/hooks/useClientData';
import { useAuth } from '@/contexts/AuthContext';

const TopNavbar = () => {
  const { toggleTheme, theme } = useTheme();
  const navigate = useNavigate();
  const { client } = useClientData();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16">
      {/* Blurred backdrop */}
      <div className="absolute inset-0 backdrop-blur-md bg-background/80 border-b border-divider shadow-sm" />

      <div className="container mx-auto h-full px-4">
        <div className="h-full flex items-center justify-between relative z-10">
          {/* Logo */}
          <Button
            className="bg-transparent p-0 hover:bg-transparent"
            onClick={() => navigate('/')}
          >
            <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              byShujaa
            </span>
          </Button>

          {/* User Menu */}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                src={client?.image}
                isBordered 
                color="primary"
                className="cursor-pointer transition-transform hover:scale-105"
                size="sm"
                showFallback
                name={client?.client_name || 'User'}
              />
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="User menu"
              className="w-48"
              itemClasses={{
                base: [
                  "gap-4",
                  "h-12",
                  "transition-opacity",
                  "data-[hover=true]:opacity-80"
                ]
              }}
            >
              <DropdownItem
                key="profile"
                startContent={<User size={16} />}
                onPress={() => navigate('/profile')}
                description="View your profile"
              >
                Profile
              </DropdownItem>
              
              <DropdownItem
                key="settings"
                startContent={<Settings size={16} />}
                description="Manage preferences"
                isDisabled
              >
                Settings
              </DropdownItem>
              
              <DropdownItem
                key="theme"
                startContent={theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                onPress={toggleTheme}
                description={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? 'Dark mode' : 'Light mode'}
              </DropdownItem>
              
              <DropdownItem
                key="logout"
                className="text-danger"
                color="danger"
                startContent={<LogOut size={16} className="text-danger" />}
                onPress={handleLogout}
                description="Sign out of your account"
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;