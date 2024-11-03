// src/hooks/usePlans.ts
import { useMemo } from 'react';
import { Plan } from '../types/plan';

interface UsePlansReturn {
  activePlan: Plan | null;
  completedPlans: Plan[];
  scheduledPlans: Plan[];
  currentDay: number;
}

export function usePlans(plans: Plan[]): UsePlansReturn {
  return useMemo(() => {
    const activePlan = plans.find(plan => plan.status === 'Active') ?? null;
    const completedPlans = plans.filter(plan => plan.status === 'Completed');
    const scheduledPlans = plans.filter(plan => plan.status === 'Scheduled');
    
    // Calculate current day number (1-7) based on active plan's start date
    let currentDay = 1;
    if (activePlan) {
      const startDate = new Date(activePlan.start);
      const today = new Date();
      const diffTime = today.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      currentDay = ((diffDays % 7) + 1);
    }

    return {
      activePlan,
      completedPlans,
      scheduledPlans,
      currentDay
    };
  }, [plans]);
}