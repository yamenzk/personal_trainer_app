// Create a new component: src/components/workout/ContextualTip.tsx

import { motion } from "framer-motion";
import { Sun, Moon, Dumbbell, Target, Trophy, Flame, Coffee, Wind, Battery } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import { Plan } from "@/types/plan";

interface ContextualTipProps {
  plan: Plan;
  selectedDay: number | null;
  completedWorkouts: number;
  totalWorkouts: number;
  streak: number;
}

const getTimeBasedTip = () => {
  const hour = new Date().getHours();
  
  if (hour < 9) return {
    icon: Sun,
    message: "Early bird gains! Starting strong",
    gradient: "from-orange-500/20 to-yellow-500/20"
  };
  
  if (hour > 20) return {
    icon: Moon,
    message: "Night owl workout! Dedication level: 100",
    gradient: "from-indigo-500/20 to-purple-500/20"
  };
  
  if (hour > 11 && hour < 14) return {
    icon: Coffee,
    message: "Lunch break warrior! Making time for gains",
    gradient: "from-amber-500/20 to-orange-500/20"
  };

  return {
    icon: Dumbbell,
    message: "Perfect time for a workout! Let's crush it",
    gradient: "from-blue-500/20 to-cyan-500/20"
  };
};

const getProgressTip = (completed: number, total: number) => {
  const percentage = (completed / total) * 100;
  
  if (percentage === 0) return {
    icon: Target,
    message: "Fresh week, fresh goals! Ready to begin?",
    gradient: "from-emerald-500/20 to-green-500/20"
  };

  if (percentage >= 80) return {
    icon: Trophy,
    message: "Almost there! Finishing strong this week",
    gradient: "from-yellow-500/20 to-amber-500/20"
  };

  if (percentage >= 50) return {
    icon: Flame,
    message: "Halfway point! Keep that momentum going",
    gradient: "from-orange-500/20 to-red-500/20"
  };

  return {
    icon: Battery,
    message: `${percentage.toFixed(0)}% through the week! Building momentum`,
    gradient: "from-blue-500/20 to-indigo-500/20"
  };
};

const getStreakTip = (streak: number) => {
  if (streak > 10) return {
    icon: Flame,
    message: `${streak} day streak! You're on Flame! 🔥`,
    gradient: "from-red-500/20 to-orange-500/20"
  };

  if (streak > 5) return {
    icon: Wind,
    message: `${streak} days and counting! Consistency is key 🌟`,
    gradient: "from-purple-500/20 to-pink-500/20"
  };

  return null;
};

export const ContextualTip: React.FC<ContextualTipProps> = ({
    plan,
    selectedDay,
    completedWorkouts,
    totalWorkouts,
    streak
  }) => {
    const streakTip = getStreakTip(streak);
    const progressTip = getProgressTip(completedWorkouts, totalWorkouts);
    const timeTip = getTimeBasedTip();
    
    const tipToShow = timeTip; //streakTip || progressTip || timeTip;
    const Icon = tipToShow.icon;
  
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-6 -mt-2"
      >
        <div className={cn(
          "flex items-center gap-2 justify-center",
          "py-2 px-3 rounded-full",
          "shadow-sm"
        )}>
          {/* Animated Icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className={cn(
              "p-1.5 rounded-full",
              "bg-secondary-500/10",
            )}
          >
            <Icon className="w-3.5 h-3.5 text-secondary-500" />
          </motion.div>
  
          {/* Message with Gradient Text */}
          <div className="flex items-center gap-1.5">
            <p className={cn(
              "text-xs font-medium",
              "bg-gradient-to-r from-secondary-500 to-primary-500 text-transparent bg-clip-text"
            )}>
              {tipToShow.message}
            </p>
          </div>
  
          {/* Optional: Decorative dots */}
          {/* <div className="flex items-center gap-0.5 ml-auto opacity-30">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-0.5 h-0.5 rounded-full bg-secondary-500"
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity
                }}
              />
            ))}
          </div> */}
        </div>
      </motion.div>
    );
  };