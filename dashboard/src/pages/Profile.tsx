// src/pages/Profile.tsx
import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Input, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useClientData } from '../hooks/useClientData';
import { updateWeight } from '../utils/api';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileDetails from '../components/profile/ProfileDetails';
import WeightChart from '../components/profile/WeightChart';
import OnboardingWizard from '../components/onboarding/OnboardingWizard';

export default function Profile() {
  const { loading, error, client, membership, refreshData } = useClientData();
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [weightError, setWeightError] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-foreground/60">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !client || !membership) {
    return (
      <div className="text-center text-danger">
        {error || 'Failed to load profile'}
      </div>
    );
  }

  const handleWeightSubmit = async () => {
    if (!newWeight) {
      setWeightError('Please enter your weight');
      return;
    }

    const weightValue = parseFloat(newWeight);
    if (isNaN(weightValue) || weightValue <= 0) {
      setWeightError('Please enter a valid weight');
      return;
    }

    setIsUpdating(true);
    try {
      await updateWeight(client.name, weightValue);
      await refreshData();
      setShowWeightModal(false);
      setNewWeight('');
    } catch (err) {
      setWeightError('Failed to update weight');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ProfileHeader
            client={client}
            membership={membership}
            onEditPreferences={() => setShowPreferences(true)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <WeightChart
            weights={client.weight}
            onAddWeight={() => setShowWeightModal(true)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ProfileDetails client={client} />
        </motion.div>
      </div>

      {/* Weight Modal */}
      <Modal 
        isOpen={showWeightModal} 
        onClose={() => {
          setShowWeightModal(false);
          setNewWeight('');
          setWeightError('');
        }}
      >
        <ModalContent>
          <ModalHeader>Log New Weight</ModalHeader>
          <ModalBody className="p-6">
            <div className="space-y-6">
              <Input
                type="number"
                label="Weight (kg)"
                placeholder="Enter your current weight"
                value={newWeight}
                onChange={(e) => {
                  setNewWeight(e.target.value);
                  setWeightError('');
                }}
                errorMessage={weightError}
                isInvalid={!!weightError}
              />

              <div className="flex gap-2 justify-end">
                <Button
                  variant="light"
                  onPress={() => setShowWeightModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleWeightSubmit}
                  isLoading={isUpdating}
                >
                  Save Weight
                </Button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Preferences Update */}
      {showPreferences && (
        <OnboardingWizard
          clientData={client}
          onComplete={() => {
            setShowPreferences(false);
            refreshData();
          }}
        />
      )}
    </>
  );
}