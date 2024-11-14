import { Card, Chip, Button, Skeleton } from "@nextui-org/react";
import { 
  Dumbbell, 
  Clock, 
  Trophy, 
  CheckCircle2, 
  Zap, 
  History,
  ArrowUpRight,
  Target,
  BarChart,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { useState, useRef, useEffect, useMemo } from "react";
import { ExercisePerformance, ExerciseCardProps } from "@/types";
import React from "react";
import { useClientStore } from "@/stores/clientStore";
import { useSafeImageLoading } from '@/hooks/useSafeImageLoading';

export const ExerciseCard = React.memo(({
  exercise,
  references,
  performance,
  isLogged = false,
  isSuperset = false,
  onLogSet,
  onViewDetails,
  selectedPlan,
  exerciseNumber,
  isChangingPlan,
}: ExerciseCardProps) => {
  const details = references[exercise.ref];
  const { mediaCache } = useClientStore();
  const isMounted = useRef(true);

  // Use memoized image URL
  const imageUrl = useMemo(() => {
    const targetUrl = details?.thumbnail || details?.starting;
    return mediaCache.images[targetUrl] || targetUrl;
  }, [details, mediaCache.images]);

  // Use our custom hook for safe image loading
  const { isLoading: isImageLoading, error: imageError } = useSafeImageLoading(imageUrl);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Memoize exercise performance calculations
  const [personalBest, lastPerformance] = useMemo(() => {
    const exercisePerformance = performance?.[exercise.ref] || [];
    
    const best = exercisePerformance.reduce((best, current) => {
      return (!best || current.weight > best.weight) ? current : best;
    }, null as ExercisePerformance | null);

    const last = exercisePerformance.length > 0
      ? exercisePerformance[exercisePerformance.length - 1]
      : null;

    return [best, last];
  }, [performance, exercise.ref]);

  // Safe event handlers
  const handleClick = () => {
    if (!isChangingPlan && isMounted.current) {
      onViewDetails();
    }
  };

  const handleLogSet = (e: React.MouseEvent) => {
    if (!isChangingPlan && isMounted.current) {
      e.stopPropagation();
      onLogSet?.();
    }
  };
  
  const ImageWithFallback: React.FC<{ 
    src: string;
    alt: string;
    className?: string;
    onLoad?: () => void;
  }> = ({ src, alt, className, onLoad }) => {
    const { isLoading, error, retry } = useSafeImageLoading(src, onLoad);
    
    if (isLoading) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-content2/20 backdrop-blur-sm">
          <div className="w-8 h-8 rounded-full border-2 border-primary animate-spin border-t-transparent" />
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-content2/20 backdrop-blur-sm">
          <div className="text-center space-y-2">
            <AlertTriangle className="w-8 h-8 text-warning mx-auto" />
            <p className="text-sm text-warning">Failed to load image</p>
            <Button
              size="sm"
              variant="flat"
              color="warning"
              onPress={retry}
              startContent={<RefreshCcw className="w-4 h-4" />}
            >
              Retry
            </Button>
          </div>
        </div>
      );
    }
  
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover",
          "transition-all duration-300",
          className
        )}
        onError={(e) => {
          // If image fails to load after being initially successful
          const target = e.target as HTMLImageElement;
          target.src = 'https://bitsofco.de/img/Qo5mfYDE5v-350.png'; // Fallback image
        }}
      />
    );
  };

  return (
    <motion.div
      onClick={handleClick}
      className="cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <Card 
        className={cn(
          "relative w-full h-[300px] border-none group overflow-hidden",
          "transition-opacity duration-300",
          isChangingPlan && "opacity-50 pointer-events-none"
        )}
      >
        {/* Image Section */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src={imageUrl}
            alt={`Exercise ${exercise.ref}`}
            className={cn(
              "z-0 w-full h-full object-cover",
              "transition-all duration-500 group-hover:scale-110",
              "brightness-[0.7] contrast-[1.2]"
            )}
          />
        </div>

        {/* Content Overlay */}
        <div className="relative h-full p-4 flex flex-col">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div>
              <motion.div 
                className="flex items-center gap-2 mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Chip
                  size="sm"
                  classNames={{
                    base: "bg-primary-600 border-none",
                    content: "flex items-center gap-1 text-white px-1"
                  }}
                >
                  <Target className="w-3 h-3 text-white" />
                  <span className="text-xs font-medium">
                    {details.primary_muscle}
                  </span>
                </Chip>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {!isSuperset && exerciseNumber && (
                    <span className="text-white/60 mr-2">{exerciseNumber}.</span>
                  )}
                  {exercise.ref}
                </h3>
                {isLogged && (
                  <div className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-success-500" />
                  </div>
                )}
              </motion.div>
            </div>

            <motion.div
              className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
            >
              <ArrowUpRight className="w-4 h-4 text-white" />
            </motion.div>
          </div>

          {/* Stats Section */}
          <div className="flex flex-wrap gap-2 mt-2">
            <Chip
              size="sm"
              classNames={{
                base: "bg-black/40 backdrop-blur-md border border-white/10",
                content: "text-white"
              }}
              startContent={<Dumbbell size={14} className="text-white" />}
            >
              <span className="text-white">{exercise.sets} × {exercise.reps}</span>
            </Chip>
            <Chip
              size="sm"
              classNames={{
                base: "bg-black/40 backdrop-blur-md border border-white/10",
                content: "text-white"
              }}
              startContent={<Clock size={14} className="text-white" />}
            >
              <span className="text-white">{exercise.rest}s</span>
            </Chip>
          </div>

          {/* Performance History */}
          <div className="mt-auto">
            {(personalBest || lastPerformance) && (
              <div className="space-y-2 mb-3">
                {personalBest && (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-warning-500" />
                    <span className="text-sm text-white/90">
                      Best: {personalBest.weight}kg × {personalBest.reps}
                    </span>
                  </div>
                )}
                {lastPerformance && lastPerformance !== personalBest && (
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-success-500" />
                    <span className="text-sm text-white/90">
                      Last: {lastPerformance.weight}kg × {lastPerformance.reps}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {!isLogged && !isSuperset && selectedPlan === 'active' && (
              <motion.div 
                onClick={handleLogSet}
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium w-full"
                  size="sm"
                  startContent={<Zap size={14} />}
                >
                  Log Set
                </Button>
                <Button
                  isIconOnly
                  className="bg-white/10 backdrop-blur-md text-white"
                  size="sm"
                >
                  <BarChart size={14} />
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Loading/Error States */}
        {isImageLoading && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
            <div className="loading-spinner" />
          </div>
        )}
        {imageError && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
            <p className="text-white text-sm">Failed to load image</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
});
