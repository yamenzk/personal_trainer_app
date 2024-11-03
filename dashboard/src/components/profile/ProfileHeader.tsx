// src/components/profile/ProfileHeader.tsx
import { Card, CardBody, Avatar, Button } from "@nextui-org/react";
import { Settings, Calendar } from "lucide-react";
import { Client } from "../../types/client";
import { Membership } from "@/types/membership";

interface ProfileHeaderProps {
  client: Client;
  membership: Membership;
  onEditPreferences: () => void;
}

const ProfileHeader = ({ client, membership, onEditPreferences }: ProfileHeaderProps) => {
  const daysRemaining = Math.ceil(
    (new Date(membership.end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card>
      <CardBody className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar
            src={client.image}
            className="w-24 h-24"
            alt={client.client_name}
          />
          
          <div className="flex-1 space-y-4">
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">{client.client_name}</h1>
              <p className="text-foreground/60">Member since {new Date(client.creation).toLocaleDateString()}</p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="px-4 py-2 rounded-lg bg-primary/10">
                <div className="text-sm text-foreground/60">Package</div>
                <div className="font-semibold">{membership.package}</div>
              </div>

              <div className="px-4 py-2 rounded-lg bg-primary/10">
                <div className="text-sm text-foreground/60">Membership ID</div>
                <div className="font-semibold">{membership.name}</div>
              </div>

              <div className="px-4 py-2 rounded-lg bg-primary/10 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-sm text-foreground/60">Days Remaining</div>
                  <div className="font-semibold">{daysRemaining} days</div>
                </div>
              </div>
            </div>
          </div>

          {client.allow_preference_update === 1 && (
            <Button
              color="primary"
              variant="flat"
              startContent={<Settings size={18} />}
              onPress={onEditPreferences}
            >
              Update Preferences
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default ProfileHeader;