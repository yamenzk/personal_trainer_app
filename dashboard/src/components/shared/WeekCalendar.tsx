// src/components/shared/WeekCalendar.tsx
import { Card, CardBody, Button } from "@nextui-org/react";
import { Plan } from "../../types/plan";
import { format, addDays } from "date-fns";
import { CheckCircle2, Circle } from 'lucide-react';
import { isPlanDayCompleted } from '../../utils/api';

interface WeekCalendarProps {
  plan: Plan;
  selectedDay: number;
  onDaySelect: (day: number) => void;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  plan,
  selectedDay,
  onDaySelect,
}) => {
  const startDate = new Date(plan.start);
  const today = new Date();
  const currentDayNum = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Ensure currentDayNum is within 1-7 range
  const normalizedCurrentDay = ((currentDayNum - 1) % 7) + 1;

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 min-w-max p-1">
        {Array.from({ length: 7 }, (_, i) => i + 1).map((dayNum) => {
          const isSelected = dayNum === selectedDay;
          const isCompleted = isPlanDayCompleted(plan.days[`day_${dayNum}`]);
          const isCurrent = dayNum === normalizedCurrentDay;
          const date = addDays(startDate, dayNum - 1);

          return (
            <Button
              key={dayNum}
              className={`flex-1 min-w-[100px] h-24 p-0 relative transition-all duration-200 ${
                isSelected ? 'border-2 border-primary' : 'border border-transparent'
              } ${isCompleted ? 'bg-success/10' : 'bg-default-100'}`}
              onClick={() => onDaySelect(dayNum)}
            >
              <div className="flex flex-col items-center justify-center gap-1 w-full h-full">
                <span className="text-xs text-foreground/60">
                  {format(date, 'EEE')}
                </span>
                <span className={`text-xl font-semibold ${isCurrent ? 'text-primary' : 'text-default-800'}`}>
                  {format(date, 'd')}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <Circle className={`w-5 h-5 ${isCurrent ? 'text-primary' : 'text-default-300'}`} />
                )}
                {isCurrent && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default WeekCalendar;
