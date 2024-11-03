// src/components/shared/PlanSelector.tsx
import { Card, CardBody, Tabs, Tab, Chip } from "@nextui-org/react";
import { Plan } from "../../types/plan";
import { format } from "date-fns";
import { calculatePlanProgress } from "../../utils/api";
import { Calendar, Clock, CheckCircle } from "lucide-react";

interface PlanSelectorProps {
  activePlan: Plan | null;
  completedPlans: Plan[];
  selectedPlan: 'active' | 'history';
  onPlanChange: (key: 'active' | 'history') => void;
}

const PlanSelector: React.FC<PlanSelectorProps> = ({
  activePlan,
  completedPlans,
  selectedPlan,
  onPlanChange,
}) => {
  return (
    <Card className="bg-background shadow-lg rounded-lg">
      <CardBody className="p-0">
        <Tabs
          selectedKey={selectedPlan}
          onSelectionChange={(key) => onPlanChange(key as 'active' | 'history')}
          aria-label="Plan selection"
          classNames={{
            base: "w-full",
            tabList: "bg-content1 p-0 gap-0 rounded-t-lg border-b border-muted",
            cursor: "bg-primary text-white",
            tab: "max-w-fit px-8 h-14 transition-all duration-300 hover:bg-primary/80 focus:bg-primary",
            tabContent: "group-data-[selected=true]:text-primary"
          }}
        >
          <Tab
            key="active"
            title={
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  <span className="font-semibold text-foreground">Current Plan</span>
                  {activePlan && (
                    <Chip
                      size="sm"
                      color="success"
                      variant="flat"
                      classNames={{
                        content: "text-xs"
                      }}
                    >
                      {Math.round(calculatePlanProgress(activePlan))}% Complete
                    </Chip>
                  )}
                </div>
                {activePlan && (
                  <span className="text-xs text-foreground/70">
                    {format(new Date(activePlan.start), 'MMM dd')} - {format(new Date(activePlan.end), 'MMM dd')}
                  </span>
                )}
              </div>
            }
          />
          <Tab
            key="history"
            title={
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  <span className="font-semibold text-foreground">History</span>
                  {completedPlans.length > 0 && (
                    <Chip
                      size="sm"
                      color="success"
                      variant="flat"
                      classNames={{
                        content: "text-xs"
                      }}
                    >
                      {completedPlans.length} {completedPlans.length === 1 ? 'plan' : 'plans'}
                    </Chip>
                  )}
                </div>
                {completedPlans.length > 0 && (
                  <div className="flex items-center gap-1 text-success text-xs">
                    <CheckCircle size={12} />
                    <span>Completed Plans</span>
                  </div>
                )}
              </div>
            }
            isDisabled={completedPlans.length === 0}
          />
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default PlanSelector;
