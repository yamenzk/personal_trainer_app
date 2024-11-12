import { motion } from "framer-motion";
import { Card } from "@nextui-org/react";
import { cn } from "@/lib/utils";
import type { NutritionTip } from "./types";

// Updated styles with more subtle design
export const nutritionTipStyles: Record<string, {
  primary: string;
  icon: string;
  border: string;
  pattern: string;
}> = {
  nutrition: {
    primary: "from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900/30",
    icon: "text-emerald-500",
    border: "border-emerald-100 dark:border-emerald-900/30",
    pattern: "radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 0.05) 1px, transparent 0)"
  },
  hydration: {
    primary: "from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900/30",
    icon: "text-blue-500",
    border: "border-blue-100 dark:border-blue-900/30",
    pattern: "radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.05) 1px, transparent 0)"
  },
  portion: {
    primary: "from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900/30",
    icon: "text-violet-500",
    border: "border-violet-100 dark:border-violet-900/30",
    pattern: "radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.05) 1px, transparent 0)"
  },
  timing: {
    primary: "from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900/30",
    icon: "text-amber-500",
    border: "border-amber-100 dark:border-amber-900/30",
    pattern: "radial-gradient(circle at 2px 2px, rgba(245, 158, 11, 0.05) 1px, transparent 0)"
  },
  mindset: {
    primary: "from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900/30",
    icon: "text-pink-500",
    border: "border-pink-100 dark:border-pink-900/30",
    pattern: "radial-gradient(circle at 2px 2px, rgba(236, 72, 153, 0.05) 1px, transparent 0)"
  },
  planning: {
    primary: "from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900/30",
    icon: "text-indigo-500",
    border: "border-indigo-100 dark:border-indigo-900/30",
    pattern: "radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.05) 1px, transparent 0)"
  }
};

interface TipCardProps {
  tip: NutritionTip;
}

export const TipCard: React.FC<TipCardProps> = ({ tip }) => {
  const style = nutritionTipStyles[tip.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card 
        className={cn(
          "overflow-hidden backdrop-blur-xl",
          "border dark:border-content3/10",
          style.border
        )}
      >
        {/* Subtle gradient background */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-50",
          style.primary
        )} />

        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{ 
            backgroundImage: style.pattern,
            backgroundSize: '16px 16px'
          }}
        />

        {/* Content */}
        <div className="relative p-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <motion.div
              className="p-2 rounded-lg bg-content3/5 backdrop-blur-xl"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity
              }}
            >
              <tip.icon className={cn("w-5 h-5", style.icon)} />
            </motion.div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold">
                {tip.title}
              </h3>
              <p className="text-sm text-foreground/60 mt-1 line-clamp-2">
                {tip.message}
              </p>
            </div>

            {/* Floating emoji */}
            <motion.div
              className="absolute text-2xl opacity-10 pointer-events-none select-none"
              animate={{
                y: [0, -10, 0],
                rotate: [-10, 10, -10],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{
                right: '1rem',
                bottom: '1rem',
              }}
            >
              {tip.emoji}
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};