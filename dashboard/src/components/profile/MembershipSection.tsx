import { format, formatDistanceToNow } from 'date-fns';
import { Button, Progress, Card, CardBody, Chip } from "@nextui-org/react";
import { ArrowRight, Crown, Trophy, Calendar, Clock, Sparkles } from 'lucide-react';
import { useClientStore } from '@/stores/clientStore';
import { useEffect } from 'react';

export const MembershipSection = () => {
  const { membership, fetch } = useClientStore();
  

  if (!membership) return null;

  // Calculate membership progress
  const startDate = new Date(membership.start);
  const endDate = new Date(membership.end);
  const today = new Date();
  const progress = ((today.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100;
  const daysLeft = formatDistanceToNow(endDate, { addSuffix: true });
  
  const isNearingEnd = progress >= 80;
  const timeLeftColor = isNearingEnd ? "warning" : "success";

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Membership & Status</h2>
          <p className="text-sm text-foreground-500">Track your fitness journey progress</p>
        </div>
        <Button
          variant="shadow"
          color="secondary"
          endContent={<ArrowRight className="w-4 h-4" />}
          size="sm"
          className="font-medium"
        >
          Manage Plan
        </Button>
      </div>

      <Card className="border-none">
        <CardBody className="p-0">
          <div className="relative overflow-hidden rounded-xl">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-500 to-secondary-700 opacity-90" />


            {/* Content */}
            <div className="relative p-6 text-white">
              <div className="space-y-6">
                {/* Status Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-white/80">
                      <Crown className="w-4 h-4" />
                      <span className="text-sm font-medium">Package</span>
                    </div>
                    <p className="text-lg font-semibold">{membership.package}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-white/80">
                      <Trophy className="w-4 h-4" />
                      <span className="text-sm font-medium">Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">Active</span>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-white/80" />
                      <span className="text-sm font-medium text-white/80">Timeline</span>
                    </div>
                    <Chip
                      startContent={<Clock className="w-3.5 h-3.5" />}
                      variant="flat"
                      color={timeLeftColor}
                      size="sm"
                      className={`font-medium bg-${timeLeftColor}-500/20`}
                    >
                      {daysLeft}
                    </Chip>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1 relative">
                      <span className="text-sm text-white/80">Started</span>
                      <p className="font-semibold">
                        {format(startDate, 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-white/80">Ends</span>
                      <p className="font-semibold">
                        {format(endDate, 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-white/80" />
                      <span>Progress</span>
                    </div>
                    <span className="font-semibold">{Math.min(100, Math.max(0, Math.round(progress)))}%</span>
                  </div>
                  <div className="relative">
                    <Progress
                      value={progress}
                      size="md"
                      radius="full"
                      classNames={{
                        base: "w-full",
                        track: "bg-white/20 border border-white/30",
                        indicator: "bg-gradient-to-r from-white to-white/80",
                      }}
                    />
                    {progress >= 20 && (
                      <div className="absolute -top-1 left-[20%] w-1 h-4 bg-white/30 rounded-full" />
                    )}
                    {progress >= 40 && (
                      <div className="absolute -top-1 left-[40%] w-1 h-4 bg-white/30 rounded-full" />
                    )}
                    {progress >= 60 && (
                      <div className="absolute -top-1 left-[60%] w-1 h-4 bg-white/30 rounded-full" />
                    )}
                    {progress >= 80 && (
                      <div className="absolute -top-1 left-[80%] w-1 h-4 bg-white/30 rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default MembershipSection;