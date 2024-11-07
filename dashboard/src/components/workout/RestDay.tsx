import { Card } from "@nextui-org/react";
import { Battery, Heart, Activity, Coffee, Info } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export const RestDayCard: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Card
      className="p-6 space-y-4 mt-6 bg-background/1"
      style={{ border: '0' }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-primary-500/10">
          <Battery className="w-6 h-6 text-primary-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Rest Day</h3>
          <p className="text-foreground/60">Time to recover and recharge</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-content/5">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-danger-500" />
            <span className="text-sm font-medium">Recovery Focus</span>
          </div>
          <p className="text-sm text-foreground/60">
            Let your muscles repair and grow stronger
          </p>
        </div>

        <div className="p-4 rounded-xl bg-content/5">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-success-500" />
            <span className="text-sm font-medium">Light Activity</span>
          </div>
          <p className="text-sm text-foreground/60">
            Consider a light walk or gentle stretching
          </p>
        </div>

        <div className="p-4 rounded-xl bg-content/5">
          <div className="flex items-center gap-2 mb-2">
            <Coffee className="w-4 h-4 text-warning-500" />
            <span className="text-sm font-medium">Recovery Tips</span>
          </div>
          <p className="text-sm text-foreground/60">
            Stay hydrated and get quality sleep
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-500/5 border border-primary-500/10 mt-6">
        <Info className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/70">
          Rest days are crucial for preventing injury and ensuring optimal performance in your next workout.
          Use this time to focus on nutrition and mobility work.
        </p>
      </div>
    </Card>
  );
};
