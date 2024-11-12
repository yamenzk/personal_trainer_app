import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Avatar,
  Button,
  Progress,
  Input,
  Chip,
  Divider,
  Snippet,
  Tooltip,
  ScrollShadow,
  Skeleton,
} from "@nextui-org/react";
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
  Gift,
  Crown,
  Star,
  LogOut,
  ArrowRight,
  Trophy,
  Check,
  Clock,
  UsersRound,
  Globe,
  Cake,
  AlertCircle,
  Copy,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { format } from 'date-fns';
import { useClientData } from '../hooks/useClientData';
import { useAuth } from '../contexts/AuthContext';
import { WeightModal } from '../components/shared/WeightModal';
import { usePreferencesUpdate } from '../App';
import { cn } from '@/utils/cn';
import { PageTransition } from '@/components/shared/PageTransition';
import { Client } from '@/types/client';
import { Membership } from '@/types/membership';

// Reusable Components
interface StatsCardProps {
  icon: any;
  label: string;
  value: string;
  color: string;
  className?: string;
}

const StatsCard = ({ icon: Icon, label, value, color, className }: StatsCardProps) => (
  <div className={cn(
    "p-4 rounded-xl transition-all",
    `bg-${color}-500/10 hover:bg-${color}-500/20`,
    className
  )}>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-${color}-500/10`}>
        <Icon className={`w-5 h-5 text-${color}-500`} />
      </div>
      <div>
        <p className="text-sm text-foreground/60">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

interface PreferenceCardProps {
  icon: any;
  label: string;
  value: string;
  color: string;
}

const PreferenceCard = ({ icon: Icon, label, value, color }: PreferenceCardProps) => (
  <div className="bg-white/10 rounded-xl p-4 space-y-2">
    <div className="flex items-center gap-2">
      <Icon className={`w-5 h-5 text-${color}-400`} />
      <span className="text-sm text-white/80">{label}</span>
    </div>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

const useReferrals = (clientId: string) => {
  const [referrals, setReferrals] = useState<Array<{ name: string; client_name: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await fetch(`/api/v2/method/personal_trainer_app.api.get_referrals?client_id=${clientId}`);
        const data = await response.json();
        setReferrals(data.data || []);
      } catch (error) {
        console.error('Failed to fetch referrals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [clientId]);

  return { referrals, loading };
};

// Add ProfileSkeleton component at the top level
const ProfileSkeleton = () => {
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

// Create a ProfileContent component
const ProfileContent = ({
  client,
  membership,
  refreshData
}: {
  client: Client;
  membership: Membership;
  refreshData: () => Promise<void>;
}) => {
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [referralError, setReferralError] = useState('');
  const [referralSuccess, setReferralSuccess] = useState(false);
  const handlePreferencesUpdate = usePreferencesUpdate();
  const [isCopying, setIsCopying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { referrals, loading: loadingReferrals } = useReferrals(client.name);
  const { logout } = useAuth();

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

  const copyReferralCode = async () => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(client.name);
      setReferralSuccess(true);
      setTimeout(() => setReferralSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    } finally {
      setIsCopying(false);
    }
  };

  const handleReferralSubmit = async () => {
    if (!referralCode.trim()) {
      setReferralError('Please enter a referral code');
      return;
    }

    try {
      setIsSubmitting(true);
      setReferralError('');
      const response = await fetch(
        `/api/v2/method/personal_trainer_app.api.update_client?client_id=${client.name}&referred_by=${referralCode}`
      );
      
      const data = await response.json();
      if (!response.ok) {
        setReferralError(data.message || 'Invalid referral code');
        setReferralSuccess(false);
      } else {
        setReferralSuccess(true);
        setReferralError('');
        await refreshData();
      }
    } catch (err) {
      setReferralError('Failed to update referral. Please try again.');
      setReferralSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate membership progress
  const startDate = new Date(membership.start);
  const endDate = new Date(membership.end);
  const today = new Date();
  const progress = ((today.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100;

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto space-y-12">
        {/* Hero Section */}
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
                onPress={logout}
                className="lg:self-start"
              >
                Logout
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Two Column Layout: Membership Status and Personal Info */}
        <div className="space-y-4">
          <div className="px-4">
            <h2 className="text-xl font-semibold">Membership & Personal Info</h2>
            <p className="text-sm text-foreground/60">Your account details and status</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
            {/* Membership Status */}
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

            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">Personal Information</h3>
                  <p className="text-foreground/60">Your profile details</p>
                </div>
              </div>

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
        </div>

        {/* Fitness Preferences Section */}
        <div className="space-y-4">
          <div className="px-4">
            <h2 className="text-xl font-semibold">Fitness Preferences</h2>
            <p className="text-sm text-foreground/60">Your training and nutrition configuration</p>
          </div>
          <div className="px-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 via-primary-600/10 to-primary-700/10 border border-primary-500/20">
              <div className="relative p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">Current Configuration</h3>
                    <p className="text-sm text-foreground/60">Your personalized training setup</p>
                  </div>
                  {client.allow_preference_update === 1 && (
                    <Button
                      color="primary"
                      variant="flat"
                      startContent={<Settings className="w-4 h-4" />}
                      onPress={updatePreferences}
                      size="sm"
                    >
                      Update Preferences
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Card className="bg-primary-500/10 border-none">
                    <CardBody className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-warning-500/10">
                          <Target className="w-4 h-4 text-warning-500" />
                        </div>
                        <span className="text-sm font-medium">Goal</span>
                      </div>
                      <p className="text-foreground/90 font-semibold">{client.goal}</p>
                    </CardBody>
                  </Card>

                  <Card className="bg-primary-500/10 border-none">
                    <CardBody className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary-500/10">
                          <Activity className="w-4 h-4 text-primary-500" />
                        </div>
                        <span className="text-sm font-medium">Activity</span>
                      </div>
                      <p className="text-foreground/90 font-semibold">{client.activity_level}</p>
                    </CardBody>
                  </Card>

                  <Card className="bg-primary-500/10 border-none">
                    <CardBody className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-success-500/10">
                          <Scale className="w-4 h-4 text-success-500" />
                        </div>
                        <span className="text-sm font-medium">Target</span>
                      </div>
                      <p className="text-foreground/90 font-semibold">{client.target_weight} kg</p>
                    </CardBody>
                  </Card>

                  <Card className="bg-primary-500/10 border-none">
                    <CardBody className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-warning-500/10">
                          <Dumbbell className="w-4 h-4 text-warning-500" />
                        </div>
                        <span className="text-sm font-medium">Equipment</span>
                      </div>
                      <p className="text-foreground/90 font-semibold">{client.equipment}</p>
                    </CardBody>
                  </Card>

                  <Card className="bg-primary-500/10 border-none">
                    <CardBody className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary-500/10">
                          <Calendar className="w-4 h-4 text-primary-500" />
                        </div>
                        <span className="text-sm font-medium">Workouts</span>
                      </div>
                      <p className="text-foreground/90 font-semibold">{client.workouts} / week</p>
                    </CardBody>
                  </Card>

                  <Card className="bg-primary-500/10 border-none">
                    <CardBody className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-success-500/10">
                          <Clock className="w-4 h-4 text-success-500" />
                        </div>
                        <span className="text-sm font-medium">Meals</span>
                      </div>
                      <p className="text-foreground/90 font-semibold">{client.meals} / day</p>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Program Section */}
        <div className="space-y-4">
          <div className="px-4">
            <h2 className="text-xl font-semibold">Referral Program</h2>
            <p className="text-sm text-foreground/60">Share and earn rewards together</p>
          </div>
          
          <div className="px-4">
            <Card className="border-none bg-gradient-to-br from-warning-100 to-warning-200 dark:from-warning-900/40 dark:to-warning-800/40">
              <CardBody className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column - Your Referral Code */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-warning-900 dark:text-warning-200">Your Referral Code</h3>
                        <p className="text-warning-700/80 dark:text-warning-300/80 text-sm">Share this code with friends</p>
                      </div>
                      <div className="p-2 rounded-full bg-warning-200/50 dark:bg-warning-500/20">
                        <Gift className="w-5 h-5 text-warning-700 dark:text-warning-300" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Snippet
                        hideSymbol
                        variant="flat"
                        onCopy={copyReferralCode}
                        classNames={{
                          base: "bg-background border border-warning-200 dark:border-warning-800",
                          pre: "text-warning-900 dark:text-warning-200 font-medium",
                          copyButton: "text-warning-700 dark:text-warning-300",
                        }}
                        symbol={
                          referralSuccess ? (
                            <Check className="text-success-500 w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )
                        }
                      >
                        {client.name}
                      </Snippet>

                      <Card className="border-none bg-background/80">
                        <CardBody className="p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-warning-600 dark:text-warning-400" />
                            <span className="font-medium text-foreground">Get Rewarded</span>
                          </div>
                          <p className="text-sm text-foreground/80">
                            Receive a 1-month membership extension for each friend who joins using your referral code!
                          </p>
                        </CardBody>
                      </Card>

                      {!loadingReferrals && referrals.length > 0 && (
                        <Card className="border-none bg-background/80">
                          <CardBody className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-warning-600 dark:text-warning-400" />
                                <span className="font-medium text-foreground">Your Referrals</span>
                              </div>
                              <Chip
                                size="sm"
                                variant="flat"
                                color="warning"
                              >
                                {referrals.length} joined
                              </Chip>
                            </div>
                            <div className="space-y-2">
                              {referrals.map((referral) => (
                                <div key={referral.name} className="flex items-center gap-2 text-sm text-foreground/80">
                                  <Check className="w-4 h-4 text-success-500" />
                                  {referral.client_name}
                                </div>
                              ))}
                            </div>
                          </CardBody>
                        </Card>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Enter Code or Status */}
                  <div className="space-y-6">
                    {!client.referred_by ? (
                      <>
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold text-warning-900 dark:text-warning-200">Enter Referral Code</h3>
                          <p className="text-warning-700/80 dark:text-warning-300/80 text-sm">Were you referred by a friend?</p>
                        </div>

                        <div className="space-y-4">
                          <Input
                            label="Referral Code"
                            placeholder="Enter your friend's code"
                            value={referralCode}
                            onValueChange={(value) => {
                              setReferralCode(value);
                              setReferralError('');
                            }}
                            errorMessage={referralError}
                            isInvalid={!!referralError}
                            classNames={{
                              label: "text-warning-800 dark:text-warning-300",
                              input: "bg-background text-foreground",
                              inputWrapper: "bg-background border-warning-300 dark:border-warning-800",
                            }}
                            startContent={
                              <Users className="w-4 h-4 text-warning-600 dark:text-warning-400" />
                            }
                          />

                          <Button
                            fullWidth
                            color="warning"
                            variant="flat"
                            onPress={handleReferralSubmit}
                            isLoading={isSubmitting}
                            startContent={!isSubmitting && <Gift className="w-4 h-4" />}
                          >
                            {isSubmitting ? 'Submitting...' : 'Submit Code'}
                          </Button>

                          {referralError && (
                            <div className="flex items-center gap-2 text-danger-600 text-sm bg-danger-100 dark:bg-danger-900/20 p-2 rounded-lg">
                              <AlertCircle className="w-4 h-4" />
                              {referralError}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <Card className="border-none bg-background/80">
                        <CardBody className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-success-100 dark:bg-success-900/20">
                              <Check className="w-5 h-5 text-success-600 dark:text-success-400" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium text-foreground">Referred By</p>
                              <p className="text-foreground/60 text-sm">{client.referred_by}</p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Weight Modal */}
        <AnimatePresence>
          {showWeightModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <WeightModal
                isOpen={showWeightModal}
                onClose={() => setShowWeightModal(false)}
                onWeightLogged={refreshData}
                clientId={client.name}
                currentWeight={client.current_weight}
                weightGoal={client.goal}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Update the main Profile component
export default function Profile() {
  const { loading, error, client, membership, refreshData } = useClientData();

  return (
    <PageTransition
      loading={loading}
      error={error}
      skeleton={<ProfileSkeleton />}
    >
      {client && membership && (
        <ProfileContent
          client={client}
          membership={membership}
          refreshData={refreshData}
        />
      )}
    </PageTransition>
  );
}