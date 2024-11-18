// src/components/layout/Layout.tsx
import React, { useEffect, useState } from 'react';
import TopNavbar from './TopNavbar';
import BottomNavbar from './BottomNavbar';
import { useLocation } from 'react-router-dom';
import { getAnnouncement } from '@/utils/api';
import { Button, cn } from '@nextui-org/react';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { useAnnouncement } from '@/hooks/useAnnouncement';
import { useClientStore } from '@/stores/clientStore';
import { WeightModal } from '@/components/shared/WeightModal';
import { Scale } from 'lucide-react';

interface AnnouncementData {
  bg_class: string;
  title: string;
  description: string;
  modified: string;
}

interface LayoutProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
}

const WeightRequestAlert = () => {
  const client = useClientStore(state => state.client);
  const [showWeightModal, setShowWeightModal] = useState(false);

  if (!client?.request_weight) return null;

  return (
    <>
      <div className="w-full px-4 py-3.5 bg-gradient-to-r from-warning-600 to-warning-400 shadow-lg animate-fadeIn">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="relative p-2.5 bg-white/10 backdrop-blur-md rounded-xl 
                  transition-all duration-300 ease-out hover:scale-110 hover:bg-white/20
                  before:absolute before:inset-0 before:rounded-xl before:bg-white/5 
                  before:animate-pulse group overflow-hidden
                  border border-white/10 shadow-xl"
              >
                <Scale className="w-5 h-5 text-white relative z-10 transition-transform 
                  [animation:weightIcon_4s_ease-in-out_infinite] group-hover:animate-none" 
                />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base mb-0.5">Update your weight!</h4>
                <p className="text-sm font-medium text-white/90">
                  Your coach has requested a weight update
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-white/95 text-warning-600 font-medium shadow-lg
                hover:bg-white hover:scale-105 transition-all duration-300"
              variant="solid"
              onPress={() => setShowWeightModal(true)}
            >
              Update Weight
            </Button>
          </div>
        </div>
      </div>
      <WeightModal
        isOpen={showWeightModal}
        onClose={() => setShowWeightModal(false)}
        onWeightLogged={() => useClientStore.getState().refetchData()}
        clientId={client.name}
        currentWeight={client.current_weight}
        weightGoal={client.goal}
      />
    </>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, hideNavigation = false }) => {
  const location = useLocation();
  const { announcement, dismiss } = useAnnouncement();

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

        {/* Announcement Banner */}
        {announcement && !hideNavigation && (
          <div className={`w-full px-4 py-3 ${announcement.bg_class}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-md">{announcement.title}</h3>
                <p className="text-xs mt-1 opacity-90">{announcement.description}</p>
              </div>
              <button 
                onClick={dismiss}
                className="ml-4 opacity-70 hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        
        {/* Weight Request Alert */}
        {!hideNavigation && <WeightRequestAlert />}
        
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
        
        {/* Offline Indicator */}
        <OfflineIndicator />
        
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