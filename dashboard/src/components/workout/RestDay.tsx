import { Card } from "@nextui-org/react";
import { 
  Moon, 
  Heart, 
  BedDouble, 
  Bath, 
  Waves, 
  CloudMoon, 
  Pizza, 
  Gamepad2,
  Sandwich,
  Coffee,
  Tv,
  Soup,
  Milk,
  Cat,
  Dog,
  MessagesSquare,
  Book,
  Music2,
  Popcorn,
  Brush,
  Footprints
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

// Different categories of rest day messages
const restMessages = {
  morning: [
    "Rise and rest! Today's workout is called 'The Professional Napper' 🛏️",
    "Coffee and chill: Doctor's orders! ☕",
    "Morning stretches (reaching for the TV remote counts) 📺",
    "Breakfast in bed: The only gains we're chasing today 🥐",
  ],
  afternoon: [
    "Time to become one with your couch 🛋️",
    "Your muscles are taking a coffee break ☕",
    "Even superheroes need naps 🦸‍♂️",
    "Midday meditation (aka sneaky snooze) 😴",
  ],
  evening: [
    "Netflix and mobility work (mostly Netflix) 🎬",
    "Making gains while snoozing 💪😴",
    "Rest mode: Activated 🌙",
    "Time for some horizontal cardio (sleeping) 💤",
  ]
};

// Different categories of recovery activities
const recoveryActivities = {
  relaxation: [
    { emoji: "🎮", text: "Play your favorite game", icon: Gamepad2 },
    { emoji: "📺", text: "Binge that new series", icon: Tv },
    { emoji: "📱", text: "Scroll through memes guilt-free", icon: MessagesSquare },
    { emoji: "🎵", text: "Create a chill playlist", icon: Music2 },
    { emoji: "📚", text: "Read a good book", icon: Book },
    { emoji: "🍿", text: "Movie marathon time", icon: Popcorn },
  ],
  selfCare: [
    { emoji: "🛁", text: "Take a relaxing bath", icon: Bath },
    { emoji: "🧘‍♂️", text: "Light stretching session", icon: Footprints },
    { emoji: "🧊", text: "Ice cream therapy", icon: Milk },
    { emoji: "🫖", text: "Enjoy some herbal tea", icon: Coffee },
    { emoji: "🧹", text: "Tidy up (burns calories!)", icon: Brush },
  ],
  food: [
    { emoji: "🍕", text: "Order your favorite food", icon: Pizza },
    { emoji: "🥪", text: "Prep meals for tomorrow", icon: Sandwich },
    { emoji: "🍲", text: "Cook something healthy", icon: Soup },
    { emoji: "🥤", text: "Stay hydrated (very important!)", icon: Coffee },
  ],
  pets: [
    { emoji: "🐱", text: "Cat cuddle therapy", icon: Cat },
    { emoji: "🐕", text: "Dog walking meditation", icon: Dog },
  ]
};

// Different rest benefits
const restBenefits = [
  {
    icon: Heart,
    title: "Rest = Gains",
    description: "Your muscles are secretly growing 🌱",
    color: "danger"
  },
  {
    icon: Heart,
    title: "Recovery Mode",
    description: "Building strength while being lazy 💪",
    color: "danger"
  },
  {
    icon: BedDouble,
    title: "Sleep Score: 100%",
    description: "Time to become a sleep champion 🏆",
    color: "warning"
  },
  {
    icon: BedDouble,
    title: "Nap Master",
    description: "Professional resting in progress 😴",
    color: "warning"
  },
  {
    icon: Waves,
    title: "Relaxation Mode",
    description: "Netflix & stretch? 🧘‍♂️🎬",
    color: "success"
  },
  {
    icon: Waves,
    title: "Chill Vibes Only",
    description: "Today's workout: Deep breathing 🧘‍♂️",
    color: "success"
  }
];

export const RestDayCard: React.FC = () => {
  
  // Get time-appropriate message
  const getTimeBasedMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return restMessages.morning;
    if (hour < 18) return restMessages.afternoon;
    return restMessages.evening;
  };

  // Randomly select message based on time of day
  const timeMessages = getTimeBasedMessage();
  const randomMessage = timeMessages[Math.floor(Math.random() * timeMessages.length)];

  // Randomly select 3 unique benefits
  const selectedBenefits = [...restBenefits]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // Select random activities for the recovery menu
  const getRandomActivities = () => {
    const categories = Object.keys(recoveryActivities) as Array<keyof typeof recoveryActivities>;
    const selectedActivities: any[] = [];
    
    // Get one from each category randomly
    categories.forEach(category => {
      const categoryActivities = recoveryActivities[category];
      const randomActivity = categoryActivities[Math.floor(Math.random() * categoryActivities.length)];
      selectedActivities.push(randomActivity);
    });

    // Shuffle and take first 4
    return selectedActivities
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  };

  const selectedActivities = getRandomActivities();

  return (
    <Card
      className="p-6 space-y-6 mt-6 overflow-hidden relative border-none"
      style={{
        background: "linear-gradient(to bottom right, #1a237e, #283593, #303f9f)",
      }}
    >
      {/* Stars background */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute h-1 w-1 bg-white/30 rounded-full"
            style={{ 
              top: `${10 + (i * 20)}%`,
              left: `${15 + (i * 20)}%`,
              animation: `twinkle ${2 + i}s ease-in-out infinite`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="p-3 rounded-xl bg-white/10">
              <Moon className="w-6 h-6 text-white" />
            </div>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  "absolute text-xs font-bold text-white",
                  "-right-2",
                  i === 0 && "-top-1",
                  i === 1 && "-top-3",
                  i === 2 && "-top-5"
                )}
                animate={{ 
                  opacity: [0, 1, 0],
                  y: -5,
                  x: i * 2
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                z
              </motion.div>
            ))}
          </div>
          <div>
            <motion.p
              className="text-lg font-semibold text-white mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {randomMessage}
            </motion.p>
            <p className="text-white/70 text-sm">Your daily dose of recovery</p>
          </div>
        </div>

        {/* Recovery Cards */}
        <div className="space-y-3">
          {selectedBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-${benefit.color}-500/20`}>
                  <benefit.icon className={`w-4 h-4 text-${benefit.color}-500`} />
                </div>
                <div>
                  <p className="text-white font-medium">{benefit.title}</p>
                  <p className="text-white/60 text-sm">{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recovery Menu */}
        <motion.div
          className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary-500/20">
              <CloudMoon className="w-4 h-4 text-primary-500" />
            </div>
            <div>
              <p className="text-white font-medium mb-2">Today's Recovery Menu:</p>
              <ul className="text-sm text-white/60 space-y-1.5">
                {selectedActivities.map((activity, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span>{activity.emoji}</span> {activity.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </Card>
  );
};