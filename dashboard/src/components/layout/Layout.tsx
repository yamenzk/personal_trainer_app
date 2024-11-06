// src/components/layout/Layout.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="fixed inset-0 bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Primary gradient blob */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] 
            bg-gradient-to-b from-primary-500/20 via-secondary-500/20 to-transparent 
            blur-3xl opacity-50 animate-gradient-y" 
        />
        
        {/* Secondary floating orbs */}
        <div className="absolute -top-[40vh] -right-[40vh] w-[80vh] h-[80vh] rounded-full 
          bg-primary-500/20 blur-3xl animate-float" 
          style={{ animationDelay: '-2s' }}
        />
        <div className="absolute -bottom-[40vh] -left-[40vh] w-[80vh] h-[80vh] rounded-full 
          bg-secondary-500/20 blur-3xl animate-float" 
          style={{ animationDelay: '-1s' }}
        />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative w-full h-full flex flex-col">
        {/* Top Navigation */}
        {!hideNavigation && (
          <div className="flex-none">
            <TopNavbar />
          </div>
        )}
        
        {/* Main Content - Scrollable Area */}
        <main className={cn(
          "flex-1 overflow-y-auto",
          !hideNavigation && "pt-16 pb-16"
        )}>
          <div className="container mx-auto px-4 py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        
        {/* Bottom Navigation */}
        {!hideNavigation && (
          <div className="flex-none">
            <BottomNavbar />
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;