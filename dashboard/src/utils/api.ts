// src/utils/api.ts

import { ApiResponse, Client, Plan, DayPlan, RegularExercise, MicrosResponse } from '@/types';

const API_BASE_URL = '/api/v2/method/personal_trainer_app.api';

/**
 * Parse Frappe error response and extract user-friendly message
 */
const extractErrorMessage = (data: any): string => {
  // Case 1: Direct error message
  if (data.error) {
    return data.error;
  }
  // Case 2: Frappe error format with _error_message
  if (data._error_message) {
    return data._error_message;
  }
  // Case 3: Errors array from Frappe
  if (data.errors && data.errors.length > 0) {
    const error = data.errors[0];
    if (error.message) {
      const match = error.message.match(/ValidationError: (.+)/);
      return match ? match[1] : error.message;
    }
    if (error.exception) {
      const lines = error.exception.split('\n');
      const lastLine = lines[lines.length - 1];
      const match = lastLine.match(/ValidationError: (.+)/);
      return match ? match[1] : lastLine;
    }
  }
  // Case 4: Exception message
  if (data.exception) {
    const match = data.exception.match(/ValidationError: (.+)/);
    return match ? match[1] : data.exception;
  }

  return 'An error occurred';
};

/**
 * Authentication & User Management
 */
export async function getMembership(membershipId: string): Promise<ApiResponse<any>> {
  const response = await fetch(`${API_BASE_URL}.get_membership?membership=${membershipId}`);
  const data = await response.json();
  
  if (!response.ok || !data.data?.membership) {
    throw new Error(data.error || 'Invalid or inactive membership ID');
  }
  
  return data;
}

export const getMembershipVersion = async (membershipId: string) => {
  const response = await fetch(`/api/method/personal_trainer_app.api.get_membership_version?membership=${membershipId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch membership version');
  }

  const data = await response.json();
  // The version is inside message.version in Frappe's response format
  return { version: data.message.version };
};

/**
 * Client Data Management
 */
export async function updateClient(clientId: string, updates: Record<string, any>): Promise<void> {
  const params = new URLSearchParams({
    client_id: clientId,
    ...updates
  });
  
  const response = await fetch(`${API_BASE_URL}.update_client?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    const errorMessage = extractErrorMessage(data);
    throw new Error(errorMessage);
  }

  if (data._server_messages) {
    try {
      const messages = JSON.parse(data._server_messages);
      const errorMessage = messages.map((m: any) => JSON.parse(m)).find((m: any) => m.indicator === 'red');
      if (errorMessage) {
        throw new Error(errorMessage.message);
      }
    } catch (e) {
      // If parsing fails, continue with the response
    }
  }
}

export async function updateWeight(
  clientId: string,
  weight: number,
  requestWeight: boolean = false
): Promise<void> {
  const params = new URLSearchParams({
    client_id: clientId,
    weight: weight.toString(),
    request_weight: requestWeight ? '1' : '0'  // This will reset the request flag
  });
  
  const response = await fetch(`${API_BASE_URL}.update_client?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to update weight');
  }
}

/**
 * Exercise & Performance Tracking
 */
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

/**
 * Food & Nutrition
 */
export async function getFoodMicros(fdcId: string): Promise<MicrosResponse> {
  const response = await fetch(`${API_BASE_URL}.get_micros?fdcid=${fdcId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch food micronutrients');
  }
  return response.json();
}

/**
 * Announcements & Promotions
 */
export async function getAnnouncement(): Promise<{ data: any }> {
  const response = await fetch('/api/v2/method/personal_trainer_app.api.get_announcement', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch announcement');
  }
  return response.json();
}

export async function getAnnouncementVersion(): Promise<{ version: string }> {
  const response = await fetch('/api/method/personal_trainer_app.api.get_announcement_version', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch announcement version');
  }
  return response.json().then(data => ({ version: data.message.version }));
}

export async function getAvailablePromoCodes(membershipId: string): Promise<{ data: any[] }> {
  const response = await fetch(`${API_BASE_URL}.get_available_codes?membership=${membershipId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch promo codes');
  }
  return response.json();
}

export async function redeemPromoCode(membershipId: string, code: string): Promise<{ data: any }> {
  const response = await fetch(`${API_BASE_URL}.redeem_code?membership=${membershipId}&code=${code}`);
  if (!response.ok) {
    throw new Error('Failed to redeem promo code');
  }
  return response.json();
}

/**
 * Referral System
 */
export async function getReferrals(clientId: string): Promise<{ data: any[] }> {
  const response = await fetch(`${API_BASE_URL}.get_referrals?client_id=${clientId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch referrals');
  }
  return response.json();
}

export async function updateReferral(clientId: string, referredBy: string): Promise<void> {
  const params = new URLSearchParams({
    client_id: clientId,
    referred_by: referredBy
  });
  
  const response = await fetch(`${API_BASE_URL}.update_client?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to update referral');
  }
}

/**
 * Utility Functions
 */
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