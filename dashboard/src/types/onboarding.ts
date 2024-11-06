// src/types/onboarding.ts
export interface BaseStepProps {
  onComplete: (value: any) => void;
  isLoading?: boolean;
}

export interface DateOfBirthStepProps extends BaseStepProps {
  onComplete: (value: string) => void;
}

export interface GenderStepProps extends BaseStepProps {
  onComplete: (value: 'Male' | 'Female') => void;
}

export interface EmailStepProps extends BaseStepProps {
  onComplete: (value: string) => void;
}

export interface NationalityStepProps extends BaseStepProps {
  onComplete: (value: string) => void;
}

export interface MealsStepProps extends BaseStepProps {
  onComplete: (value: number) => void;
}

export interface WorkoutsStepProps extends BaseStepProps {
  onComplete: (value: number) => void;
}

export interface ActivityLevelStepProps extends BaseStepProps {
  onComplete: (value: 'Sedentary' | 'Light' | 'Moderate' | 'Very Active' | 'Extra Active') => void;
}

export interface EquipmentStepProps extends BaseStepProps {
  onComplete: (value: 'Gym' | 'Home') => void;
}

export interface HeightStepProps extends BaseStepProps {
  onComplete: (value: number) => void;
}

export interface WeightStepProps extends BaseStepProps {
  onComplete: (value: number) => void;
}

export interface TargetWeightStepProps extends BaseStepProps {
  onComplete: (value: number) => void;
  currentWeight: number;
}

export interface NameStepProps extends BaseStepProps {
  onComplete: (value: string) => void;
}