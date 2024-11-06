// src/types/achievements.ts
export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    unlocked: boolean;
  }
  
  export interface MilestoneProgress {
    current: number;
    next: number;
    progress: number;
  }