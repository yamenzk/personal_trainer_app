import { useState } from 'react';
import { AnimatePresence } from "framer-motion";
import { useAuth } from '../contexts/AuthContext';
import { WeightModal } from '../components/shared/WeightModal';
import { usePreferencesUpdate } from '../App';
import { PageTransition } from '@/components/shared/PageTransition';
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';
import { MembershipSection } from '@/components/profile/MembershipSection';
import { PersonalInfoSection } from '@/components/profile/PersonalInfoSection';
import { ReferralSection } from '@/components/profile/ReferralSection';
import { HeroSection } from '@/components/profile/HeroSection';
import { FitnessPreferencesSection } from '@/components/profile/FitnessPreferencesSection';

// Hook imports
import { useClientData } from '../hooks/useClientData';

// Main Profile component
export default function Profile() {
  const { loading, error, client, membership, refreshData } = useClientData();
  const [showWeightModal, setShowWeightModal] = useState(false);
  const { logout } = useAuth();
  const runPreferencesUpdate = usePreferencesUpdate(); // Changed this line

  return (
    <PageTransition
      loading={loading}
      error={error}
      skeleton={<ProfileSkeleton />}
    >
      {client && membership && (
        <div className="min-h-screen w-full">
          <div className="container mx-auto space-y-12">
            <HeroSection client={client} onLogout={logout} membership={membership} />
            <MembershipSection membership={membership} />
            <PersonalInfoSection client={client} />
            <FitnessPreferencesSection 
              client={client} 
              updatePreferences={() => runPreferencesUpdate(PREFERENCE_STEPS)}
              refreshData={refreshData}  // Add this prop
            />
            <ReferralSection client={client} refreshData={refreshData} />

            {/* Weight Modal */}
            <AnimatePresence>
              {showWeightModal && (
                <WeightModal
                  isOpen={showWeightModal}
                  onClose={() => setShowWeightModal(false)}
                  onWeightLogged={refreshData}
                  clientId={client.name}
                  currentWeight={client.current_weight}
                  weightGoal={client.goal}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </PageTransition>
  );
}

const PREFERENCE_STEPS = [
  'Goal',
  'TargetWeight',
  'ActivityLevel',
  'Equipment',
  'Workouts',
  'Meals'
];