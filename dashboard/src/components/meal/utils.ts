
import { Food } from "@/types/meal";
import { Coffee, Droplet, Scale, Timer, Brain, ChefHat, Pizza, Soup, Sandwich, Milk } from "lucide-react";
import type { NutritionTip, MealOrTipItem } from "./types";

export const nutritionTips: NutritionTip[] = [
  {
    icon: Coffee,
    title: "Breakfast Champion! 🌅",
    message: "Start your day right with a protein-rich breakfast. Aim for 20-30g protein.",
    type: "nutrition",
    emoji: "🥚"
  },
  {
    icon: Droplet,
    title: "Hydration Check 💧",
    message: "Remember to drink water between meals. It helps with portion control too!",
    type: "hydration",
    emoji: "💧"
  },
  {
    icon: Scale,
    title: "Portion Pro 📏",
    message: "Use your hand as a portion guide: palm = protein, fist = veggies, thumb = fats.",
    type: "portion",
    emoji: "⚖️"
  },
  {
    icon: Timer,
    title: "Timing Matters ⏰",
    message: "Eat every 3-4 hours to maintain stable blood sugar and energy levels.",
    type: "timing",
    emoji: "⏰"
  },
  {
    icon: Brain,
    title: "Mindful Eating 🧠",
    message: "Slow down and enjoy each bite. It takes 20 minutes to feel full!",
    type: "mindset",
    emoji: "🧠"
  },
  {
    icon: ChefHat,
    title: "Prep for Success 📋",
    message: "Planning your meals ahead is half the battle won!",
    type: "planning",
    emoji: "📋"
  },
  {
    icon: Pizza,
    title: "Balance is Key 🎯",
    message: "Remember, one treat meal won't ruin your progress. Moderation is key!",
    type: "mindset",
    emoji: "🎯"
  },
  {
    icon: Soup,
    title: "Veggie Victory 🥗",
    message: "Fill half your plate with colorful vegetables for vital nutrients!",
    type: "nutrition",
    emoji: "🥗"
  },
  {
    icon: Sandwich,
    title: "Snack Smart 🍎",
    message: "Keep healthy snacks handy to avoid unhealthy choices when hunger strikes.",
    type: "planning",
    emoji: "🍎"
  },
  {
    icon: Milk,
    title: "Protein Power 💪",
    message: "Include a protein source in every meal to support muscle health!",
    type: "nutrition",
    emoji: "💪"
  }
];

export const mealTimes: Record<string, string> = {
  'Breakfast': '7:00 AM',
  'Morning Snack': '10:30 AM',
  'Lunch': '1:00 PM',
  'Afternoon Snack': '4:00 PM',
  'Dinner': '7:00 PM',
  'Evening Snack': '9:30 PM'
};

let sessionUsedTips = new Set<string>();

export const resetTipsIfNeeded = () => {
  if (sessionUsedTips.size > (nutritionTips.length * 0.75)) {
    sessionUsedTips.clear();
  }
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const insertNutritionTips = (meals: [string, Food[]][]): MealOrTipItem[] => {
  if (meals.length <= 1) {
    return meals.map(meal => ({
      type: 'meal',
      content: meal
    }));
  }

  resetTipsIfNeeded();
  
  const result: MealOrTipItem[] = [];
  const availableTips = nutritionTips.filter(tip => !sessionUsedTips.has(tip.title));
  const shuffledTips = shuffleArray(availableTips);
  let tipIndex = 0;

  meals.forEach((meal, index) => {
    result.push({
      type: 'meal',
      content: meal
    });

    // Add tips between meals, but not after the last meal
    if (index < meals.length - 1 && Math.random() > 0.5 && tipIndex < shuffledTips.length) {
      const selectedTip = shuffledTips[tipIndex];
      sessionUsedTips.add(selectedTip.title);
      result.push({
        type: 'tip',
        content: selectedTip
      });
      tipIndex++;
    }
  });

  return result;
};