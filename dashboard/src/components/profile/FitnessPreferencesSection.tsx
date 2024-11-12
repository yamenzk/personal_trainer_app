import { Button, Card, CardBody } from "@nextui-org/react";
import { Settings, Target, Activity, Scale, Dumbbell, Calendar, Clock } from 'lucide-react';
import { Client } from '@/types/client';
import { useState } from 'react';
import { PreferencesModal } from './PreferencesModal';

interface FitnessPreferencesSectionProps {
  client: Client;
  updatePreferences: () => void;
  refreshData: () => void;  // Add this prop
}

export const FitnessPreferencesSection = ({ 
  client, 
  updatePreferences,
  refreshData 
}: FitnessPreferencesSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdateClick = () => {
    setIsModalOpen(true);
  };

  const handleComplete = async () => {
    try {
      await updatePreferences();
      setIsModalOpen(false);
      // Force a page refresh
      window.location.reload();
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="px-4 flex items-center justify-between">
        <div className="">
          <h2 className="text-xl font-semibold">Fitness Preferences</h2>
          <p className="text-sm text-foreground/60">Your training and nutrition configuration</p>
        </div>
        {client.allow_preference_update === 1 && (
          <Button
            color="primary"
            variant="shadow"
            startContent={<Settings className="w-4 h-4" />}
            onPress={handleUpdateClick}
            size="sm"
          >
            Update
          </Button>
        )}
      </div>
      <div className="px-4">
        <div className="relative overflow-hidden rounded-2xl ">
          <div className="relative space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <PreferenceGridItem icon={Target} label="Goal" value={client.goal} color="warning" />
              <PreferenceGridItem icon={Activity} label="Activity" value={client.activity_level} color="primary" />
              <PreferenceGridItem icon={Scale} label="Target" value={`${client.target_weight} kg`} color="success" />
              <PreferenceGridItem icon={Dumbbell} label="Equipment" value={client.equipment} color="warning" />
              <PreferenceGridItem icon={Calendar} label="Workouts" value={`${client.workouts} / week`} color="primary" />
              <PreferenceGridItem icon={Clock} label="Meals" value={`${client.meals} / day`} color="success" />
            </div>
          </div>
        </div>
      </div>
      <PreferencesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        client={client}
        onComplete={handleComplete}
      />
    </div>
  );
};

interface PreferenceGridItemProps {
  icon: any;
  label: string;
  value: string;
  color: string;
}

const PreferenceGridItem = ({ icon: Icon, label, value, color }: PreferenceGridItemProps) => (
  <Card className="bg-primary-500/10 border-none">
    <CardBody className="p-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-lg bg-${color}-500/10`}>
          <Icon className={`w-4 h-4 text-${color}-500`} />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-foreground/90 font-semibold">{value}</p>
    </CardBody>
  </Card>
);