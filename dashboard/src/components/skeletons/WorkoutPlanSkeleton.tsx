import { Skeleton } from "@nextui-org/react";

export const WorkoutPlanSkeleton = () => {
    return (
      <div className="space-y-6">
        {/* Hero Section Skeleton */}
        <Skeleton className="w-full h-[200px] rounded-xl" />
        
        {/* Exercise Cards Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-[300px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  };