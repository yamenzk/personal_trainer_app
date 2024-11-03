// src/components/meal/FoodCard.tsx
import { Card, CardBody, Image, Progress } from "@nextui-org/react";
import { FoodReference } from '../../types/meal';

interface FoodCardProps {
  foodRef: string;
  amount: string;
  meal: string;
  nutrition: {
    energy: { value: number; unit: string; };
    protein: { value: number; unit: string; };
    carbs: { value: number; unit: string; };
    fat: { value: number; unit: string; };
  };
  details: FoodReference;
  dailyTargets: {
    proteins: string;
    carbs: string;
    fats: string;
    energy: string;
  };
}

const FoodCard = ({ 
  foodRef, 
  amount, 
  meal, 
  nutrition, 
  details,
  dailyTargets 
}: FoodCardProps) => {
  const calculatePercentage = (value: number, target: string) => {
    return Math.min(100, (value / parseFloat(target)) * 100);
  };

  return (
    <Card>
      <CardBody className="p-4">
        <div className="flex gap-4">
          <Image
            src={details.image}
            alt={details.title}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-semibold">{details.title}</h3>
              <p className="text-sm text-foreground/60">{meal}</p>
            </div>

            <div className="text-sm">
              <span className="font-medium">{amount}g</span>
              <span className="text-foreground/60"> • </span>
              <span className="text-foreground/60">{nutrition.energy.value} kcal</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Protein</span>
                  <span>{nutrition.protein.value}g</span>
                </div>
                <Progress 
                  value={calculatePercentage(nutrition.protein.value, dailyTargets.proteins)} 
                  color="primary" 
                  size="sm"
                  className="h-1"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Carbs</span>
                  <span>{nutrition.carbs.value}g</span>
                </div>
                <Progress 
                  value={calculatePercentage(nutrition.carbs.value, dailyTargets.carbs)} 
                  color="warning" 
                  size="sm"
                  className="h-1"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Fat</span>
                  <span>{nutrition.fat.value}g</span>
                </div>
                <Progress 
                  value={calculatePercentage(nutrition.fat.value, dailyTargets.fats)} 
                  color="danger" 
                  size="sm"
                  className="h-1"
                />
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default FoodCard;