
import { useState } from "react";
import { Modal, ModalContent, Button, Avatar, Tabs, Tab, Card } from "@nextui-org/react";
import { X, Info, ChefHat, Scale, Flame, Beef, Wheat, Droplet, Clock, ScrollText } from "lucide-react";
import type { Food, FoodReference } from "@/types/meal";

interface FoodDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: Food;
  foodRef: FoodReference;
  meal: string;
}

export const FoodDetailsModal: React.FC<FoodDetailsModalProps> = ({
  isOpen,
  onClose,
  food,
  foodRef,
  meal
}) => {
  const [selectedTab, setSelectedTab] = useState("overview");

  return (
    <Modal
      size="full"
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      className="bg-background/50 backdrop-blur-md"
      classNames={{
        base: "h-[100dvh] max-h-[100dvh]",
      }}
      scrollBehavior="inside"
    >
      <ModalContent>
        <div className="flex flex-col h-[100dvh]">
          <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md pb-2">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex gap-4">
                <Avatar
                  isBordered
                  color="secondary"
                  src={foodRef.image}
                  className="w-12 h-12"
                />
                <div>
                  <h2 className="text-lg font-semibold">{foodRef.title}</h2>
                  <p className="text-sm text-foreground/60">{meal}</p>
                </div>
              </div>
              <Button
                isIconOnly
                variant="light"
                onPress={onClose}
                className="min-w-unit-8 w-unit-8 h-unit-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="px-4 flex justify-center">
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key.toString())}
                color="secondary"
                variant="solid"
                radius="full"
                classNames={{
                  tabList: "bg-secondary-content/60",
                  cursor: "w-full",
                }}
              >
                <Tab
                  key="overview"
                  title={
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      <span className="text-sm">Overview</span>
                    </div>
                  }
                />
                <Tab
                  key="nutrition"
                  title={
                    <div className="flex items-center gap-2">
                      <ChefHat className="w-4 h-4" />
                      <span className="text-sm">Nutrition</span>
                    </div>
                  }
                />
              </Tabs>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {selectedTab === "overview" ? (
              <div className="space-y-6 p-4">
                <div className="relative bg-black">
                  <img
                    src={foodRef.image}
                    alt={foodRef.title}
                    className="w-full h-auto object-contain mx-auto"
                    style={{ maxHeight: "40vh" }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Card className="p-3 bg-secondary-content/5 border-none">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary-500/10">
                        <Scale className="w-4 h-4 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-xs text-foreground/60">Serving</p>
                        <p className="font-medium">{food.amount}g</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-3 bg-secondary-content/5 border-none">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-secondary-500/10">
                        <Flame className="w-4 h-4 text-secondary-500" />
                      </div>
                      <div>
                        <p className="text-xs text-foreground/60">Energy</p>
                        <p className="font-medium">{Math.round(food.nutrition.energy.value)} kcal</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-3 bg-secondary-content/5 border-none">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-success-500/10">
                        <Clock className="w-4 h-4 text-success-500" />
                      </div>
                      <div>
                        <p className="text-xs text-foreground/60">Meal</p>
                        <p className="font-medium">{meal}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-3 bg-secondary-content/5 border-none">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-warning-500/10">
                        <ScrollText className="w-4 h-4 text-warning-500" />
                      </div>
                      <div>
                        <p className="text-xs text-foreground/60">Nutrients</p>
                        <p className="font-medium">Details →</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {foodRef.description && (
                  <Card className="p-4 bg-secondary-content/5 border-none">
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {foodRef.description}
                    </p>
                  </Card>
                )}
              </div>
            ) : (
              <div className="space-y-6 p-4">
                <Card className="p-4 bg-secondary-content/5 border-none">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-primary-500" />
                    Per Serving ({food.amount}g)
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: Flame, label: "Calories", value: food.nutrition.energy.value, unit: "kcal", color: "primary" },
                      { icon: Beef, label: "Protein", value: food.nutrition.protein.value, unit: "g", color: "success" },
                      { icon: Wheat, label: "Carbohydrates", value: food.nutrition.carbs.value, unit: "g", color: "warning" },
                      { icon: Droplet, label: "Fat", value: food.nutrition.fat.value, unit: "g", color: "danger" }
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center pb-2 border-b border-content/10">
                        <div className="flex items-center gap-2">
                          <item.icon className={`w-4 h-4 text-${item.color}-500`} />
                          <span>{item.label}</span>
                        </div>
                        <span className="font-medium">
                          {Math.round(item.value)}{item.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4 bg-secondary-content/5 border-none">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-secondary-500" />
                    Per 100g
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: Flame, label: "Calories", value: foodRef.nutrition_per_100g.energy.value, unit: "kcal", color: "primary" },
                      { icon: Beef, label: "Protein", value: foodRef.nutrition_per_100g.protein.value, unit: "g", color: "success" },
                      { icon: Wheat, label: "Carbohydrates", value: foodRef.nutrition_per_100g.carbs.value, unit: "g", color: "warning" },
                      { icon: Droplet, label: "Fat", value: foodRef.nutrition_per_100g.fat.value, unit: "g", color: "danger" }
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center pb-2 border-b border-content/10">
                        <div className="flex items-center gap-2">
                          <item.icon className={`w-4 h-4 text-${item.color}-500`} />
                          <span>{item.label}</span>
                        </div>
                        <span className="font-medium">
                          {Math.round(item.value)}{item.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};