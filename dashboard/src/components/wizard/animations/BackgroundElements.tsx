// src/components/wizard/animations/BackgroundElements.tsx
import React from 'react';
import 'framer-motion';

export const BackgroundElements = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    {/* Gradient Blobs */}
    <motion.div
      className="absolute top-1/4 -left-10 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:opacity-30"
      animate={{
        x: [0, 100, 0],
        y: [0, -50, 0],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
    <motion.div
      className="absolute top-1/3 right-0 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:opacity-30"
      animate={{
        x: [0, -100, 0],
        y: [0, 50, 0],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
    <motion.div
      className="absolute bottom-0 left-1/4 w-72 h-72 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:opacity-30"
      animate={{
        x: [0, 50, 0],
        y: [0, 100, 0],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />

    {/* Grid Pattern */}
    <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-black/[0.02]" />
  </div>
);

// src/components/wizard/animations/StepTransition.tsx
import { AnimatePresence, motion } from 'framer-motion';

interface StepTransitionProps {
  children: React.ReactNode;
  direction: number;
}

export const StepTransition: React.FC<StepTransitionProps> = ({ 
  children, 
  direction 
}) => (
  <AnimatePresence mode="wait" custom={direction}>
    <motion.div
      key={location.pathname}
      custom={direction}
      variants={{
        enter: (direction: number) => ({
          x: direction > 0 ? 1000 : -1000,
          opacity: 0
        }),
        center: {
          zIndex: 1,
          x: 0,
          opacity: 1
        },
        exit: (direction: number) => ({
          zIndex: 0,
          x: direction < 0 ? 1000 : -1000,
          opacity: 0
        })
      }}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);