// src/components/workout/WorkoutTip.tsx

import { Card } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Droplets, 
  Bath, 
  Scale, 
  Wind, 
  Brain, 
  Heart,
  Dumbbell,
  Timer,
  FlaskConical,
  Music,
  Sparkles,
  ThumbsUp,
  SmilePlus,
  Waves,
  Utensils,
  ShowerHead,
  Grab,
  Flame
} from "lucide-react";
import { cn } from "@/utils/cn";
import { WorkoutTip, TipType, TipCardProps, Exercise } from "@/types";
import React, { useMemo } from "react";


const tipStyles: Record<TipType, {
  gradient: string;
  iconBg: string;
  iconColor: string;
  pattern: string;
}> = {
  hydration: {
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-500",
    pattern: "radial-gradient(circle at 20px 20px, rgba(59, 130, 246, 0.1) 2px, transparent 0)"
  },
  form: {
    gradient: "from-yellow-500/20 to-orange-500/20",
    iconBg: "bg-yellow-500/20",
    iconColor: "text-yellow-500",
    pattern: "linear-gradient(45deg, rgba(234, 179, 8, 0.1) 25%, transparent 25%, transparent 75%, rgba(234, 179, 8, 0.1) 75%)"
  },
  etiquette: {
    gradient: "from-violet-500/20 to-purple-500/20",
    iconBg: "bg-violet-500/20",
    iconColor: "text-violet-500",
    pattern: "repeating-linear-gradient(-45deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.1) 5px, transparent 5px, transparent 25px)"
  },
  mindset: {
    gradient: "from-pink-500/20 to-rose-500/20",
    iconBg: "bg-pink-500/20",
    iconColor: "text-pink-500",
    pattern: "radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.1) 2px, transparent 0)"
  },
  recovery: {
    gradient: "from-green-500/20 to-emerald-500/20",
    iconBg: "bg-green-500/20",
    iconColor: "text-green-500",
    pattern: "repeating-linear-gradient(0deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.1) 2px, transparent 2px, transparent 10px)"
  },
  nutrition: {
    gradient: "from-red-500/20 to-orange-500/20",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-500",
    pattern: "radial-gradient(hexagon at center, rgba(239, 68, 68, 0.1) 2px, transparent 0)"
  },
  safety: {
    gradient: "from-amber-500/20 to-yellow-500/20",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-500",
    pattern: "repeating-radial-gradient(circle at 10px 10px, rgba(245, 158, 11, 0.1) 2px, transparent 0)"
  }
};

