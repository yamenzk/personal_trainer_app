import { ScrollShadow } from "@nextui-org/react";
import { Cake, Mail, Phone, Globe, UsersRound } from 'lucide-react';
import { format } from 'date-fns';
import { StatsCard } from './StatsCard';
import { PersonalInfoSectionProps } from '@/types';



export const PersonalInfoSection = ({ client }: PersonalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="px-4">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <p className="text-sm text-foreground/60">Your profile details</p>
      </div>

      <div className="px-4">
        <ScrollShadow className="space-y-3 max-h-[400px]">
          <StatsCard
            icon={Cake}
            label="Date of Birth"
            value={`${format(new Date(client.date_of_birth), 'MMMM d, yyyy')} (${client.age} years)`}
            color="primary"
          />
          <StatsCard
            icon={Mail}
            label="Email"
            value={client.email}
            color="secondary"
          />
          <StatsCard
            icon={Phone}
            label="Phone"
            value={client.mobile || 'Not provided'}
            color="success"
          />
          <StatsCard
            icon={Globe}
            label="Nationality"
            value={client.nationality}
            color="warning"
          />
          <StatsCard
            icon={UsersRound}
            label="Gender"
            value={client.gender}
            color="primary"
          />
        </ScrollShadow>
      </div>
    </div>
  );
};