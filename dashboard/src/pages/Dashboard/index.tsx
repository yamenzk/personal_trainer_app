// src/pages/Dashboard/index.tsx
import React, { useMemo } from 'react';
import { 
  Target, 
  Activity,
  Scale,
  Trophy,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { StatCard } from '@/components/dashboard/StatCard';
import { ProgressCard } from '@/components/dashboard/ProgressCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { LoadingScreen } from '@/components/ui/loading';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { client, plans, membership } = useAuthStore();

  // All hooks must be called before any conditional returns
  const weightData = useMemo(() => {
    if (!client?.weight || client.weight.length === 0) return [];
    return client.weight.map(entry => ({
      date: new Date(entry.date).toLocaleDateString(),
      weight: entry.weight
    }));
  }, [client?.weight]);

  const weightMetrics = useMemo(() => {
    if (weightData.length < 2) return { change: 0, isPositive: false, isOnTrack: false };
    
    const latest = weightData[weightData.length - 1].weight;
    const previous = weightData[weightData.length - 2].weight;
    const change = latest - previous;
    const changePercentage = (change / previous) * 100;

    const isOnTrack = (() => {
      if (!client?.goal) return false;
      switch (client.goal.toLowerCase()) {
        case 'weight loss':
          return change < 0;
        case 'weight gain':
        case 'muscle building':
          return change > 0;
        case 'maintenance':
          return Math.abs(changePercentage) <= 1;
        default:
          return false;
      }
    })();

    return {
      change: Math.abs(changePercentage),
      isPositive: change > 0,
      isOnTrack
    };
  }, [weightData, client?.goal]);

  const activePlan = useMemo(() => 
    plans?.find(plan => plan.status === 'Active'),
    [plans]
  );

  const todaysPlan = useMemo(() => {
    if (!activePlan) return null;
    const today = new Date();
    const dayOfWeek = today.getDay();
    const currentDayKey = `day_${dayOfWeek + 1}` as keyof typeof activePlan.days;
    return activePlan.days[currentDayKey];
  }, [activePlan]);

  const dailyNutrition = useMemo(() => todaysPlan?.totals || {
    energy: { value: 0, unit: 'kcal' },
    protein: { value: 0, unit: 'g' },
    carbs: { value: 0, unit: 'g' },
    fat: { value: 0, unit: 'g' }
  }, [todaysPlan]);

  // Now we can do our conditional return for loading state
  if (!client || !plans || !membership) {
    return <LoadingScreen />;
  }

  const renderWelcomeSection = () => (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            Welcome back, {client.client_name.split(' ')[0]}!
          </h1>
          <p className="text-white/80">
            {weightMetrics.isOnTrack 
              ? "You're making great progress towards your goals!" 
              : "Keep pushing towards your goals!"}
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-white/20 rounded-xl p-2 backdrop-blur-sm">
          <Trophy className="w-5 h-5" />
          <span className="text-sm">{membership.package}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5" />
            <span>Current Weight</span>
          </div>
          <p className="text-2xl font-bold mt-2">
            {weightData[weightData.length - 1]?.weight || 0} kg
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Target Weight</span>
          </div>
          <p className="text-2xl font-bold mt-2">{client.target_weight} kg</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Weekly Activity</span>
          </div>
          <p className="text-2xl font-bold mt-2">{client.workouts} workouts</p>
        </div>
      </div>
    </div>
  );

  const renderWeightProgress = () => weightData.length > 0 && (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Weight Progress</h2>
        <StatCard
          title="Weight Change"
          value={`${weightData[weightData.length - 1]?.weight || 0} kg`}
          icon={Scale}
          trend={{
            value: weightMetrics.change,
            isUpward: weightMetrics.isPositive,
            isSuccess: weightMetrics.isOnTrack
          }}
          color="blue"
        />
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weightData}>
            <XAxis 
              dataKey="date"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={['dataMin - 1', 'dataMax + 1']}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <p className="font-medium">{payload[0].payload.date}</p>
                    <p className="text-blue-500">{payload[0].value} kg</p>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke={weightMetrics.isOnTrack ? '#10B981' : '#3B82F6'}
              strokeWidth={2}
              dot={{ strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderNutritionGoals = () => todaysPlan && (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Today's Nutrition Goals</h2>
      <ProgressCard
        title="Calories"
        current={Math.round(dailyNutrition.energy.value)}
        target={parseInt(activePlan!.targets.energy)}
        unit="kcal"
        color="bg-gradient-to-r from-orange-500 to-orange-600"
      />
      <ProgressCard
        title="Protein"
        current={Math.round(dailyNutrition.protein.value)}
        target={parseInt(activePlan!.targets.proteins)}
        unit="g"
        color="bg-gradient-to-r from-red-500 to-red-600"
      />
      <ProgressCard
        title="Carbs"
        current={Math.round(dailyNutrition.carbs.value)}
        target={parseInt(activePlan!.targets.carbs)}
        unit="g"
        color="bg-gradient-to-r from-green-500 to-green-600"
      />
      <ProgressCard
        title="Fats"
        current={Math.round(dailyNutrition.fat.value)}
        target={parseInt(activePlan!.targets.fats)}
        unit="g"
        color="bg-gradient-to-r from-yellow-500 to-yellow-600"
      />
    </div>
  );

  const renderTodaysWorkout = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Today's Workout</h2>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
        {todaysPlan?.exercises ? (
          <div className="space-y-4">
            {todaysPlan.exercises.map((exerciseItem, index) => (
              <div 
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl"
              >
                {exerciseItem.type === 'regular' ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{exerciseItem.exercise.ref}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {exerciseItem.exercise.sets} sets × {exerciseItem.exercise.reps} reps
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {exerciseItem.exercise.rest}s rest
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-purple-500 font-medium mb-2">Superset</p>
                    <div className="space-y-2">
                      {exerciseItem.exercises.map((exercise, i) => (
                        <div 
                          key={i}
                          className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{exercise.ref}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {exercise.sets} sets × {exercise.reps} reps
                            </p>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {exercise.rest}s rest
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No workout scheduled for today
          </div>
        )}
      </div>
    </div>
  );

  const renderNoActivePlan = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Active Plan</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          You currently don't have an active training plan.
          Contact your trainer to get started with a new plan.
        </p>
        <button
          onClick={() => navigate('/profile')}
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          View Profile
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {renderWelcomeSection()}
      {renderWeightProgress()}
      
      {activePlan && (
        <div className="grid grid-cols-2 gap-6">
          {renderNutritionGoals()}
          {renderTodaysWorkout()}
        </div>
      )}
      
      {!activePlan && renderNoActivePlan()}
    </div>
  );
};

export default Dashboard;