import { getAvailablePromoCodes, redeemPromoCode } from '@/utils/api';
import { useState, useEffect } from 'react';
import { 
  Modal, ModalContent, Button, Input, Chip, Card, CardBody,
  ScrollShadow, Progress, 
  Divider
} from "@nextui-org/react";
import { Ticket, Gift, Sparkles, CheckCircle } from 'lucide-react';
import { PromoCode, PromoCodeModalProps } from '@/types';
import { useClientStore } from '@/stores/clientStore';

const getFriendlyErrorMessage = (error: string) => {
  const errorMap: Record<string, string> = {
    'not_found': "We couldn't find this promo code.",
    'already_redeemed': "You've already used this code.",
    'expired': "This promotion has ended.",
    'invalid': "This code isn't valid. Make sure to enter it exactly as shown.",
    'inactive': "This promotion hasn't started yet. Check back soon!",
    'default': "Something went wrong. Please try again in a moment."
  };

  if (error.includes('not found')) return errorMap.not_found;
  if (error.includes('already redeemed')) return errorMap.already_redeemed;
  if (error.includes('expired')) return errorMap.expired;
  if (error.includes('invalid')) return errorMap.invalid;
  if (error.includes('inactive')) return errorMap.inactive;

  return errorMap.default;
};

export const PromoCodeModal = ({ isOpen, onClose }: PromoCodeModalProps) => {
  const membership = useClientStore(state => state.membership);
  const fetch = useClientStore(state => state.fetch);
  const [code, setCode] = useState('');
  const [availableCodes, setAvailableCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success' | null; message: string }>({
    type: null,
    message: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchAvailableCodes();
    }
  }, [isOpen]);

  const fetchAvailableCodes = async () => {
    try {
      const response = await getAvailablePromoCodes(membership?.name || '');
      setAvailableCodes(response.data);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    }
  };

  const handleRedeem = async (promoCode: string) => {
    if (!membership?.name) return;
    
    setIsLoading(true);
    setStatus({ type: null, message: '' });
    setCode(promoCode);
    
    try {
      const response = await redeemPromoCode(membership.name, promoCode);
      
      if (response.data.status === 'success') {
        setStatus({ 
          type: 'success', 
          message: 'Great! Your discount has been applied to your account.' 
        });
        // Immediately fetch fresh data
        await fetch();
        // Close modal after a brief delay to show success message
        setTimeout(() => {
          onClose();
          setStatus({ type: null, message: '' });
        }, 800); // Increased delay slightly to ensure data is updated
      } else {
        setStatus({ 
          type: 'error', 
          message: getFriendlyErrorMessage(response.data.message)
        });
      }
    } catch (error: any) {
      setStatus({ 
        type: 'error', 
        message: getFriendlyErrorMessage(error.message)
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      placement="center"
      hideCloseButton
      backdrop='blur'
      classNames={{
        base: "bg-background",
        wrapper: "p-2 sm:p-6"
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" }
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: { duration: 0.2, ease: "easeIn" }
          }
        }
      }}
    >
      <ModalContent>
        <Card className="border-none shadow-none bg-background">
          <CardBody className="gap-8 p-8">
            {/* Header Section */}
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Redeem Promo Code</h2>
                <p className="text-foreground-500">Enter a promo code</p>
              </div>
            </div>

            {/* Input Section */}
            <div className="space-y-4">
              <Input
                label="Promo Code"
                labelPlacement="outside"
                placeholder="Enter your code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                startContent={<Ticket className="w-4 h-4 text-foreground-500" />}
                classNames={{
                  label: "text-foreground-600 font-medium",
                  input: "text-lg tracking-wider",
                  inputWrapper: "bg-default-100 shadow-none hover:bg-default-200 transition-colors"
                }}
                variant="flat"
                size="lg"
              />
              
              {status.type && (
                <div className={`p-4 rounded-xl flex items-start gap-3 ${
                  status.type === 'success' 
                    ? 'bg-success-800/50 text-success-600' 
                    : 'bg-danger-800/50 text-danger-600'
                }`}>
                  {status.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 mt-0.5" />
                  ) : (
                    <Sparkles className="w-5 h-5 mt-0.5" />
                  )}
                  <p className="text-sm font-medium leading-relaxed">{status.message}</p>
                </div>
              )}

              <Button
                color="primary"
                className="w-full font-medium text-base"
                onClick={() => handleRedeem(code)}
                isLoading={isLoading}
                startContent={!isLoading && <Gift className="w-4 h-4" />}
                size="lg"
                variant="shadow"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Progress
                      size="sm"
                      isIndeterminate
                      classNames={{
                        indicator: "bg-white"
                      }}
                      aria-label="Loading..."
                    />
                    Applying Code...
                  </div>
                ) : (
                  "Apply Code"
                )}
              </Button>
            </div>

            {/* Available Promotions Section */}
            {availableCodes.length > 0 && (
              <>
                <Divider className="my-4" />
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-secondary/10">
                      <Sparkles className="w-4 h-4 text-secondary" />
                    </div>
                    <h3 className="text-lg font-semibold">Available Promotions</h3>
                  </div>
                  
                  <ScrollShadow className="max-h-[280px]">
                    <div className="grid gap-2">
                      {availableCodes.map((promo) => (
                        <button
                          key={promo.name}
                          onClick={() => handleRedeem(promo.name)}
                          className="w-full p-3 rounded-xl bg-content1 hover:bg-content2 group transition-all duration-200 border border-transparent hover:border-primary/20 text-left relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                                {promo.title}
                              </h4>
                              <p className="text-sm text-foreground-300 -mt-0.5">
                                {promo.description}
                              </p>
                              <p className="text-xs text-foreground-500 mt-0.5">
                                Click to apply this promotion
                              </p>
                            </div>
                            <Chip
                              variant="flat"
                              color="secondary"
                              size="sm"
                              classNames={{
                                base: "bg-secondary/10 group-hover:bg-secondary transition-colors border-1 border-secondary/20",
                                content: "font-mono text-[11px] font-medium px-1 group-hover:text-white transition-colors"
                              }}
                            >
                              {promo.name}
                            </Chip>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollShadow>
                </div>
              </>
            )}

            {/* Footer */}
            <div className="flex justify-end">
              <Button 
                variant="light" 
                onPress={onClose}
                className="font-medium"
              >
                Close
              </Button>
            </div>
          </CardBody>
        </Card>
      </ModalContent>
    </Modal>
  );
};

export default PromoCodeModal;