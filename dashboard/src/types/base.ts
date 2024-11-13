// src/types/base.ts

import { LucideIcon } from 'lucide-react';

export interface BaseStepProps {
  onComplete: (value: any) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialValue?: any;
}

export interface WithPreferencesUpdate {
  onPreferencesUpdate?: (steps: string[]) => void;
}

export interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
  className?: string;
}

export interface PreferenceCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  unlocked: boolean;
}

export interface MilestoneProgress {
  current: number;
  next: number;
  progress: number;
}

export interface Country {
  name: string;
  code: string;
}

export interface PromoCode {
    name: string;
    title: string;
    description: string;
}
  
export interface PromoCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    membershipId: string;
}

export interface PromoCodeButtonProps {
  membershipId: string;
  variant?: "flat" | "solid" | "bordered" | "light" | "ghost" | "shadow" | "faded";
  className?: string;
}

export type WeekDay = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

