// src/types/api.ts
import { Membership } from "./membership";
import { Client } from "./client";
import { Plan } from "./plan";
import { ExerciseReference } from "./workout";
import { FoodReference } from "./meal";

export interface ApiResponse<T> {
    data: {
      membership: Membership;
      client: Client;
      plans: Plan[];
      references: {
        exercises: { [key: string]: ExerciseReference };
        foods: { [key: string]: FoodReference };
        performance: {
          [key: string]: Array<{
            weight: number;
            reps: number;
            date: string;
          }>;
        };
      };
    };
  }