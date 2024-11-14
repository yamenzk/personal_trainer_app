import { Button, Card, CardBody, Progress, Avatar, AvatarGroup } from "@nextui-org/react";
import { 
  Dumbbell,
  ArrowRight,
  Trophy,
  Target,
  TimerIcon,
  Sparkles,
  Moon,
  Stars,
  BedDouble
} from 'lucide-react';
import { motion } from "framer-motion";
import { Client } from '@/types/client';
import { Plan } from '@/types/plan';
import { ExerciseBase, ExerciseReference, Exercise } from '@/types/workout';
import { cn } from '@/utils/cn';
import { useNavigate } from 'react-router-dom';

interface WorkoutProgressProps {
  client: Client;
  activePlan: Plan | null;
  completedPlans: Plan[];
  currentDay: number;
  planProgress: number;
  exerciseRefs: { [key: string]: ExerciseReference };
}

export const WorkoutProgress = ({
  client,
  activePlan,
  completedPlans,
  currentDay,
  planProgress,
  exerciseRefs = {}
}: WorkoutProgressProps) => {
  const navigate = useNavigate();
  if (!activePlan) return null;

  const todayExercises = activePlan.days[`day_${currentDay}`]?.exercises || [];
  const completedExercises = todayExercises.filter(ex => 
    ex.type === 'regular' ? ex.exercise.logged === 1 :
    ex.type === 'superset' && ex.exercises.every(e => e.logged === 1)
  ).length;

  const isRestDay = todayExercises.length === 0;
  const isAllCompleted = completedExercises === todayExercises.length;
  const completionPercentage = (completedExercises / todayExercises.length) * 100;

  // Update the exercise images mapping
  const exerciseImages = todayExercises.flatMap(exercise => {
    if (exercise.type === 'regular') {
      const ref = exerciseRefs[exercise.exercise.ref] || {};
      return [{
        src: ref?.thumbnail || ref?.starting || '/exercise-placeholder.png',
        isCompleted: exercise.exercise.logged === 1
      }];
    } else {
      return exercise.exercises.map(ex => {
        const ref = exerciseRefs[ex.ref] || {};
        return {
          src: ref?.thumbnail || ref?.starting || '/exercise-placeholder.png',
          isCompleted: ex.logged === 1
        };
      });
    }
  });

  const miniStats = [
    {
      icon: Trophy,
      value: completedPlans.length,
      label: "Plans",
      color: "success"
    },
    {
      icon: Target,
      value: `${currentDay}/7`,
      label: "Day",
      color: "warning"
    },
    {
      icon: TimerIcon,
      value: `${Math.round(planProgress)}%`,
      label: "Progress",
      color: "primary"
    }
  ];

  const motivationalMessages = [
    "You crushed it today! 💪",
    "Amazing work! Keep it up! 🎉",
    "You're on fire! 🔥",
    "Workout complete! You're unstoppable! ⚡",
    "Another day, another victory! 🏆",
    "Goals achieved! You're a champion! 🌟",
    "Strength level up! 💯",
    "Perfect form, perfect finish! 🎯"
  ];

  const restMessages = [
    "Sweet dreams, champion! 💤",
    "Rest & recover! 🌙",
    "Time to recharge! 🛏️",
    "Your muscles thank you! 😴",
    "Rest day = Growth day! ⭐",
    "Catch those Zzz's! 💫",
    "Recovery in progress... 🌠",
    "Rest & come back stronger! 🌛"
  ];

  const randomMotivationalMessage = 
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  
  const randomRestMessage = 
    restMessages[Math.floor(Math.random() * restMessages.length)];

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardBody className="p-4">
        <div className="relative overflow-hidden rounded-xl">
          {/* Background with conditional styling */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br",
            isRestDay 
              ? "from-blue-900 via-indigo-900 to-violet-900" 
              : "from-secondary-500 via-secondary-600 to-secondary-700"
          )} />
          
          {/* Stars animation for rest day */}
          {isRestDay && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          )}
          
          <div className="relative p-4 space-y-4">
            {isRestDay ? (
              // Rest Day Message
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="p-2 bg-white/10 rounded-full">
                    <Moon className="w-5 h-5 text-white" />
                  </div>
                  {/* Animated Zs */}
                  <motion.div
                    className="absolute -top-1 -right-3 text-white text-xs font-bold"
                    animate={{
                      y: [-4, -8, -4],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    Z
                  </motion.div>
                  <motion.div
                    className="absolute -top-2 right-0 text-white text-xs font-bold"
                    animate={{
                      y: [-4, -8, -4],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: 0.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    z
                  </motion.div>
                  <motion.div
                    className="absolute -top-3 right-3 text-white text-xs font-bold"
                    animate={{
                      y: [-4, -8, -4],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: 0.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    z
                  </motion.div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {randomRestMessage}
                  </h3>
                  <p className="text-sm text-white/80">
                    Recovery day for optimal gains
                  </p>
                </div>
              </div>
            ) : isAllCompleted ? (
              // Completion Message
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-full">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {randomMotivationalMessage}
                  </h3>
                  <p className="text-sm text-white/80">
                    All {todayExercises.length} exercises completed
                  </p>
                </div>
              </div>
            ) : (
              // Regular Progress Display
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-full">
                    <Dumbbell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">Today's Workout</h3>
                    <p className="text-sm text-white/80">
                      {completedExercises} of {todayExercises.length} completed
                    </p>
                  </div>
                </div>
                <Button
                  className="bg-white text-secondary-500 font-medium"
                  endContent={<ArrowRight className="w-4 h-4" />}
                  size="sm"
                  onClick={() => navigate('/workouts')}
                >
                  Start
                </Button>
              </div>
            )}

            {/* Mini Stats */}
            <div className="flex justify-between items-center">
              {miniStats.map((stat, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2"
                >
                  <div className={cn(
                    "p-1.5 rounded-full",
                    isRestDay ? "bg-white/5" : "bg-white/10"
                  )}>
                    <stat.icon className={cn(
                      "w-3.5 h-3.5",
                      isRestDay ? "text-white/60" : "text-white"
                    )} />
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    isRestDay ? "text-white/60" : "text-white"
                  )}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            {!isRestDay && !isAllCompleted && (
              <div className="flex items-center gap-4">
                {/* Progress Bar */}
                <div className="flex-1">
                  <Progress
                    value={completionPercentage}
                    color="success"
                    size="sm"
                    radius="full"
                    classNames={{
                      base: "w-full",
                      track: "bg-white/20",
                      indicator: "bg-white",
                    }}
                  />
                </div>
                
                {/* Exercise Avatars */}
                <AvatarGroup
                  max={5}
                  total={exerciseImages.length}
                  size="sm"
                  renderCount={(count) => (
                    <Avatar
                      classNames={{
                        base: "bg-white/10",
                        fallback: "text-white text-tiny",
                      }}
                      size="sm"
                      fallback={`+${count}`}
                    />
                  )}
                >
                  {exerciseImages.map((exercise, index) => (
                    <Avatar
                      key={index}
                      src={exercise.src}
                      classNames={{
                        base: cn(
                          "border-2",
                          exercise.isCompleted 
                            ? "border-white/50 opacity-50"
                            : "border-white"
                        )
                      }}
                    />
                  ))}
                </AvatarGroup>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};