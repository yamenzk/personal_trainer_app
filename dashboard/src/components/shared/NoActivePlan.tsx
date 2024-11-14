import { Card, CardBody, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { FileSpreadsheet, History } from "lucide-react";
import React from "react";

interface NoActivePlanProps {
  type: 'workout' | 'meal';
  hasHistory: boolean;
  onViewHistory?: () => void;
}

export const NoActivePlan: React.FC<NoActivePlanProps> = ({
  type,
  hasHistory,
  onViewHistory
}) => {
  return (
    <div className="flex items-start justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="bg-secondary-800/50 border border-content2/10">
          <CardBody className="py-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
              <FileSpreadsheet className="w-8 h-8 text-secondary-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                No Active {type === 'workout' ? 'Workout' : 'Meal'} Plan
              </h3>
              <p className="text-sm text-foreground/60 max-w-sm mx-auto">
                I am currently working on your new plan. 
                {hasHistory && " In the meantime, you can review your previous plans."}
              </p>
            </div>
            {hasHistory && onViewHistory && (
              <div className="pt-4">
                <Button
                  variant="shadow"
                  color="secondary"
                  startContent={<History className="w-4 h-4" />}
                  onPress={onViewHistory}
                >
                  View Previous Plans
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};