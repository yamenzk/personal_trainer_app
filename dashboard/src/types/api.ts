// src/types/api.ts
import { Plan } from "./plan";
import { ExerciseReference } from "./workout";
import { FoodReference } from "./nutrition";
import { Client, Membership } from "./client";
import { PerformanceEntry } from './index';

export interface ApiResponse<T> {
  data: {
    version: string | null | undefined;
    membership: {
      name: string;
      package: string;
      client: string;
      start: string;
      end: string;
      active: number;
    };
    client: Client;
    plans: Plan[];
    references: {
      exercises: { [key: string]: ExerciseReference };
      foods: { [key: string]: FoodReference };
      performance: { [key: string]: Array<PerformanceEntry> };
    };
  };
}

export interface MicrosResponse {
  message: {
    status: string;
    micros: Record<string, number>;
  };
}

interface FrappeBoot {
  versions: {
    frappe: string;
  };
  sitename?: string;
}

interface Frappe {
  boot: FrappeBoot;
}

declare global {
  interface Window {
    frappe?: Frappe;
  }
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (membershipId: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface NavigationContextType {
  isNavigating: boolean;
  startNavigation: () => void;
  endNavigation: () => void;
  smoothNavigate: (path: string) => void;
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export interface UseClientDataReturn {
  loading: boolean;
  error: string | null;
  client: Client | null;
  membership: Membership | null;
  plans: Plan[];
  references: ApiResponse<any>['data']['references'] | null;
  refreshData: () => Promise<void>;
}

export interface ChatMessage {
  name: string;
  creation: string;
  message: string;
  response: 0 | 1;
  read: 0 | 1;
  membership: string;
}

export interface ChatResponse {
  data: ChatMessage[];
  status?: string;
  message?: string;
}