// src/utils/api.ts
import { ApiResponse } from '../types/api';
import { Plan, DayPlan } from '../types/plan';
import { RegularExercise } from '../types/workout';

export const API_BASE_URL = '/api/v2/method/personal_trainer_app.api';

export async function getMembership(membershipId: string): Promise<ApiResponse<any>> {
  const response = await fetch(`${API_BASE_URL}.get_membership?membership=${membershipId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch membership data');
  }
  return response.json();
}

export async function updateClient(clientId: string, updates: Record<string, any>): Promise<void> {
  const params = new URLSearchParams({
    client_id: clientId,
    ...updates
  });
  
  const response = await fetch(`${API_BASE_URL}.update_client?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to update client data');
  }
}

export async function logPerformance(
    clientId: string,
    exercise: string,
    weight: number,
    reps: number,
    exerciseDay: string
  ): Promise<void> {
    const params = new URLSearchParams({
      client_id: clientId,
      is_performance: '1',
      exercise_ref: exercise,
      weight: weight.toString(),
      reps: reps.toString(),
      exercise_day: exerciseDay
    });
    
    const response = await fetch(`${API_BASE_URL}.update_client?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to log performance');
    }
  }

export async function updateWeight(
  clientId: string,
  weight: number,
  requestWeight: boolean = false
): Promise<void> {
  const params = new URLSearchParams({
    client_id: clientId,
    weight: weight.toString()
  });
  
  if (requestWeight) {
    params.append('request_weight', '0');
  }
  
  const response = await fetch(`${API_BASE_URL}.update_client?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to update weight');
  }
}

export const isPlanDayCompleted = (dayPlan: DayPlan): boolean => {
    if (!dayPlan?.exercises) return false;
  
    // Filter out superset exercises and check if all regular exercises are logged
    const regularExercises = dayPlan.exercises.filter(
      ex => ex.type === 'regular'
    ) as RegularExercise[];
  
    return regularExercises.every(ex => ex.exercise.logged === 1);
  };
  
  export const calculatePlanProgress = (plan: Plan): number => {
    if (!plan?.days) return 0;
  
    const totalDays = Object.keys(plan.days).length;
    const completedDays = Object.values(plan.days).filter(day => 
      isPlanDayCompleted(day)
    ).length;
  
    return (completedDays / totalDays) * 100;
  };