// src/components/layout/TopNavbar.tsx
import { useNavigate } from 'react-router-dom';
import { 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem, 
  Avatar,
  Button,
  Chip
} from "@nextui-org/react";
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon, LogOut, User, Gift } from 'lucide-react';
import { useClientData } from '@/hooks/useClientData';
import { useAuth } from '@/contexts/AuthContext';
import { PromoCodeModal } from '@/components/shared/PromoCodeModal';
import { useState } from 'react';

const TopNavbar = () => {
  const { toggleTheme, theme } = useTheme();
  const navigate = useNavigate();
  const { client } = useClientData();
  const { logout } = useAuth();
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  
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
            className="bg-transparent p-0 min-w-0 h-auto hover:bg-transparent"
            onClick={() => navigate('/')}
          >
            <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
          </Button>

          {/* User Menu */}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                src={client?.image}
                isBordered 
                color="secondary"
                className="cursor-pointer transition-transform hover:scale-105 bg-gradient-to-br from-primary-500 to-secondary-500"
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
                key="promo"
                startContent={<Gift size={16} />}
                description="Apply a promo code"
                onPress={() => setIsPromoModalOpen(true)}
              >
                Redeem Code
              </DropdownItem>
              
              <DropdownItem
                key="theme"
                startContent={theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                description={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                isDisabled
              >
                <div className="flex items-center gap-2">
                  {theme === 'light' ? 'Dark mode' : 'Light mode'}
                  <Chip 
                    size="sm" 
                    variant="flat" 
                    color="warning" 
                    classNames={{
                      base: "h-4 px-1",
                      content: "text-[10px] font-medium px-1"
                    }}
                  >
                    Soon
                  </Chip>
                </div>
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

              <DropdownItem
                key="version"
                className="h-6 text-[11px] opacity-50 border-t border-divider mt-1 pt-2 rounded-none"
                isReadOnly
              >
                <div className="flex items-center gap-2 text-[9px] justify-center">
                  App Version 2.1.3
                  <Chip 
                    size="sm" 
                    variant="flat" 
                    classNames={{
                      base: "h-4 px-1",
                      content: "text-[9px] font-medium px-1"
                    }}
                  >
                    Beta
                  </Chip>
                </div>
              </DropdownItem>
              </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <PromoCodeModal 
        isOpen={isPromoModalOpen}
        onClose={() => setIsPromoModalOpen(false)}
        membershipId={client?.membership_id || ''}
      />
    </nav>
  );
};

export default TopNavbar;