export const workoutTips: WorkoutTip[] = [
  {
    icon: Droplets,
    title: "Hydration Hero! 💧",
    message: "Time for a water break! Stay hydrated, stay awesome. Your muscles are thirsty for greatness!",
    type: "hydration",
    emoji: "💧"
  },
  {
    icon: Bath,
    title: "Fresh & Fierce 🧼",
    message: "Remember to wipe down equipment after use. Your gym crush might be watching! 👀",
    type: "etiquette",
    emoji: "🧼"
  },
  {
    icon: Scale,
    title: "Ego Check ⚖️",
    message: "Drop the weight, perfect the form. Those muscles aren't fooled by ego lifting!",
    type: "form",
    emoji: "⚖️"
  },
  {
    icon: Wind,
    title: "Breathing Master 🌬️",
    message: "Inhale on the easy part, exhale on the hard part. Channel your inner Vader!",
    type: "form",
    emoji: "🌬️"
  },
  {
    icon: Dumbbell,
    title: "Rack It Right! 🎯",
    message: "Be a gym hero - return weights to their home. Future you (and everyone else) will thank you!",
    type: "etiquette",
    emoji: "🎯"
  },
  {
    icon: FlaskConical,
    title: "Science Time! 🧪",
    message: "Fun fact: Your muscles grow during rest, not during lifting. That's why you're not getting bigger by carrying groceries!",
    type: "recovery",
    emoji: "🧪"
  },
  {
    icon: Music,
    title: "Rhythm Check 🎵",
    message: "Control the tempo! 2 seconds up, 2 seconds down. Dance with the weights (but maybe not literally).",
    type: "form",
    emoji: "🎵"
  },
  {
    icon: Brain,
    title: "Mind Games 🧠",
    message: "Visualize success! Imagine those muscles growing... but remember to actually do the exercise too.",
    type: "mindset",
    emoji: "🧠"
  },
  {
    icon: Timer,
    title: "Rest Timer ⏰",
    message: "Don't skip rest periods! Scrolling social media doesn't count as active recovery.",
    type: "recovery",
    emoji: "⏰"
  },
  {
    icon: Heart,
    title: "Wholesome Reminder ❤️",
    message: "You're doing great! Remember, someone at the gym is secretly impressed by your dedication.",
    type: "mindset",
    emoji: "❤️"
  },
  {
    icon: Utensils,
    title: "Fuel Up! 🍎",
    message: "Post-workout meal incoming! Your muscles are ready for some tasty protein. No, pizza doesn't count (sorry!).",
    type: "nutrition",
    emoji: "🍎"
  },
  {
    icon: SmilePlus,
    title: "Gym Buddy Code 🤝",
    message: "Share equipment, spread smiles! A friendly nod goes a long way (and might get you a spot when needed).",
    type: "etiquette",
    emoji: "🤝"
  },
  {
    icon: Waves,
    title: "Focus Mode 🎯",
    message: "Put that phone down! Those Instagram reels will still be there after your set.",
    type: "mindset",
    emoji: "🎯"
  },
  {
    icon: ShowerHead,
    title: "Fragrance Check 🌺",
    message: "Deodorant is your best gym buddy! Keep it fresh for everyone around you.",
    type: "etiquette",
    emoji: "🌺"
  },
  {
    icon: Grab,
    title: "Grip Game 💪",
    message: "Chalk up those hands! Better grip = better gains (and fewer accidents).",
    type: "safety",
    emoji: "💪"
  },
  {
    icon: Scale,
    title: "Mirror Check 🪞",
    message: "Yes, you're looking good... but check your form too while you're at it!",
    type: "form",
    emoji: "🪞"
  },
  {
    icon: Brain,
    title: "Mind-Muscle Party 🎉",
    message: "Focus on the muscle you're working. Pretend you're a bodybuilder doing a photoshoot!",
    type: "form",
    emoji: "🎉"
  },
  
  // Gym Etiquette
  {
    icon: Bath,
    title: "Equipment Care 101 ✨",
    message: "Treat gym equipment like your ex's car - handle with care but actually return it when you're done!",
    type: "etiquette",
    emoji: "✨"
  },
  {
    icon: SmilePlus,
    title: "Noise Control 🤫",
    message: "We get it, you're strong! But maybe save the warrior screams for your car?",
    type: "etiquette",
    emoji: "🤫"
  },
  {
    icon: Dumbbell,
    title: "Space Invaders 🚀",
    message: "Personal space is cool! No need to do lateral raises right next to someone's bench press.",
    type: "etiquette",
    emoji: "🚀"
  },

  // Hydration & Nutrition
  {
    icon: Droplets,
    title: "Sip Advisor 🥤",
    message: "If your pee is darker than lemonade, time to hydrate! (Too much info? Sorry not sorry!)",
    type: "hydration",
    emoji: "🥤"
  },
  {
    icon: Utensils,
    title: "Snack Attack! 🍌",
    message: "Pre-workout banana > pre-workout unicorn dust. Sometimes simple is better!",
    type: "nutrition",
    emoji: "🍌"
  },
  {
    icon: FlaskConical,
    title: "Protein Power 🥩",
    message: "Your muscles called, they want to know where their post-workout protein is!",
    type: "nutrition",
    emoji: "🥩"
  },

  // Safety & Recovery
  {
    icon: Timer,
    title: "Sleep Squad 😴",
    message: "Those late-night Netflix marathons aren't helping your gains. Hit the bed like you hit the weights!",
    type: "recovery",
    emoji: "😴"
  },
  {
    icon: Heart,
    title: "Stretch It Out 🧘‍♂️",
    message: "Your muscles are like rubber bands, not rocks. Give them a good stretch!",
    type: "recovery",
    emoji: "🧘‍♂️"
  },
  {
    icon: Flame,
    title: "Heat Check 🌡️",
    message: "If you're seeing spots, it's not a disco party. Take a breather, champ!",
    type: "safety",
    emoji: "🌡️"
  },

  // Mindset
  {
    icon: Brain,
    title: "Progress Peek 📸",
    message: "Those progress pics aren't lying - you're getting stronger! (Even if your cat looks unimpressed)",
    type: "mindset",
    emoji: "📸"
  },
  {
    icon: Sparkles,
    title: "Motivation Magic ✨",
    message: "Remember why you started! (And no, it wasn't for the gym selfies... or was it?)",
    type: "mindset",
    emoji: "✨"
  },
  {
    icon: ThumbsUp,
    title: "Small Wins 🎯",
    message: "Managed to not hit yourself with the dumbbells today? That's a win in our book!",
    type: "mindset",
    emoji: "🎯"
  },

  // Fun Environment Tips
  {
    icon: Music,
    title: "Playlist Power 🎵",
    message: "Your workout playlist still stuck in 2010? Time for an upgrade! (But keep that one Britney song)",
    type: "mindset",
    emoji: "🎵"
  },
  {
    icon: ShowerHead,
    title: "Gym Fashion Police 👕",
    message: "Those shorts from high school might still fit, but should they? Time for some new gear!",
    type: "etiquette",
    emoji: "👕"
  },
  {
    icon: Wind,
    title: "AC Appreciation 🌪️",
    message: "Standing by the fan between sets doesn't count as cardio. Nice try though!",
    type: "etiquette",
    emoji: "🌪️"
  },

  // Recovery & Wellness
  {
    icon: Timer,
    title: "Recovery Rebel 😎",
    message: "Rest days are like pizza days - absolutely necessary for life quality!",
    type: "recovery",
    emoji: "😎"
  },
  {
    icon: Bath,
    title: "Foam Roll Fun 🎯",
    message: "Foam rolling: Like a massage, but you do all the work and it hurts more. Worth it though!",
    type: "recovery",
    emoji: "🎯"
  },

  // Safety First
  {
    icon: Scale,
    title: "Spotter Signal 🚨",
    message: "If you're wondering if you need a spotter, you probably need a spotter!",
    type: "safety",
    emoji: "🚨"
  },
  {
    icon: Brain,
    title: "Form Check ✅",
    message: "Looking at yourself in the mirror isn't vanity, it's safety! (That's our story and we're sticking to it)",
    type: "form",
    emoji: "✅"
  },

  // Extra Fun Ones
  {
    icon: Dumbbell,
    title: "Gym Crush Alert 💝",
    message: "Yes, they saw you trip on that treadmill. Own it with a smile and keep going!",
    type: "mindset",
    emoji: "💝"
  },
  {
    icon: Sparkles,
    title: "Gym Mathematics 🔢",
    message: "1 more rep + 2 more sets = 100% reason to order that post-workout meal!",
    type: "mindset",
    emoji: "🔢"
  },
  {
    icon: Flame,
    title: "Recovery Mode 🔥",
    message: "Feeling the burn? That's your muscles sending a spicy thank-you note!",
    type: "recovery",
    emoji: "🔥"
  }
];

