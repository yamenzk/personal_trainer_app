// src/components/layout/Layout.tsx
import React from 'react';
import TopNavbar from './TopNavbar';
import BottomNavbar from './BottomNavbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <main className="container mx-auto px-4 py-16 mb-16">
        {children}
      </main>
      <BottomNavbar />
    </div>
  );
};

export default Layout;