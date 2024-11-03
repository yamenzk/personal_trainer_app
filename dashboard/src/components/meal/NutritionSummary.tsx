// src/components/meal/NutritionSummary.tsx
import { Card, CardBody, Progress } from "@nextui-org/react";
import { Flame, Beef, Wheat, Droplet } from "lucide-react";

interface NutritionSummaryProps {
  totals: {
    energy: { value: number; unit: string; };
    protein: { value: number; unit: string; };
    carbs: { value: number; unit: string; };
    fat: { value: number; unit: string; };
  };
  targets: {
    proteins: string;
    carbs: string;
    fats: string;
    energy: string;
    water: string;
  };
}

const NutritionSummary = ({ totals, targets }: NutritionSummaryProps) => {
  const calculatePercentage = (value: number, target: string) => {
    return Math.min(100, (value / parseFloat(target)) * 100);
  };

  return (
    <Card>
      <CardBody className="p-4 space-y-4">
        <h3 className="font-semibold">Daily Nutrition</h3>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-primary/10">
                  <Flame className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">Calories</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">{Math.round(totals.energy.value)}</span>
                <span className="text-foreground/60"> / {targets.energy} kcal</span>
              </div>
            </div>
            <Progress 
              value={calculatePercentage(totals.energy.value, targets.energy)} 
              color="primary"
              size="sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-success/10">
                  <Beef className="w-4 h-4 text-success" />
                </div>
                <span className="text-sm">Protein</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">{Math.round(totals.protein.value)}</span>
                <span className="text-foreground/60"> / {targets.proteins}g</span>
              </div>
            </div>
            <Progress 
              value={calculatePercentage(totals.protein.value, targets.proteins)} 
              color="success"
              size="sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-warning/10">
                  <Wheat className="w-4 h-4 text-warning" />
                </div>
                <span className="text-sm">Carbs</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">{Math.round(totals.carbs.value)}</span>
                <span className="text-foreground/60"> / {targets.carbs}g</span>
              </div>
            </div>
            <Progress 
              value={calculatePercentage(totals.carbs.value, targets.carbs)} 
              color="warning"
              size="sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-danger/10">
                  <Droplet className="w-4 h-4 text-danger" />
                </div>
                <span className="text-sm">Fat</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">{Math.round(totals.fat.value)}</span>
                <span className="text-foreground/60"> / {targets.fats}g</span>
              </div>
            </div>
            <Progress 
              value={calculatePercentage(totals.fat.value, targets.fats)} 
              color="danger"
              size="sm"
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default NutritionSummary;