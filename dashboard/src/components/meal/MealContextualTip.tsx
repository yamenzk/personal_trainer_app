
import { motion } from "framer-motion";
import { Coffee, Sun, Moon, Apple, Utensils, Clock, Carrot, Beef } from "lucide-react";
import { cn } from "@/utils/cn";
import { MealContextualTipProps } from "@/types";

const getTimeBasedTip = () => {
  const hour = new Date().getHours();
  
  if (hour < 10) return {
    icon: Coffee,
    message: "Start your day with a nutritious breakfast!",
    gradient: "from-orange-500/20 to-yellow-500/20"
  };
  
  if (hour >= 22 || hour < 5) return {
    icon: Moon,
    message: "Late night? Keep it light and protein-rich",
    gradient: "from-indigo-500/20 to-purple-500/20"
  };
  
  if (hour >= 11 && hour < 14) return {
    icon: Sun,
    message: "Time for a balanced lunch to fuel your day",
    gradient: "from-amber-500/20 to-orange-500/20"
  };

  if (hour >= 17 && hour < 20) return {
    icon: Utensils,
    message: "Dinner time! Remember portion control",
    gradient: "from-blue-500/20 to-cyan-500/20"
  };

  return {
    icon: Apple,
    message: "Great time for a healthy snack!",
    gradient: "from-green-500/20 to-emerald-500/20"
  };
};

const getNutritionTip = () => {
  const tips = [
    {
      icon: Beef,
      message: "Include lean proteins in every meal",
      gradient: "from-red-500/20 to-orange-500/20"
    },
    {
      icon: Carrot,
      message: "Aim for colorful vegetables on your plate",
      gradient: "from-orange-500/20 to-yellow-500/20"
    },
    {
      icon: Clock,
      message: "Space your meals 3-4 hours apart",
      gradient: "from-blue-500/20 to-indigo-500/20"
    }
  ];

  return tips[Math.floor(Math.random() * tips.length)];
};

export const MealContextualTip: React.FC<MealContextualTipProps> = ({
  }) => {
  const tipToShow = Math.random() > 0.5 ? getTimeBasedTip() : getNutritionTip();
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
          className="p-1.5 rounded-full bg-secondary-500/10"
        >
          <Icon className="w-3.5 h-3.5 text-secondary-500" />
        </motion.div>

        <p className={cn(
          "text-xs font-medium",
          "bg-gradient-to-r from-secondary-500 to-primary-500 text-transparent bg-clip-text"
        )}>
          {tipToShow.message}
        </p>
      </div>
    </motion.div>
  );
};