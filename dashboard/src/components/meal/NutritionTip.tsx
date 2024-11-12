
import { motion } from "framer-motion";
import { Utensils, Coffee, Sun, Moon, Apple, Salad, Beef, Scale, Battery } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import { Plan } from "@/types/plan";

interface NutritionTipProps {
  plan: Plan;
  selectedDay: number | null;
}

const getTimeBasedTip = () => {
  const hour = new Date().getHours();
  
  if (hour < 9) return {
    icon: Coffee,
    message: "Start your day with a balanced breakfast!",
    gradient: "from-orange-500/20 to-yellow-500/20"
  };
  
  if (hour > 20) return {
    icon: Moon,
    message: "Time for a light, protein-rich evening meal",
    gradient: "from-indigo-500/20 to-purple-500/20"
  };
  
  if (hour > 11 && hour < 14) return {
    icon: Sun,
    message: "Perfect time for your main meal of the day",
    gradient: "from-amber-500/20 to-orange-500/20"
  };

  if (hour > 14 && hour < 17) return {
    icon: Apple,
    message: "Keep energy levels up with a healthy snack",
    gradient: "from-green-500/20 to-emerald-500/20"
  };

  return {
    icon: Utensils,
    message: "Stay on track with your nutrition goals",
    gradient: "from-blue-500/20 to-cyan-500/20"
  };
};

const getMealTip = (plan: Plan, selectedDay: number | null) => {
  if (!selectedDay) return null;
  
  const dayKey = `day_${selectedDay}`;
  const dayPlan = plan.days[dayKey];
  
  if (!dayPlan?.foods?.length) return {
    icon: Scale,
    message: "Plan your meals ahead for better results",
    gradient: "from-purple-500/20 to-pink-500/20"
  };

  const proteinRich = dayPlan.foods.some(f => f.ref.includes('chicken') || f.ref.includes('fish') || f.ref.includes('beef'));
  const hasVeggies = dayPlan.foods.some(f => f.ref.includes('salad') || f.ref.includes('vegetable'));

  if (proteinRich && hasVeggies) return {
    icon: Salad,
    message: "Great balance of protein and veggies today!",
    gradient: "from-green-500/20 to-emerald-500/20"
  };

  if (proteinRich) return {
    icon: Beef,
    message: "Good protein intake, try adding more veggies",
    gradient: "from-orange-500/20 to-red-500/20"
  };

  return {
    icon: Battery,
    message: "Focus on protein-rich foods for better results",
    gradient: "from-blue-500/20 to-indigo-500/20"
  };
};

export const NutritionTip: React.FC<NutritionTipProps> = ({
  plan,
  selectedDay
}) => {
  const mealTip = getMealTip(plan, selectedDay);
  const timeTip = getTimeBasedTip();
  
  const tipToShow = mealTip || timeTip;
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
          className={cn(
            "p-1.5 rounded-full",
            "bg-secondary-500/10",
          )}
        ></motion.div>
          <Icon className="w-3.5 h-3.5 text-secondary-500" />
        </motion.div>

        <div className="flex items-center gap-1.5"></div>
          <p className={cn(
            "text-xs font-medium",
            "bg-gradient-to-r from-secondary-500 to-primary-500 text-transparent bg-clip-text"
          )}>
            {tipToShow.message}
          </p>
        </div>
      </div>
    </motion.div>
  );
};