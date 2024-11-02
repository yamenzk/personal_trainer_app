// src/components/layout/PageHeader.tsx
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { PlanSelectorModal } from '@/components/plans/PlanSelectorModal';
import type { Plan } from '@/types/api';

interface PageHeaderProps {
  title: string;
  selectedPlan: Plan;
  plans: Plan[];
  onPlanChange: (planId: string) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  selectedPlan,
  plans,
  onPlanChange,
}) => {
  const [isPlanSelectorOpen, setIsPlanSelectorOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">{title}</h1>
      
      <button
        onClick={() => setIsPlanSelectorOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm">
          {new Date(selectedPlan.start).toLocaleDateString()} - {new Date(selectedPlan.end).toLocaleDateString()}
        </span>
      </button>

      <PlanSelectorModal
        isOpen={isPlanSelectorOpen}
        onClose={() => setIsPlanSelectorOpen(false)}
        plans={plans}
        selectedPlanId={selectedPlan.plan_name}
        onPlanSelect={onPlanChange}
      />
    </div>
  );
};