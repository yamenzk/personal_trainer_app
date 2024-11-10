// src/components/layout/Layout.tsx
import React, { useEffect } from 'react';
import TopNavbar from './TopNavbar';
import BottomNavbar from './BottomNavbar';
import { useLocation } from 'react-router-dom';
import { cn } from '@nextui-org/react';

interface LayoutProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideNavigation = false }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Retain your existing background effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] 
          bg-gradient-to-b from-primary-500/20 via-secondary-500/20 to-transparent 
          blur-3xl opacity-50" 
        />
        
        <div className="absolute -top-[40vh] -right-[40vh] w-[80vh] h-[80vh] rounded-full 
          bg-primary-500/20 blur-3xl" 
        />
        
        <div className="absolute -bottom-[40vh] -left-[40vh] w-[80vh] h-[80vh] rounded-full 
          bg-secondary-500/20 blur-3xl"
        />
        
        {/* <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" /> */}
      </div>

      {/* Content Container */}
      <div className="relative h-full w-full flex flex-col z-10">
        {/* Top Navigation */}
        {!hideNavigation && (
          <div className="flex-none h-16">
            <TopNavbar />
          </div>
        )}
        
        {/* Main Content */}
        <main 
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden",
            !hideNavigation && "pb-2" // Account for bottom navbar
          )}
          style={{ 
            height: hideNavigation ? '100%' : 'calc(100% - 4rem)',
            willChange: 'transform'
          }}
        >
          {children}
        </main>
        
        {/* Bottom Navigation */}
        {!hideNavigation && (
          <div className="flex-none h-16">
            <BottomNavbar />
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;