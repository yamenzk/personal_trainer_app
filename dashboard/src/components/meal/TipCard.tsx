import { motion } from "framer-motion";
import { Card } from "@nextui-org/react";
import { cn } from "@/lib/utils";
import type { NutritionTip } from "./types";

// Updated styles with modern stacked paper design
export const nutritionTipStyles: Record<string, {
  primary: string;
  secondary: string;
  accent: string;
  highlight: string;
  shadow: string;
  pattern: string;
}> = {
  nutrition: {
    primary: "from-teal-100 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-900/40",
    secondary: "emerald-500",
    accent: "#059669",
    highlight: "bg-emerald-500/10",
    shadow: "rgba(5, 150, 105, 0.2)",
    pattern: "repeating-linear-gradient(-45deg, #10b98120 0px, #10b98120 1px, transparent 1px, transparent 6px)"
  },
  hydration: {
    primary: "from-sky-100 to-blue-50 dark:from-sky-950/40 dark:to-blue-900/40",
    secondary: "blue-500",
    accent: "#3b82f6",
    highlight: "bg-blue-500/10",
    shadow: "rgba(59, 130, 246, 0.2)",
    pattern: "radial-gradient(circle at 15px 15px, #3b82f620 2px, transparent 0)"
  },
  portion: {
    primary: "from-purple-100 to-violet-50 dark:from-purple-950/40 dark:to-violet-900/40",
    secondary: "violet-500",
    accent: "#8b5cf6",
    highlight: "bg-violet-500/10",
    shadow: "rgba(139, 92, 246, 0.2)",
    pattern: "linear-gradient(45deg, #8b5cf620 25%, transparent 25%, transparent 75%, #8b5cf620 75%)"
  },
  timing: {
    primary: "from-orange-100 to-amber-50 dark:from-orange-950/40 dark:to-amber-900/40",
    secondary: "amber-500",
    accent: "#f59e0b",
    highlight: "bg-amber-500/10",
    shadow: "rgba(245, 158, 11, 0.2)",
    pattern: "repeating-linear-gradient(0deg, #f59e0b20 0px, #f59e0b20 1px, transparent 1px, transparent 6px)"
  },
  mindset: {
    primary: "from-rose-100 to-pink-50 dark:from-rose-950/40 dark:to-pink-900/40",
    secondary: "pink-500",
    accent: "#ec4899",
    highlight: "bg-pink-500/10",
    shadow: "rgba(236, 72, 153, 0.2)",
    pattern: "radial-gradient(circle at 10px 10px, #ec489920 2px, transparent 0)"
  },
  planning: {
    primary: "from-indigo-100 to-violet-50 dark:from-indigo-950/40 dark:to-violet-900/40",
    secondary: "indigo-500",
    accent: "#6366f1",
    highlight: "bg-indigo-500/10",
    shadow: "rgba(99, 102, 241, 0.2)",
    pattern: "repeating-radial-gradient(circle at 10px 10px, #6366f120 2px, transparent 0)"
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
      className="relative"
    >
      {/* Main Card with stacked paper effect */}
      <div className="relative">
        {/* Bottom layer */}
        <div 
          className={cn(
            "absolute -bottom-1.5 left-1.5 right-1.5 h-full rounded-xl",
            `bg-${style.secondary}/10 dark:bg-${style.secondary}/5`
          )}
          style={{ 
            transform: "rotate(-1deg)",
            boxShadow: `0 4px 12px ${style.shadow}`
          }}
        />
        {/* Middle layer */}
        <div 
          className={cn(
            "absolute -bottom-0.5 left-0.5 right-0.5 h-full rounded-xl",
            `bg-${style.secondary}/15 dark:bg-${style.secondary}/10`
          )}
          style={{ transform: "rotate(1deg)" }}
        />
        
        {/* Top layer - Main content */}
        <Card className="relative backdrop-blur-xl overflow-hidden">
          {/* Gradient background */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br",
            style.primary
          )} />

          {/* Pattern overlay */}
          <div 
            className="absolute inset-0 opacity-50"
            style={{ backgroundImage: style.pattern }}
          />

          {/* Floating emoji decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute text-3xl opacity-10"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0],
                y: [0, -10, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{
                right: "10%",
                bottom: "10%"
              }}
            >
              {tip.emoji}
            </motion.div>
          </div>

          {/* Content */}
          <div className="relative p-4">
            <div className="flex items-start gap-4">
              {/* Icon with enhanced animation */}
              <motion.div
                className={cn(
                  "p-3 rounded-xl",
                  style.highlight
                )}
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity
                }}
              >
                <tip.icon className={`w-6 h-6 text-${style.secondary}`} />
              </motion.div>

              {/* Text content */}
              <div className="flex-1">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  {tip.title}
                </h3>
                <p className="text-sm text-foreground/70 mt-1">
                  {tip.message}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};