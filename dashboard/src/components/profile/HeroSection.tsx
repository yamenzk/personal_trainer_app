import { format } from 'date-fns';
import { Card, CardBody, Avatar, Button, Chip } from "@nextui-org/react";
import { Crown, LogOut, Target, Dumbbell, Activity } from 'lucide-react';
import { PromoCodeButton } from '../shared/PromoCodeButton';
import { HeroSectionProps } from '@/types';


export const HeroSection = ({ client, onLogout, membership }: HeroSectionProps) => {
  return (
    <div className="relative">
      {/* Logout Button */}
      <Button
        isIconOnly
        color="default"
        variant="light"
        onPress={onLogout}
        className="absolute top-4 right-4 z-10"
        size="sm"
      >
        <LogOut className="w-4 h-4" />
      </Button>

      <Card className="border-none bg-content2 rounded-none shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)] rounded-b-4xl overflow-visible">
        <CardBody className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-6 lg:gap-8">
              {/* Avatar & Membership Badge Section */}
              <div className="relative flex flex-col items-center lg:items-start">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl" />
                  <Avatar
                    src={client.image}
                    className="w-24 h-24 text-large ring-4 ring-secondary ring-offset-2 ring-offset-content2 from-primary to-secondary"
                    showFallback
                    name={client.client_name ?? ''}
                    classNames={{
                      base: "bg-gradient-to-br from-primary/10 to-secondary/10",
                      icon: "text-foreground/80"
                    }}
                  />
                </div>
                <div className="mt-4 lg:mt-2">
                  <Chip
                    startContent={<Crown className="w-3.5 h-3.5" />}
                    variant="shadow"
                    color="warning"
                    size="sm"
                    className="font-medium"
                  >
                    {membership.package}
                  </Chip>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-6 text-center lg:text-left">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold tracking-tight">
                    {client.client_name}
                  </h1>
                  <p className="text-foreground-500 text-sm">
                    Member since {format(new Date(client.creation), 'MMMM d, yyyy')}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary">
                    <Target className="w-4 h-4" />
                    <span className="text-sm font-medium">{client.goal}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary">
                    <Dumbbell className="w-4 h-4" />
                    <span className="text-sm font-medium">{client.equipment}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 text-success">
                    <Activity className="w-4 h-4" />
                    <span className="text-sm font-medium">{client.activity_level}</span>
                  </div>
                </div>

                {/* Promo Button */}
                <div className="flex justify-center lg:justify-start">
                  <PromoCodeButton
                    membershipId={membership.name}
                    variant="flat"
                    className="bg-gradient-to-r from-secondary to-primary text-white shadow-lg hover:shadow-primary/25 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default HeroSection;