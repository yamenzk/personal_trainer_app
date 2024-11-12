import { motion } from "framer-motion";
import { Card, CardBody } from "@nextui-org/react";
import { ChefHat, Brain, Heart, Scale, Droplet, Apple, Utensils, Sandwich, Coffee, Pizza } from "lucide-react";

// Different categories of flexible eating messages
const flexibleDayMessages = {
  mindful: [
    "Listen to your body today! 🧘‍♂️ Practice intuitive eating.",
    "Mindful eating day: Savor every bite! 🍽️",
    "Today's menu: Whatever makes you feel good! 💫",
    "Flexible eating day: Trust your hunger cues 🎯",
  ],
  balance: [
    "Balance is key - enjoy your food choices today! ⚖️",
    "Mix and match your favorites, just keep portions in mind 🎨",
    "Freedom to choose, wisdom to balance 🌟",
    "Your body, your choices - make them count! 💪",
  ],
  motivation: [
    "One flexible day keeps the cravings away! 🎉",
    "Treating yourself is part of the journey 🌈",
    "Remember: Progress > Perfection 📈",
    "Making mindful choices builds sustainable habits 🌱",
  ]
};

// Different categories of healthy suggestions
const healthySuggestions = {
  breakfast: [
    { emoji: "🥚", text: "Protein-rich breakfast", icon: Coffee },
    { emoji: "🥣", text: "Whole grain cereal with fruits", icon: Apple },
    { emoji: "🥑", text: "Avocado toast with eggs", icon: Sandwich },
    { emoji: "🥞", text: "Protein pancakes", icon: Utensils },
  ],
  snacks: [
    { emoji: "🍎", text: "Fresh fruit with nuts", icon: Apple },
    { emoji: "🥜", text: "Handful of mixed nuts", icon: Scale },
    { emoji: "🫐", text: "Berries with yogurt", icon: Utensils },
    { emoji: "🥕", text: "Raw veggies with hummus", icon: Sandwich },
  ],
  meals: [
    { emoji: "🥗", text: "Colorful salad with protein", icon: Utensils },
    { emoji: "🍜", text: "Balanced bowl with grains", icon: Utensils },
    { emoji: "🥩", text: "Lean protein with veggies", icon: Scale },
    { emoji: "🐟", text: "Fish with roasted vegetables", icon: Utensils },
  ]
};

// Tips for maintaining nutrition goals
const nutritionTips = [
  {
    icon: Brain,
    title: "Stay Mindful",
    description: "Listen to your hunger and fullness cues",
    color: "primary"
  },
  {
    icon: Heart,
    title: "Balance Your Plate",
    description: "Include protein, carbs, and healthy fats",
    color: "danger"
  },
  {
    icon: Scale,
    title: "Portion Awareness",
    description: "Use your hand as a portion guide",
    color: "warning"
  },
  {
    icon: Droplet,
    title: "Stay Hydrated",
    description: "Water helps with portion control",
    color: "info"
  },
  {
    icon: Pizza,
    title: "Enjoy Mindfully",
    description: "Savor your food without guilt",
    color: "success"
  },
  {
    icon: Apple,
    title: "Choose Nutrients",
    description: "Focus on nutritious whole foods",
    color: "primary"
  }
];

export const NoMealsCard = () => {
  // Get random message based on category
  const getRandomMessage = () => {
    const categories = Object.keys(flexibleDayMessages) as Array<keyof typeof flexibleDayMessages>;
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const messages = flexibleDayMessages[randomCategory];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Get random suggestions
  const getRandomSuggestions = () => {
    const result: any[] = [];
    Object.keys(healthySuggestions).forEach(category => {
      const options = healthySuggestions[category as keyof typeof healthySuggestions];
      result.push(options[Math.floor(Math.random() * options.length)]);
    });
    return result;
  };

  // Get random tips
  const getRandomTips = (count: number) => {
    return [...nutritionTips]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  };

  const message = getRandomMessage();
  const suggestions = getRandomSuggestions();
  const selectedTips = getRandomTips(3);

  return (
    <Card
      className="overflow-hidden relative border-none"
      style={{
        background: "linear-gradient(135deg, #000428 0%, #004e92 100%)",
      }}
    >
      {/* Animated background elements */}
      <motion.div className="absolute inset-0 overflow-hidden">
        {/* Floating food emojis */}
        {["🥗", "🍎", "🥑", "🥩", "🥕"].map((emoji, index) => (
          <motion.div
            key={index}
            className="absolute text-2xl"
            initial={{ y: -20, opacity: 0 }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              x: Math.sin(index) * 20
            }}
            transition={{
              duration: 3,
              delay: index * 0.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              left: `${20 + index * 20}%`,
              top: `${30 + (index % 3) * 20}%`
            }}
          >
            {emoji}
          </motion.div>
        ))}

        {/* Gradient circles */}
        <motion.div
          className="absolute w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
            top: "10%",
            right: "10%"
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>

      <CardBody className="relative p-6 z-10">
        {/* Main content */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <motion.div
              className="p-3 rounded-xl bg-white/10"
              animate={{
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <ChefHat className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <motion.h3
                className="text-xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {message}
              </motion.h3>
              <motion.p
                className="text-white/70"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Keep these nutrition tips in mind
              </motion.p>
            </div>
          </div>

          {/* Tips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedTips.map((tip, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-${tip.color}-500/20`}>
                    <tip.icon className={`w-4 h-4 text-${tip.color}-500`} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{tip.title}</h4>
                    <p className="text-white/60 text-sm">{tip.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Suggested healthy choices */}
          <motion.div
            className="mt-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h4 className="text-white font-medium mb-3">Healthy Food Ideas:</h4>
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center gap-2 text-white/70">
                  <span>{suggestion.emoji}</span>
                  <span className="text-sm">{suggestion.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </CardBody>
    </Card>
  );
};