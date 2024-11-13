import { useState, useEffect } from 'react';
import { 
  Modal, 
  ModalContent, 
  Button,
  Input,
  Chip,
  Card,
  CardBody,
  Divider,
  ScrollShadow,
  Progress
} from "@nextui-org/react";
import { Ticket, Gift, Sparkles, CheckCircle } from 'lucide-react';

interface PromoCode {
  name: string;
  title: string;
}

interface PromoCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  membershipId: string;
}

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

export const PromoCodeModal = ({ isOpen, onClose, membershipId }: PromoCodeModalProps) => {
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
      const response = await fetch('/api/v2/method/personal_trainer_app.api.get_available_codes?membership=' + membershipId);
      const { data } = await response.json();
      setAvailableCodes(data);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    }
  };

  const handleRedeem = async (promoCode: string) => {
    setIsLoading(true);
    setStatus({ type: null, message: '' });
    setCode(promoCode);
    
    try {
      const response = await fetch(`/api/v2/method/personal_trainer_app.api.redeem_code?membership=${membershipId}&code=${promoCode}`);
      const { data } = await response.json();
      
      if (data.status === 'success') {
        setStatus({ 
          type: 'success', 
          message: 'Great! Your discount has been applied to your account.' 
        });
        setTimeout(() => onClose(), 2000);
      } else {
        setStatus({ 
          type: 'error', 
          message: getFriendlyErrorMessage(data.message)
        });
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: "We're having trouble connecting. Please try again in a moment." 
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
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Available Promotions</h3>
                  </div>
                  
                  <ScrollShadow className="max-h-64">
                    <div className="grid gap-3">
                      {availableCodes.map((promo) => (
                        <button
                          key={promo.name}
                          onClick={() => handleRedeem(promo.name)}
                          className="w-full p-4 rounded-xl bg-default-50 hover:bg-default-100 group transition-all duration-200 border-2 border-transparent hover:border-primary/20 text-left"
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {promo.title}
                              </span>
                              <Chip
                                variant="flat"
                                color="primary"
                                size="sm"
                                className="font-mono bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors"
                              >
                                {promo.name}
                              </Chip>
                            </div>
                            <p className="text-sm text-foreground-500">
                              Click to apply this promotion to your account
                            </p>
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