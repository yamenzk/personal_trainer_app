// src/components/profile/ProfileDetails.tsx
import { Card, CardBody } from "@nextui-org/react";
import { Mail, Phone, Flag, Target, Activity, Dumbbell } from "lucide-react";
import { Client } from "../../types/client";

interface ProfileDetailsProps {
  client: Client;
}

const ProfileDetails = ({ client }: ProfileDetailsProps) => {
  return (
    <Card>
      <CardBody className="p-6 grid gap-6">
        <h2 className="text-lg font-semibold">Personal Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-foreground/60">Email</div>
                <div>{client.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-foreground/60">Mobile</div>
                <div>{client.mobile}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Flag className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-foreground/60">Nationality</div>
                <div>{client.nationality}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-foreground/60">Goal</div>
                <div>{client.goal}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-foreground/60">Activity Level</div>
                <div>{client.activity_level}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Dumbbell className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-foreground/60">Equipment</div>
                <div>{client.equipment}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-primary/10">
            <div className="text-sm text-foreground/60">Age</div>
            <div className="font-semibold">{client.age} years</div>
          </div>

          <div className="p-4 rounded-lg bg-primary/10">
            <div className="text-sm text-foreground/60">Height</div>
            <div className="font-semibold">{client.height} cm</div>
          </div>

          <div className="p-4 rounded-lg bg-primary/10">
            <div className="text-sm text-foreground/60">Daily Meals</div>
            <div className="font-semibold">{client.meals} meals</div>
          </div>

          <div className="p-4 rounded-lg bg-primary/10">
            <div className="text-sm text-foreground/60">Weekly Workouts</div>
            <div className="font-semibold">{client.workouts} sessions</div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProfileDetails;