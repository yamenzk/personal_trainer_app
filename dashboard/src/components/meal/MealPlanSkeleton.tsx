
import { Skeleton } from "@nextui-org/react";

export const MealPlanSkeleton = () => {
  return (
    <div className="min-h-screen w-full bg-transparent relative overflow-hidden">
      <div className="container mx-auto">
        {/* Hero Card Section */}
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full rounded-none rounded-b-4xl h-[220px]">
            <div className="p-6 space-y-4">
              {/* Top Row */}
              <div className="flex justify-between">
                <Skeleton className="w-32 h-8 rounded-lg" />
                <Skeleton className="w-24 h-8 rounded-lg" />
              </div>

              {/* Title Row */}
              <div className="space-y-2">
                <Skeleton className="w-64 h-8 rounded-lg" />
                <Skeleton className="w-96 h-6 rounded-lg" />
              </div>

              {/* Days Row */}
              <div className="flex gap-2 mt-4 overflow-hidden">
                {[...Array(7)].map((_, i) => (
                  <Skeleton key={i} className="w-[68px] h-[84px] rounded-xl flex-shrink-0" />
                ))}
              </div>
            </div>
          </Skeleton>

          {/* Contextual Tip */}
          <div className="px-6">
            <Skeleton className="w-64 h-8 rounded-full mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};