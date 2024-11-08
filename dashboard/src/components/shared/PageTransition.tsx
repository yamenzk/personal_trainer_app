// src/components/shared/PageTransition.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '@/contexts/NavigationContext';
import { Skeleton } from '@nextui-org/react';

interface PageTransitionProps {
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  skeleton?: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  loading,
  error,
  skeleton
}) => {
  const { isNavigating, endNavigation } = useNavigation();

  // Default skeleton if none provided
  const defaultSkeleton = (
    <div className="space-y-4">
      <Skeleton className="w-full h-[200px] rounded-lg" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-[100px] rounded-lg" />
        <Skeleton className="h-[100px] rounded-lg" />
      </div>
      <div className="space-y-3">
        <Skeleton className="w-3/4 h-4 rounded-lg" />
        <Skeleton className="w-full h-4 rounded-lg" />
        <Skeleton className="w-2/3 h-4 rounded-lg" />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      onAnimationComplete={() => {
        if (isNavigating) {
          endNavigation();
        }
      }}
      className="min-h-full"
    >
      <AnimatePresence mode="wait">
        {(loading || isNavigating) ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {skeleton || defaultSkeleton}
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center p-4 text-center"
          >
            <div className="text-danger">{error}</div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};