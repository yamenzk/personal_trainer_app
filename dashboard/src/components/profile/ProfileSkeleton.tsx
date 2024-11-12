
import { Card, CardBody, Skeleton } from "@nextui-org/react";

export const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto space-y-12">
        {/* Hero Section Skeleton */}
        <Card className="border-none bg-content2 rounded-none shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)] rounded-b-4xl">
          <CardBody className="p-6">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="relative">
                <Skeleton className="w-24 h-24 rounded-full" />
              </div>
              <div className="flex-1 space-y-4 text-center lg:text-left">
                <div className="space-y-2">
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <Skeleton className="w-48 h-8 rounded-lg" />
                    <Skeleton className="w-24 h-6 rounded-full" />
                  </div>
                  <Skeleton className="w-64 h-4 rounded-lg" />
                </div>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="w-24 h-6 rounded-full" />
                  ))}
                </div>
              </div>
              <Skeleton className="w-24 h-10 rounded-lg lg:self-start" />
            </div>
          </CardBody>
        </Card>

        {/* Membership & Personal Info Skeleton */}
        <div className="space-y-4">
          <div className="px-4">
            <Skeleton className="w-48 h-6 rounded-lg" />
            <Skeleton className="w-64 h-4 mt-1 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
            <Skeleton className="h-[400px] rounded-2xl" />
            <div className="space-y-3">
              <Skeleton className="w-48 h-6 rounded-lg" />
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-16 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fitness Preferences Skeleton */}
        <div className="space-y-4">
          <div className="px-4">
            <Skeleton className="w-48 h-6 rounded-lg" />
            <Skeleton className="w-64 h-4 mt-1 rounded-lg" />
          </div>
          <div className="px-4">
            <div className="rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <Skeleton className="w-48 h-6 rounded-lg" />
                <Skeleton className="w-32 h-9 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-[100px] rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Referral Program Skeleton */}
        <div className="space-y-4">
          <div className="px-4">
            <Skeleton className="w-48 h-6 rounded-lg" />
            <Skeleton className="w-64 h-4 mt-1 rounded-lg" />
          </div>
          <div className="px-4">
            <Skeleton className="w-full h-[400px] rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};