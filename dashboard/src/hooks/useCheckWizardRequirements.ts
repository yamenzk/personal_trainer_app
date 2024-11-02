// src/hooks/useCheckWizardRequirements.ts
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useWizard } from '@/providers/WizardProvider';

export const useCheckWizardRequirements = () => {
  const { client } = useAuthStore();
  const { openWizard } = useWizard();

  useEffect(() => {
    if (!client) return;

    // Check for missing required fields
    const requiredFields = [
      'client_name',
      'date_of_birth',
      'gender',
      'mobile',
      'nationality',
      'goal',
      'target_weight',
      'meals',
      'workouts',
      'equipment',
      'activity_level',
      'height'
    ];

    const hasMissingFields = requiredFields.some(field => 
      !client[field as keyof typeof client] || 
      client[field as keyof typeof client] === 0
    );

    if (hasMissingFields) {
      openWizard('onboarding');
      return;
    }

    // Check if weight update is requested
    if (client.request_weight === 1) {
      openWizard('weight-update');
    }
  }, [client]);
};