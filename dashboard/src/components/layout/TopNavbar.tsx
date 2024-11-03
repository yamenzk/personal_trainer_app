// src/components/layout/TopNavbar.tsx
import { useNavigate } from 'react-router-dom';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react";
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon, LogOut, User } from 'lucide-react';

const TopNavbar = () => {
  const { toggleTheme, theme } = useTheme();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('membershipId');
    localStorage.removeItem('clientId');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-divider">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          byShujaa
        </h1>
        
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              src="/default-avatar.png"
              className="cursor-pointer"
              size="sm"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile actions">
            <DropdownItem 
              key="profile" 
              startContent={<User size={16} />}
              onPress={() => navigate('/profile')}
              textValue="Profile" // Added for accessibility
            >
              Profile
            </DropdownItem>
            <DropdownItem 
              key="theme" 
              startContent={theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              onPress={toggleTheme}
              textValue={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} // Added for accessibility
            >
              {theme === 'light' ? 'Dark mode' : 'Light mode'}
            </DropdownItem>
            <DropdownItem 
              key="logout" 
              className="text-danger" 
              color="danger"
              startContent={<LogOut size={16} />}
              onPress={handleLogout}
              textValue="Logout" // Added for accessibility
            >
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </nav>
  );
};

export default TopNavbar;