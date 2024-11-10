import { Card } from "@nextui-org/react";
import { Moon, Heart, BedDouble, Bath, Waves, CloudMoon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const funnyRestMessages = [
  "Time to become one with your pillow 🛏️",
  "Your muscles are taking a coffee break ☕",
  "Even superheroes need naps 🦸‍♂️",
  "Making gains while snoozing 💪😴",
  "Rest mode: Activated 🌙",
  "Professional napping in progress 🏆",
];

export const RestDayCard: React.FC = () => {
  const { theme } = useTheme();
  const randomMessage = funnyRestMessages[Math.floor(Math.random() * funnyRestMessages.length)];
  
  return (
    <Card
      className="p-6 space-y-6 mt-6 overflow-hidden relative border-none"
      style={{
        background: "linear-gradient(to bottom right, #1a237e, #283593, #303f9f)",
      }}
    >
      {/* Simple star-like dots for ambiance - no animation */}
      <div className="absolute inset-0">
        <div className="absolute h-1 w-1 bg-white/30 rounded-full" style={{ top: '10%', left: '20%' }} />
        <div className="absolute h-1 w-1 bg-white/30 rounded-full" style={{ top: '30%', left: '80%' }} />
        <div className="absolute h-1 w-1 bg-white/30 rounded-full" style={{ top: '70%', left: '15%' }} />
        <div className="absolute h-1 w-1 bg-white/30 rounded-full" style={{ top: '85%', left: '75%' }} />
        <div className="absolute h-1 w-1 bg-white/30 rounded-full" style={{ top: '45%', left: '90%' }} />
      </div>

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="p-3 rounded-xl bg-white/10">
              <Moon className="w-6 h-6 text-white" />
            </div>
            {/* Simplified Z animation - only three Zs with minimal animation */}
            <motion.div
              className="absolute -top-2 -right-2 text-xs font-bold text-white"
              animate={{ opacity: [0, 1, 0], y: -5 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              z
            </motion.div>
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
          <motion.div
            className="p-4 rounded-xl bg-white/5 border border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-danger-500/20">
                <Heart className="w-4 h-4 text-danger-500" />
              </div>
              <div>
                <p className="text-white font-medium">Rest = Gains</p>
                <p className="text-white/60 text-sm">Your muscles are secretly growing 🌱</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="p-4 rounded-xl bg-white/5 border border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning-500/20">
                <BedDouble className="w-4 h-4 text-warning-500" />
              </div>
              <div>
                <p className="text-white font-medium">Sleep Score: 100%</p>
                <p className="text-white/60 text-sm">Time to become a sleep champion 🏆</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="p-4 rounded-xl bg-white/5 border border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success-500/20">
                <Waves className="w-4 h-4 text-success-500" />
              </div>
              <div>
                <p className="text-white font-medium">Relaxation Mode</p>
                <p className="text-white/60 text-sm">Netflix & stretch? 🧘‍♂️🎬</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Fun Tip Box */}
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
                <li className="flex items-center gap-2">
                  <span>🎮</span> Play your favorite game
                </li>
                <li className="flex items-center gap-2">
                  <span>🛁</span> Take a relaxing bath
                </li>
                <li className="flex items-center gap-2">
                  <span>🧊</span> Ice cream therapy (doctor's orders!)
                </li>
                <li className="flex items-center gap-2">
                  <span>📱</span> Scroll through memes guilt-free
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </Card>
  );
};