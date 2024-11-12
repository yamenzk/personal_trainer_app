import { useState } from 'react';
import { 
  Card,
  CardBody,
  Avatar,
  Button,
  Input,
  Chip,
  Tooltip,
  Divider,
} from "@nextui-org/react";
import { 
  Gift,
  Users,
  Check,
  Copy,
  AlertCircle,
  Share2,
  Heart,
  Sparkles,
  Trophy
} from 'lucide-react';
import { Client } from '@/types/client';
import { useReferrals } from '@/hooks/useReferrals';

interface ReferralSectionProps {
  client: Client;
  refreshData: () => Promise<void>;
}

interface Referral {
  name: string;
  client_name: string;
  image: string;
}

const parseErrorMessage = (error: any): string => {
    try {
      // If it's a string that looks like JSON, parse it
      if (typeof error === 'string' && error.startsWith('[')) {
        const parsedErrors = JSON.parse(error);
        // Find the validation error message
        const validationError = parsedErrors.find((err: any) => 
          err.message && (
            err.message.includes('ValidationError') || 
            err.message.includes('Circular referral detected')
          )
        );
        if (validationError) {
          // Extract the actual error message
          const match = validationError.message.match(/ValidationError: (.*?)(\n|$)/) || 
                       validationError.message.match(/ValidationError: (.+)/) ||
                       validationError.message.match(/(.+)/);
          return match ? match[1] : validationError.message;
        }
      }
      
      // Handle cases where the error message might be nested differently
      if (typeof error === 'string') {
        const circularMatch = error.match(/ValidationError: (.+)/);
        if (circularMatch) {
          return circularMatch[1];
        }
      }
      
      // If error has a message property
      if (error.message) {
        return error.message;
      }
  
      // If error.error exists
      if (error.error) {
        return error.error;
      }
  
      // If nothing else works, stringify the error
      return String(error);
    } catch (e) {
      return 'An unexpected error occurred. Please try again.';
    }
  };