export const TipCard: React.FC<TipCardProps> = React.memo(({ tip }) => {
  const style = useMemo(() => tipStyles[tip.type], [tip.type]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <Card
        className={cn(
          "border-none overflow-hidden",
          "relative backdrop-blur-md"
        )}
      >
        {/* Background gradient and pattern */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br",
          style.gradient
        )} />
        
        {/* Decorative pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: style.pattern, backgroundSize: "20px 20px" }}
        />

        {/* Floating emojis background animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <AnimatePresence mode="sync">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ 
                  opacity: 0,
                  scale: 0.5,
                  x: Math.random() * 100,
                  y: 100 
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                  x: Math.random() * 100,
                  y: -20
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.8,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut"
                }}
              >
                {tip.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="relative p-4">
          <div className="flex items-start gap-3">
            {/* Enhanced floating icon with modern animations */}
            <div className="relative">
              <motion.div
                className={cn(
                  "p-2 rounded-xl cursor-pointer",
                  style.iconBg,
                  "relative"
                )}
                initial={{ y: 0 }}
                animate={{
                  y: [-2, 2, -2],
                  rotate: [-2, 2, -2],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 4,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                whileHover={{
                  scale: 1.15,
                  rotate: [0, -5, 5, 0],
                  transition: {
                    duration: 0.3,
                    ease: "easeOut"
                  }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <tip.icon className={cn(
                  "w-5 h-5",
                  style.iconColor,
                  "relative z-10",
                  "transition-transform"
                )} />
                
                {/* Dynamic glow effect */}
                <motion.div
                  className={cn(
                    "absolute inset-0 rounded-xl blur-sm",
                    style.iconBg
                  )}
                  initial={{ opacity: 0.5, scale: 1 }}
                  animate={{
                    opacity: [0.5, 0.3, 0.5],
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 3,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </motion.div>
            </div>

            {/* Text content */}
            <div className="flex-1 relative">
              <motion.h3
                className="text-base font-semibold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {tip.title}
              </motion.h3>
              <motion.p
                className="text-sm text-foreground/70 mt-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {tip.message}
              </motion.p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

TipCard.displayName = 'TipCard';

// Custom hook for tip management
export const useWorkoutTips = () => {
  const [sessionUsedTips] = React.useState(() => new Set<string>());

  const resetTips = React.useCallback(() => {
    sessionUsedTips.clear();
  }, [sessionUsedTips]);

  const insertTips = React.useCallback((exercises: Exercise[]) => {
    if (exercises.length <= 1) return exercises;

    // Reset tips if needed
    if (sessionUsedTips.size > (workoutTips.length * 0.75)) {
      resetTips();
    }

    // Get available positions for tips
    const maxTips = Math.min(3, exercises.length - 1);
    const numberOfTips = Math.floor(Math.random() * maxTips) + 1;
    
    // More efficient position selection
    const availablePositions = exercises.reduce<number[]>((acc, _, index) => {
      if (index > 0 && 
          !acc.includes(index - 1) && 
          !acc.includes(index + 1)) {
        acc.push(index);
      }
      return acc;
    }, []);

    const tipPositions = new Set(
      availablePositions
        .sort(() => Math.random() - 0.5)
        .slice(0, numberOfTips)
    );

    // Get available tips
    const availableTips = workoutTips.filter(tip => 
      !sessionUsedTips.has(tip.title)
    );
    
    // Create result array with tips
    const result: (Exercise | { type: 'tip', content: WorkoutTip })[] = [];
    let tipIndex = 0;

    exercises.forEach((exercise, index) => {
      result.push(exercise);
      
      if (tipPositions.has(index + 1) && tipIndex < availableTips.length) {
        const selectedTip = availableTips[tipIndex];
        sessionUsedTips.add(selectedTip.title);
        
        result.push({
          type: 'tip',
          content: selectedTip
        });
        
        tipIndex++;
      }
    });

    return result;
  }, [resetTips, sessionUsedTips]);

  return {
    insertTips,
    resetTips
  };
};

// Utility functions
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Export wrapper function for direct usage
export const insertWorkoutTips = (exercises: Exercise[]) => {
  const { insertTips } = useWorkoutTips();
  return insertTips(exercises);
};

// Optional reset function
export const resetWorkoutTips = () => {
  const { resetTips } = useWorkoutTips();
  resetTips();
};