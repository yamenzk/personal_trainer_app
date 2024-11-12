import { format } from 'date-fns';
import { Button, Progress } from "@nextui-org/react";
import { ArrowRight, Crown, Trophy } from 'lucide-react';
import { PreferenceCard } from './PreferenceCard';
import { Membership } from '@/types/membership';

interface MembershipSectionProps {
  membership: Membership;
}

export const MembershipSection = ({ membership }: MembershipSectionProps) => {
  // Calculate membership progress
  const startDate = new Date(membership.start);
  const endDate = new Date(membership.end);
  const today = new Date();
  const progress = ((today.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100;

  return (
    <div className="space-y-4">
      <div className="px-4">
        <h2 className="text-xl font-semibold">Membership & Status</h2>
        <p className="text-sm text-foreground/60">Your active membership details</p>
      </div>
      
      <div className="px-4">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-500 via-secondary-600 to-secondary-700" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
          <div className="relative p-6 text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">Active Membership</h3>
                <p className="text-white/80">Track your membership progress</p>
              </div>
              <Button
                className="bg-white/10 hover:bg-white/20 text-white"
                variant="flat"
                endContent={<ArrowRight className="w-4 h-4" />}
              >
                Manage
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <PreferenceCard
                icon={Crown}
                label="Package"
                value={membership.package}
                color="warning"
              />
              <PreferenceCard
                icon={Trophy}
                label="Status"
                value="Active"
                color="success"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm text-white/80">Start Date</span>
                <p className="font-medium">
                  {format(new Date(membership.start), 'MMM d, yyyy')}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-white/80">End Date</span>
                <p className="font-medium">
                  {format(new Date(membership.end), 'MMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Membership Progress</span>
                <span>{Math.min(100, Math.max(0, Math.round(progress)))}%</span>
              </div>
              <Progress
                value={progress}
                color="primary"
                size="sm"
                radius="full"
                classNames={{
                  base: "w-full",
                  track: "bg-white/20",
                  indicator: "bg-white",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};