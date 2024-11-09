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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      {loading ? skeleton : error ? (
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
        children
      )}
    </motion.div>
  );
};