// src/components/plans/PlanSelectorModal.tsx
import React from 'react';
import { Calendar, Check, ChevronRight } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import type { Plan } from '@/types/api';

interface PlanSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: Plan[];
  selectedPlanId: string;
  onPlanSelect: (planId: string) => void;
}

export const PlanSelectorModal: React.FC<PlanSelectorModalProps> = ({
  isOpen,
  onClose,
  plans,
  selectedPlanId,
  onPlanSelect,
}) => {
  const sortedPlans = [...plans].sort((a, b) => {
    if (a.status === 'Active') return -1;
    if (b.status === 'Active') return 1;
    return new Date(b.start).getTime() - new Date(a.start).getTime();
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Select Plan</h2>
        
        <div className="space-y-2">
          {sortedPlans.map((plan) => (
            <button
              key={plan.plan_name}
              onClick={() => {
                onPlanSelect(plan.plan_name);
                onClose();
              }}
              className="w-full flex items-center p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative"
            >
              {/* Selection indicator */}
              {plan.plan_name === selectedPlanId && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl" />
              )}
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{plan.plan_name}</span>
                  {plan.status === 'Active' && (
                    <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(plan.start).toLocaleDateString()} - {new Date(plan.end).toLocaleDateString()}
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3 text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Equipment</span>
                    <p className="font-medium mt-0.5">{plan.config.equipment}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Workouts</span>
                    <p className="font-medium mt-0.5">{plan.config.weekly_workouts}/week</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Goal</span>
                    <p className="font-medium mt-0.5">{plan.config.goal}</p>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};