export const ReferralSection = ({ client, refreshData }: ReferralSectionProps) => {
  const [referralCode, setReferralCode] = useState('');
  const [referralError, setReferralError] = useState('');
  const [referralSuccess, setReferralSuccess] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { referrals, loading: loadingReferrals } = useReferrals(client.name);

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
  
    setReferralError('');
    setIsSubmitting(true);
  
    try {
      const response = await fetch(
        `/api/v2/method/personal_trainer_app.api.update_client?client_id=${client.name}&referred_by=${referralCode}`
      );
      
      const data = await response.json();
  
      if (!response.ok) {
        let errorMessage: string;
  
        // Direct error property (handles self-referral)
        if (data.error) {
          errorMessage = data.error;
        }
        // Errors array (handles invalid code and circular referral)
        else if (data.errors?.[0]) {
          const errorObj = data.errors[0];
          
          // Get the full exception string
          const exception = errorObj.exception;
          
          // Split into lines and get the last few lines
          const lines = exception.split('\n');
          
          // Extract the actual error message from the last line
          const lastLine = lines[lines.length - 1];
          
          if (lastLine.includes('ValidationError:')) {
            const match = lastLine.match(/ValidationError: (.+)/);
            errorMessage = match ? match[1].trim() : lastLine;
          } else {
            // Look for the error message in quotes
            const quoteMatch = exception.match(/ValidationError\(["'](.+?)["']\)/);
            if (quoteMatch) {
              errorMessage = quoteMatch[1];
            } else {
              // Final fallback - look for the last quoted string
              const finalMatch = exception.match(/["']([^"']+)["']/);
              errorMessage = finalMatch ? finalMatch[1] : lastLine;
            }
          }
        } else {
          errorMessage = 'An error occurred while processing your referral';
        }
  
  
        // Map backend error messages to user-friendly messages
        const errorMap: Record<string, string> = {
          'You cannot refer yourself.': 'You cannot use your own referral code',
          'Referral code does not exist.': 'This referral code is invalid',
          'Circular referral detected.': 'You cannot refer someone who has already referred you'
        };
  
        // Clean up the error message and ensure it ends with a period
        const cleanedError = errorMessage.trim().replace(/\.?$/, '.');
  
        setReferralError(errorMap[cleanedError] || errorMessage);
        setReferralSuccess(false);
      } else {
        setReferralSuccess(true);
        setReferralError('');
        await refreshData();
      }
    } catch (err) {
      console.error('Failed to update referral:', err);
      setReferralError('Failed to update referral. Please try again.');
      setReferralSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4">
      <Card className="border-none bg-gradient-to-br from-zinc-900/95 to-zinc-950/95">
        <CardBody className="p-0">
          {/* Hero Section - Updated with warning colors */}
          <div className="relative overflow-hidden rounded-t-xl bg-gradient-to-br from-orange-500 to-orange-800 p-6">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-300 rounded-full blur-3xl opacity-20 -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-warning-300 rounded-full blur-3xl opacity-20 -ml-48 -mb-48" />
            
            <div className="relative flex items-start justify-between">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-white/20 backdrop-blur-xl rounded-xl">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Referral Rewards</h2>
                  <p className="text-white/80 text-sm mt-1">Share the journey, spread the benefits</p>
                </div>
              </div>
              {/* {!loadingReferrals && referrals.length > 0 && (
                <Chip
                  startContent={<Trophy className="w-3.5 h-3.5" />}
                  className="bg-white/20 backdrop-blur-xl text-white border-white/20 absolute -top- right-2"
                  size="sm"
                >
                  {referrals.length} {referrals.length === 1 ? 'month' : 'months'} awarded
                </Chip>
              )} */}
            </div>
          </div>

          {/* Content Section */}
          <div className="px-6 py-4 space-y-6">
            {/* Your Referral Code Section - Always visible with improved messaging */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Your Referral Code</p>
                  <p className="text-xs text-default-500">Share this unique code with friends</p>
                </div>
                <Tooltip content={isCopying ? "Copied!" : "Copy Code"}>
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={copyReferralCode}
                  >
                    {isCopying ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </Tooltip>
              </div>
              <Button
                className="w-full h-14 bg-warning-50/50 hover:bg-warning-100/50 dark:bg-warning-900/20 dark:hover:bg-warning-900/30"
                onPress={copyReferralCode}
              >
                <div className="flex items-center gap-3">
                  <Share2 className="w-5 h-5 text-warning-600 dark:text-warning-400" />
                  <span className="font-mono text-lg font-bold text-warning-600 dark:text-warning-400">
                    {client.name}
                  </span>
                </div>
              </Button>
              <Card className="bg-warning-50/30 border-none dark:bg-warning-900/10">
                <CardBody className="py-3 gap-2">
                  <div className="flex items-start gap-2">
                    <div className="p-1 rounded-md bg-warning-100 dark:bg-warning-900">
                      <Heart className="w-3.5 h-3.5 text-warning-600 dark:text-warning-400" />
                    </div>
                    <p className="text-xs text-warning-600/90 dark:text-warning-400/90 flex-1">
                      When friends use your code, you'll receive one free month for each successful referral.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="p-1 rounded-md bg-warning-100 dark:bg-warning-900">
                      <Users className="w-3.5 h-3.5 text-warning-600 dark:text-warning-400" />
                    </div>
                    <p className="text-xs text-warning-600/90 dark:text-warning-400/90 flex-1">
                      Share with as many friends as you like - there's no limit to the free months you can earn!
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Referred By Section - If applicable */}
            {client.referred_by && (
              <>
                <Divider className="my-4" />
                <div className="space-y-3">
                  <p className="text-sm font-medium">Referred By</p>
                  <Card className="bg-success-50/50 dark:bg-success-900/20 border-none">
                    <CardBody className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={client.referred_by}
                          className="w-10 h-10"
                          showFallback
                          classNames={{
                            base: "bg-success-100 dark:bg-success-900",
                            icon: "text-success-600 dark:text-success-400"
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-success-600 dark:text-success-400">
                            {client.referred_by}
                          </p>
                          <p className="text-xs text-success-600/60 dark:text-success-400/60">
                            Your referrer earned 1 free month
                          </p>
                        </div>
                        <Chip
                          startContent={<Check className="w-3 h-3" />}
                          variant="flat"
                          color="success"
                          size="sm"
                        >
                          Active
                        </Chip>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </>
            )}

            {/* Enter Friend's Code Section - Updated messaging */}
            {!client.referred_by && (
              <>
                <Divider className="my-4" />
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Have a friend's code?</p>
                    <p className="text-xs text-default-500">Enter their referral code to help them earn a free month</p>
                  </div>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleReferralSubmit();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      placeholder="Enter friend's code"
                      value={referralCode}
                      onValueChange={(value) => {
                        setReferralCode(value);
                        setReferralError('');
                      }}
                      errorMessage={referralError}
                      isInvalid={!!referralError}
                      startContent={<Users className="w-4 h-4 text-default-400" />}
                      size="sm"
                    />
                    <Button
                      color="warning"
                      type="submit"
                      isLoading={isSubmitting}
                      size="sm"
                      className="px-4"
                    >
                      Apply
                    </Button>
                  </form>
                </div>
              </>
            )}

            {/* Referrals Section */}
            {!loadingReferrals && referrals.length > 0 && (
              <>
                <Divider className="my-4" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-warning-500" />
                      <p className="text-sm font-medium">Friends You've Referred</p>
                    </div>
                    <Chip size="sm" color="warning" variant="flat">
                      {referrals.length} {referrals.length === 1 ? 'friend' : 'friends'}
                    </Chip>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {referrals.map((referral) => (
                      <Chip
                        key={referral.name}
                        startContent={
                          <Avatar
                            name={referral.client_name}
                            src={referral.image || undefined}
                            className="w-6 h-6"
                            showFallback
                            classNames={{
                              base: "bg-warning-100 dark:bg-warning-900",
                              icon: "text-warning-600 dark:text-warning-400"
                            }}
                          />
                        }
                        variant="flat"
                        color="warning"
                        className="h-8"
                      >
                        {referral.client_name}
                      </Chip>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ReferralSection;