import { Button } from "@nextui-org/react";
import { Gift } from "lucide-react";
import { useState } from "react";
import { PromoCodeModal } from "./PromoCodeModal";
import { motion } from 'framer-motion';
import { PromoCodeButtonProps } from "@/types";

export const PromoCodeButton = ({ variant = "flat", className }: PromoCodeButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        as={motion.button}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        color="secondary"
        variant={variant}
        startContent={
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Gift className="w-4 h-4" />
          </motion.div>
        }
        onPress={() => setIsOpen(true)}
        className={className}
      >
        Redeem Promo
      </Button>
      <PromoCodeModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};