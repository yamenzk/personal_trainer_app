// utils/statsCalculator.ts
import { Client } from "@/types/client";
import { Plan } from "@/types/plan";
import { differenceInDays, subDays, isWithinInterval } from 'date-fns';
import { Scale, Dumbbell, Target, Activity} from 'lucide-react'

type Weight = {
    weight: number;
    date: string;
  };

export const calculateWeightStats = (weights: Weight[]) => {
  if (!weights.length) return { 
    totalLoss: 0, 
    weeklyChange: 0,
    trend: 'neutral' as const 
  };

  const sortedWeights = [...weights].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const initialWeight = sortedWeights[0].weight;
  const currentWeight = sortedWeights[sortedWeights.length - 1].weight;
  const totalLoss = initialWeight - currentWeight;

  // Calculate weekly change
  const today = new Date();
  const lastWeekWeights = sortedWeights.filter(w => 
    isWithinInterval(new Date(w.date), {
      start: subDays(today, 7),
      end: today
    })
  );

  const weeklyChange = lastWeekWeights.length > 1 
    ? lastWeekWeights[lastWeekWeights.length - 1].weight - lastWeekWeights[0].weight
    : 0;

  return {
    totalLoss,
    weeklyChange,
    trend: weeklyChange < 0 ? 'down' as const : weeklyChange > 0 ? 'up' as const : 'neutral' as const
  };
};


export const calculateWorkoutStats = (plans: Plan[]) => {
  const activePlan = plans.find(p => p.status === 'Active');
  if (!activePlan) return { 
    completed: 0, 
    total: 0, 
    weeklyChange: 0 
  };

  const allWorkouts = Object.values(activePlan.days)
    .filter(day => day.completed)
    .length;

  const today = new Date();
  const lastWeekWorkouts = Object.entries(activePlan.days)
    .filter(([_, day]) => 
      day.completed && 
      isWithinInterval(new Date(activePlan.start), {
        start: subDays(today, 7),
        end: today
      })
    ).length;

  const previousWeekWorkouts = Object.entries(activePlan.days)
    .filter(([_, day]) => 
      day.completed && 
      isWithinInterval(new Date(activePlan.start), {
        start: subDays(today, 14),
        end: subDays(today, 7)
      })
    ).length;

  return {
    completed: allWorkouts,
    total: Object.keys(activePlan.days).length,
    weeklyChange: lastWeekWorkouts - previousWeekWorkouts
  };
};

export const calculateAchievements = (client: Client, plans: Plan[]) => {
  const weightChange = calculateWeightStats(client.weight);
  const workoutStats = calculateWorkoutStats(plans);

  return [
    {
      title: "Weight Progress",
      description: `${Math.abs(weightChange.totalLoss).toFixed(1)}kg ${weightChange.totalLoss < 0 ? 'gained' : 'lost'}`,
      icon: Scale,
      progress: Math.min(100, Math.abs((weightChange.totalLoss / 5) * 100)), // Assuming 5kg is target
      color: weightChange.totalLoss > 0 ? "success" : "warning" as const
    },
    {
      title: "Workout Consistency",
      description: `${workoutStats.completed} workouts completed`,
      icon: Dumbbell,
      progress: (workoutStats.completed / workoutStats.total) * 100,
      color: "primary" as const
    },
    {
      title: "Goal Progress",
      description: client.goal,
      icon: Target,
      progress: calculateGoalProgress(client),
      color: "secondary" as const
    },
    {
      title: "Activity Level",
      description: client.activity_level,
      icon: Activity,
      progress: calculateActivityProgress(client),
      color: "warning" as const
    }
  ];
};

export const calculateGoalProgress = (client: Client) => {
  if (!client.weight.length) return 0;
  
  const totalWeightToLose = client.weight[0].weight - client.target_weight;
  const weightLost = client.weight[0].weight - client.current_weight;
  
  return Math.min(100, Math.max(0, (weightLost / totalWeightToLose) * 100));
};

export const calculateActivityProgress = (client: Client) => {
  const activityLevels = {
    'Sedentary': 20,
    'Light': 40,
    'Moderate': 60,
    'Very Active': 80,
    'Extra Active': 100
  };

  return activityLevels[client.activity_level] || 0;
};

export const calculateTrainingStats = (client: Client, plans: Plan[]) => {
  const activePlan = plans.find(p => p.status === 'Active');
  if (!activePlan) return {
    activeDays: 0,
    totalWorkouts: 0,
    caloriesBurned: 0,
    completionRate: 0
  };

  const completedDays = Object.values(activePlan.days).filter(day => day.completed).length;
  const totalDays = Object.keys(activePlan.days).length;
  const averageCaloriesPerWorkout = 500; // This should ideally come from actual workout data

  return {
    activeDays: completedDays,
    totalWorkouts: completedDays * parseInt(activePlan.config.weekly_workouts),
    caloriesBurned: completedDays * averageCaloriesPerWorkout,
    completionRate: (completedDays / totalDays) * 100
  };
};