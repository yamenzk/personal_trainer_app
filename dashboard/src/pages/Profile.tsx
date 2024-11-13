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
import { useClientStore } from '@/stores/clientStore';

// Main Profile component
export default function Profile() {
  const { client, membership, isLoading: loading, error, fetch: refreshData } = useClientStore();
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
            <MembershipSection />
            <PersonalInfoSection client={client} />
            <FitnessPreferencesSection 
              client={client} 
              updatePreferences={() => runPreferencesUpdate(PREFERENCE_STEPS)}
              refreshData={refreshData}  // This is the store's fetch method
            />
            <ReferralSection client={client} /> {/* Remove refreshData prop */}

            {/* Weight Modal */}
            <AnimatePresence>
              {showWeightModal && (
                <WeightModal
                  isOpen={showWeightModal}
                  onClose={() => setShowWeightModal(false)}
                  onWeightLogged={refreshData} // And this
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