import { useState } from 'react';
import {
  Button,
  Avatar,
  Tooltip,
  Chip,
} from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Flag,
  Target,
  Activity,
  Dumbbell,
  Scale,
  Calendar,
  Settings,
  Heart,
  Info,
  Check,
  Edit2,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { useClientData } from '../hooks/useClientData';
import { useAuth } from '../contexts/AuthContext';
import { GlassCard } from '../components/shared/GlassCard';
import { WeightModal } from '../components/shared/WeightModal';
import { usePreferencesUpdate } from '../App';

export default function Profile() {
  const { loading, error, client, membership, refreshData } = useClientData();
  const { logout } = useAuth();
  const [showWeightModal, setShowWeightModal] = useState(false);
  const handlePreferencesUpdate = usePreferencesUpdate();

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          </div>
          <div className="text-foreground/60 font-medium">Loading your profile...</div>
        </div>
      </div>
    );
  }

  if (error || !client || !membership) return null;

  const updatePreferences = () => {
    handlePreferencesUpdate([
      'ActivityLevel',
      'Equipment',
      'Goal',
      'Meals',
      'TargetWeight',
      'Workouts'
    ]);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <GlassCard 
        variant="gradient" 
        gradient="from-primary-500/10 via-background to-secondary-500/10"
      >
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <Avatar
                src={client.image}
                className="w-24 h-24 text-large"
                showFallback
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-success-500 flex items-center justify-center border-4 border-background">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
            
            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{client.client_name}</h1>
                <p className="text-foreground/60">
                  Member since {format(new Date(client.creation), 'MMMM d, yyyy')}
                </p>
              </div>

              {/* Package Info */}
              <div className="flex flex-wrap gap-3">
                <Chip
                  className="bg-primary-500/10"
                  startContent={<Heart size={14} className="text-primary-500" />}
                >
                  {membership.package} Package
                </Chip>
                <Chip
                  className="bg-success-500/10"
                  startContent={<Calendar size={14} className="text-success-500" />}
                >
                  Active until {format(new Date(membership.end), 'MMM d, yyyy')}
                </Chip>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 md:self-start">
              {client.allow_preference_update === 1 && (
                <Button
                  color="primary"
                  variant="flat"
                  startContent={<Settings size={18} />}
                  onPress={updatePreferences}
                >
                  Update Preferences
                </Button>
              )}
              <Button
                color="danger"
                variant="light"
                startContent={<LogOut size={18} />}
                onPress={logout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <GlassCard className="h-full">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <Tooltip content="Basic profile information">
                <Info className="w-5 h-5 text-foreground/60" />
              </Tooltip>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-500/10">
                  <Calendar className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Date of Birth</p>
                  <p className="font-medium">
                    {format(new Date(client.date_of_birth), 'MMMM d, yyyy')} ({client.age} years)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary-500/10">
                  <Mail className="w-5 h-5 text-secondary-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success-500/10">
                  <Phone className="w-5 h-5 text-success-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Phone</p>
                  <p className="font-medium">{client.mobile || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning-500/10">
                  <Flag className="w-5 h-5 text-warning-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Nationality</p>
                  <p className="font-medium">{client.nationality}</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Fitness Preferences */}
        <GlassCard className="h-full">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Fitness Preferences</h3>
              <Tooltip content="Your current fitness settings">
                <Info className="w-5 h-5 text-foreground/60" />
              </Tooltip>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-500/10">
                  <Target className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Goal</p>
                  <p className="font-medium">{client.goal}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary-500/10">
                  <Activity className="w-5 h-5 text-secondary-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Activity Level</p>
                  <p className="font-medium">{client.activity_level}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success-500/10">
                  <Dumbbell className="w-5 h-5 text-success-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Equipment</p>
                  <p className="font-medium">{client.equipment}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning-500/10">
                  <Scale className="w-5 h-5 text-warning-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Height & Target Weight</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{client.height}cm • Target: {client.target_weight}kg</p>
                    <Button
                      size="sm"
                      variant="light"
                      isIconOnly
                      onPress={() => setShowWeightModal(true)}
                    >
                      <Edit2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Training Schedule */}
        <GlassCard className="lg:col-span-2">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Training Schedule</h3>
              <Tooltip content="Your weekly training structure">
                <Info className="w-5 h-5 text-foreground/60" />
              </Tooltip>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/10">
                    <Dumbbell className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Weekly Workouts</p>
                    <p className="font-medium">{client.workouts} sessions per week</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary-500/10">
                    <Activity className="w-5 h-5 text-secondary-500" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Daily Meals</p>
                    <p className="font-medium">{client.meals} meals per day</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-500/5">
                <AlertCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm text-foreground/70">
                    Your schedule is optimized based on your goals and availability. 
                    Regular consistency with this schedule will help you achieve optimal results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Weight Update Modal */}
      <AnimatePresence>
        {showWeightModal && (
          <WeightModal
            isOpen={showWeightModal}
            onClose={() => setShowWeightModal(false)}
            onWeightLogged={refreshData}
            clientId={client.name}
            currentWeight={client.current_weight}
          />
        )}
      </AnimatePresence>
    </div>
  );
}