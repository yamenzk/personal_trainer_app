
import { LucideIcon } from 'lucide-react';

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