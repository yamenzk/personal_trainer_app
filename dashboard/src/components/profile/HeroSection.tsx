
import { format } from 'date-fns';
import { Card, CardBody, Avatar, Button, Chip } from "@nextui-org/react";
import { Crown, LogOut, Target, Dumbbell, Activity, Check } from 'lucide-react';
import { motion } from "framer-motion";
import { Client } from '@/types/client';
import { Membership } from '@/types/membership';

interface HeroSectionProps {
  client: Client;
  onLogout: () => void;
  membership: Membership;
}

export const HeroSection = ({ client, onLogout, membership }: HeroSectionProps) => {
  return (
    <Card className="border-none bg-content2 rounded-none shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)] rounded-b-4xl overflow-visible">
      <CardBody className="p-6">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Avatar Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full blur-xl opacity-20" />
            <Avatar
              src={client.image}
              className="w-24 h-24 text-large ring-2 ring-offset-2 ring-offset-background ring-primary-500/30"
              showFallback
              name={client.client_name ?? ''}
              classNames={{
                base: "bg-gradient-to-br from-primary-500/50 to-secondary-500/50",
                icon: "text-white/90"
              }}
            />
            <motion.div 
              className="absolute -bottom-2 -right-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-8 h-8 rounded-full bg-success-500 flex items-center justify-center border-4 border-background">
                <Check className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <div className="space-y-1">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{client.client_name}</h1>
                <Chip
                  startContent={<Crown className="w-3.5 h-3.5" />}
                  variant="shadow"
                  color="warning"
                  size="sm"
                >
                  {membership.package}
                </Chip>
              </div>
              <p className="text-foreground/60">
                Member since {format(new Date(client.creation), 'MMMM d, yyyy')}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <Chip
                startContent={<Target className="w-3.5 h-3.5" />}
                variant="shadow"
                color="primary"
              >
                {client.goal}
              </Chip>
              <Chip
                startContent={<Dumbbell className="w-3.5 h-3.5" />}
                variant="shadow"
                color="secondary"
              >
                {client.equipment}
              </Chip>
              <Chip
                startContent={<Activity className="w-3.5 h-3.5" />}
                variant="shadow"
                color="success"
              >
                {client.activity_level}
              </Chip>
            </div>
          </div>

          {/* Action Button */}
          <Button
            color="danger"
            variant="flat"
            startContent={<LogOut className="w-4 h-4" />}
            onPress={onLogout}
            className="lg:self-start"
          >
            Logout
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};