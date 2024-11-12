import { OnboardingWizard } from '../onboarding/OnboardingWizard';
import { Modal, ModalContent } from '@nextui-org/react';
import { Client } from '@/types/client';
import { useState, useEffect } from 'react';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  onComplete: () => void;
}

const PREFERENCE_STEPS = [
  'Goal',
  'TargetWeight',
  'ActivityLevel',
  'Equipment',
  'Workouts',
  'Meals'
];

export const PreferencesModal = ({ isOpen, onClose, client, onComplete }: PreferencesModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  // Don't render anything if not open
  if (!isOpen) return null;

  // Create initial data with current weight as a Weight array entry
  const clientDataWithWeight = {
    ...client,
    weight: [{
      weight: client.current_weight,
      date: new Date().toISOString().split('T')[0]
    }]
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      hideCloseButton
      className="m-0 p-0"
      classNames={{
        wrapper: "m-0",
        base: "m-0",
      }}
    >
      <ModalContent className="m-0 p-0">
        <OnboardingWizard
          clientData={clientDataWithWeight}
          onComplete={handleComplete}
          steps={PREFERENCE_STEPS}
        />
      </ModalContent>
    </Modal>
  );
};