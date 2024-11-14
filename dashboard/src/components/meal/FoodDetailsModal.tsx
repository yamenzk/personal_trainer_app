import { useState, useEffect, useMemo, useRef } from "react";
import {
  Modal,
  ModalContent,
  Button,
  Tabs,
  Tab,
  Card,
  Avatar,
  CardBody,
  Switch,
  Tooltip,
} from "@nextui-org/react";
import {
  Info,
  ChefHat,
  Scale,
  Flame,
  Beef,
  Wheat,
  Droplet,
  Clock,
  ChevronDown,
  Coffee,
  FlaskConical,
  Loader2,
  Pill,
  ScrollText,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { MicrosResponse, FoodDetailsModalProps } from "@/types";
import { useClientStore } from "@/stores/clientStore";
import React from "react";

// Add categories for grouping micronutrients
const microCategories = {
  vitamins: [
    "Vitamin A",
    "Vitamin C",
    "Vitamin D",
    "Vitamin E",
    "Vitamin K",
    "Thiamin",
    "Riboflavin",
    "Niacin",
    "Vitamin B-6",
    "Vitamin B-12",
    "Folate",
    "Pantothenic acid",
  ],
  minerals: [
    "Calcium",
    "Iron",
    "Magnesium",
    "Phosphorus",
    "Potassium",
    "Sodium",
    "Zinc",
    "Copper",
    "Manganese",
    "Selenium",
  ],
  aminoAcids: [
    "Tryptophan",
    "Threonine",
    "Isoleucine",
    "Leucine",
    "Lysine",
    "Methionine",
    "Cystine",
    "Phenylalanine",
    "Tyrosine",
    "Valine",
    "Arginine",
    "Histidine",
    "Alanine",
    "Aspartic acid",
    "Glutamic acid",
    "Glycine",
    "Proline",
    "Serine",
  ],
  fattyAcids: [
    "Fatty acids, total saturated",
    "Fatty acids, total monounsaturated",
    "Fatty acids, total polyunsaturated",
  ],
};

export const FoodDetailsModal: React.FC<FoodDetailsModalProps> = React.memo(({
  isOpen,
  onClose,
  food,
  foodRef,
  meal,
}) => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [micros, setMicros] = useState<Record<string, number> | null>(null);
  const [isLoadingMicros, setIsLoadingMicros] = useState(false);
  const [showPer100g, setShowPer100g] = useState(false);
  const [expandedNames, setExpandedNames] = useState<Record<string, boolean>>(
    {}
  );
  const { mediaCache } = useClientStore();
  const imageRef = useRef<HTMLImageElement>(null);

  // Use cached image if available
  const imageUrl = useMemo(() => {
    return mediaCache.images[foodRef.image] || foodRef.image;
  }, [foodRef.image, mediaCache.images]);

  // Cleanup when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (imageRef.current) {
        imageRef.current.src = '';
        imageRef.current.removeAttribute('src');
        URL.revokeObjectURL(imageRef.current.src);
      }
      setSelectedTab("overview");
      setMicros(null);
      setIsLoadingMicros(false);
    }
  }, [isOpen]);

  // Preload image when modal opens
  useEffect(() => {
    if (isOpen && imageUrl && !mediaCache.images[imageUrl]) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        useClientStore.setState(state => ({
          ...state,
          mediaCache: {
            ...state.mediaCache,
            images: {
              ...state.mediaCache.images,
              [imageUrl]: imageUrl
            }
          }
        }));
      };
    }
  }, [isOpen, imageUrl, mediaCache.images]);

  // Fetch micronutrients data when tab is selected
  useEffect(() => {
    if (selectedTab === "micros" && !micros && food.ref) {
      const fetchMicros = async () => {
        setIsLoadingMicros(true);
        try {
          const response = await fetch(
            `/api/method/personal_trainer_app.api.get_micros?fdcid=${food.ref}`
          );
          const data: MicrosResponse = await response.json();
          setMicros(data.message.micros);
        } catch (error) {
          console.error("Error fetching micronutrients:", error);
        } finally {
          setIsLoadingMicros(false);
        }
      };
      fetchMicros();
    }
  }, [selectedTab, food.ref, micros]);

  // Add function to calculate actual serving values
  const calculateServingValue = (value: number) => {
    if (showPer100g) return value;
    return (value * Number(food.amount)) / 100;
  };

  // Add function to toggle name expansion
  const toggleNameExpansion = (nutrientKey: string) => {
    setExpandedNames((prev) => ({
      ...prev,
      [nutrientKey]: !prev[nutrientKey],
    }));
  };

  return (
    <Modal
      size="full"
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      className="bg-background/30 backdrop-blur-xl"
      classNames={{
        base: "h-[100dvh] max-h-[100dvh]",
      }}
      scrollBehavior="inside"
      motionProps={{
        variants: {
          enter: {
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        <div className="flex flex-col h-[100dvh]">
          <motion.div
            className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-divider"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Avatar
                    isBordered
                    color="secondary"
                    src={imageUrl}
                    className="w-14 h-14"
                    classNames={{
                      img: "object-cover opacity-90 hover:opacity-100 transition-opacity",
                      base: "ring-2 ring-offset-2 ring-offset-background",
                    }}
                  />
                </motion.div>
                <div>
                  <motion.h2
                    className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {foodRef.title}
                  </motion.h2>
                  <motion.p
                    className="text-sm text-foreground/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {meal}
                  </motion.p>
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

            <div className="px-6 pb-4">
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key.toString())}
                color="secondary"
                variant="solid"
                radius="full"
                classNames={{
                  tabList: "bg-content2/20 p-0.5 shadow-sm",
                  cursor: "bg-secondary shadow-md",
                  tab: "h-8 px-4 data-[selected=true]:text-white",
                  tabContent: "group-data-[selected=true]:text-white",
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
                <Tab
                  key="micros"
                  title={
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4" />
                      <span className="text-sm">Micros</span>
                    </div>
                  }
                />
              </Tabs>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab}
              className="flex-1 overflow-y-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {selectedTab === "overview" ? (
                <div className="space-y-6 p-6">
                  <Card className="border-none overflow-hidden bg-gradient-to-b from-content2/50 to-content2/100">
                    <div className="relative aspect-video">
                      <img
                        src={imageUrl}
                        alt={foodRef.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  </Card>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      {
                        icon: Scale,
                        label: "Serving",
                        value: `${food.amount}g`,
                        color: "primary",
                      },
                      {
                        icon: Flame,
                        label: "Energy",
                        value: `${Math.round(
                          food.nutrition.energy.value
                        )} kcal`,
                        color: "secondary",
                      },
                      {
                        icon: Clock,
                        label: "Meal",
                        value: meal,
                        color: "success",
                      },
                      {
                        icon: ScrollText,
                        label: "Nutrients",
                        value: "Details →",
                        color: "warning",
                      },
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <Card
                          className={cn(
                            "p-4 border-none",
                            `bg-${stat.color}/5 hover:bg-${stat.color}/10 transition-colors`
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "p-2 rounded-lg",
                                `bg-${stat.color}/10`
                              )}
                            >
                              <stat.icon
                                className={`w-4 h-4 text-${stat.color}`}
                              />
                            </div>
                            <div>
                              <p className="text-xs text-foreground/60">
                                {stat.label}
                              </p>
                              <p className="font-semibold">{stat.value}</p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {foodRef.description && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Card className="p-4 bg-gradient-to-br from-content2/50 to-content2/100 border-none">
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {foodRef.description}
                        </p>
                      </Card>
                    </motion.div>
                  )}
                </div>
              ) : selectedTab === "nutrition" ? (
                <div className="space-y-6 p-6">
                  {/* Per Serving Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="bg-gradient-to-br from-content2/50 to-content2/100 border-none overflow-hidden">
                      <CardBody className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 rounded-xl bg-primary/10">
                            <ChefHat className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">
                              Per Serving
                            </h3>
                            <p className="text-sm text-foreground/60">
                              {food.amount}g portion
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {[
                            {
                              icon: Flame,
                              label: "Calories",
                              value: food.nutrition.energy.value,
                              unit: "kcal",
                              color: "primary",
                              percentage:
                                (food.nutrition.energy.value / 2000) * 100,
                            },
                            {
                              icon: Beef,
                              label: "Protein",
                              value: food.nutrition.protein.value,
                              unit: "g",
                              color: "success",
                              percentage:
                                (food.nutrition.protein.value / 50) * 100,
                            },
                            {
                              icon: Wheat,
                              label: "Carbs",
                              value: food.nutrition.carbs.value,
                              unit: "g",
                              color: "warning",
                              percentage:
                                (food.nutrition.carbs.value / 275) * 100,
                            },
                            {
                              icon: Droplet,
                              label: "Fat",
                              value: food.nutrition.fat.value,
                              unit: "g",
                              color: "danger",
                              percentage: (food.nutrition.fat.value / 55) * 100,
                            },
                          ].map((item, index) => (
                            <motion.div
                              key={item.label}
                              initial={{
                                opacity: 0,
                                x: index % 2 === 0 ? -20 : 20,
                              }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + index * 0.1 }}
                              className="relative"
                            >
                              <div
                                className={cn(
                                  "p-4 rounded-xl",
                                  `bg-${item.color}/5 hover:bg-${item.color}/10 transition-colors`
                                )}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <item.icon
                                    className={`w-4 h-4 text-${item.color}`}
                                  />
                                  <span className="text-sm font-medium">
                                    {item.label}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xl font-bold">
                                    {Math.round(item.value)}
                                  </span>
                                  <span className="text-sm text-foreground/60 ml-1">
                                    {item.unit}
                                  </span>
                                </div>
                                <div className="mt-2">
                                  <div className="h-1.5 rounded-full bg-content3/20 overflow-hidden">
                                    <motion.div
                                      className={`h-full rounded-full bg-${item.color}`}
                                      initial={{ width: 0 }}
                                      animate={{
                                        width: `${Math.min(
                                          item.percentage,
                                          100
                                        )}%`,
                                      }}
                                      transition={{
                                        duration: 0.5,
                                        delay: 0.3 + index * 0.1,
                                      }}
                                    />
                                  </div>
                                  <p className="text-xs text-foreground/60 mt-1">
                                    {Math.round(item.percentage)}% of daily
                                    value
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>

                  {/* Per 100g Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="bg-gradient-to-br from-content2/50 to-content2/100 border-none">
                      <CardBody className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 rounded-xl bg-secondary/10">
                            <Scale className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">Per 100g</h3>
                            <p className="text-sm text-foreground/60">
                              Standard measure
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {[
                            {
                              icon: Flame,
                              label: "Calories",
                              value: foodRef.nutrition_per_100g.energy.value,
                              unit: "kcal",
                              color: "primary",
                            },
                            {
                              icon: Beef,
                              label: "Protein",
                              value: foodRef.nutrition_per_100g.protein.value,
                              unit: "g",
                              color: "success",
                            },
                            {
                              icon: Wheat,
                              label: "Carbs",
                              value: foodRef.nutrition_per_100g.carbs.value,
                              unit: "g",
                              color: "warning",
                            },
                            {
                              icon: Droplet,
                              label: "Fat",
                              value: foodRef.nutrition_per_100g.fat.value,
                              unit: "g",
                              color: "danger",
                            },
                          ].map((item, index) => (
                            <motion.div
                              key={item.label}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                            >
                              <div
                                className={cn(
                                  "p-3 rounded-lg",
                                  `bg-${item.color}/5 hover:bg-${item.color}/10 transition-colors`
                                )}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <item.icon
                                    className={`w-3.5 h-3.5 text-${item.color}`}
                                  />
                                  <span className="text-xs font-medium">
                                    {item.label}
                                  </span>
                                </div>
                                <p className="text-lg font-semibold">
                                  {Math.round(item.value)}
                                  <span className="text-xs font-normal text-foreground/60 ml-1">
                                    {item.unit}
                                  </span>
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-6 p-6">
                  {isLoadingMicros ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                    </div>
                  ) : micros ? (
                    <div className="space-y-6">
                      {/* Add serving switch */}
                      <Card className="bg-gradient-to-br from-content2/50 to-content2/100 border-none">
                        <CardBody className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-secondary/10">
                                {showPer100g ? (
                                  <FlaskConical className="w-4 h-4 text-secondary" />
                                ) : (
                                  <Coffee className="w-4 h-4 text-secondary" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  Showing values per
                                </p>
                                <p className="text-xs text-foreground/60">
                                  {showPer100g
                                    ? "100g standard measure"
                                    : `${food.amount}g serving`}
                                </p>
                              </div>
                            </div>
                            <Switch
                              size="sm"
                              color="secondary"
                              isSelected={showPer100g}
                              onValueChange={setShowPer100g}
                            />
                          </div>
                        </CardBody>
                      </Card>

                      {Object.entries(microCategories).map(
                        ([category, nutrients]) => {
                          const availableNutrients = nutrients.filter(
                            (nutrient) =>
                              Object.keys(micros).some((key) =>
                                key
                                  .toLowerCase()
                                  .includes(nutrient.toLowerCase())
                              )
                          );

                          if (availableNutrients.length === 0) return null;

                          return (
                            <motion.div
                              key={category}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Card className="bg-gradient-to-br from-content2/50 to-content2/100 border-none">
                                <CardBody className="p-6">
                                  <h3 className="text-lg font-semibold mb-4 capitalize flex items-center gap-2">
                                    <span>
                                      {category
                                        .replace(/([A-Z])/g, " $1")
                                        .trim()}
                                    </span>
                                    <span className="text-xs text-foreground/60 font-normal">
                                      ({availableNutrients.length} items)
                                    </span>
                                  </h3>
                                  <div className="grid grid-cols-3 gap-3">
                                    {availableNutrients.map(
                                      (nutrient, nutrientIndex) => {
                                        const microValue = Object.entries(
                                          micros
                                        ).find(([key]) =>
                                          key
                                            .toLowerCase()
                                            .includes(nutrient.toLowerCase())
                                        );

                                        if (!microValue) return null;

                                        // Generate a unique key using category, index, and API key
                                        const uniqueKey = `${category}-${nutrientIndex}-${microValue[0]}`;

                                        const isVitamin = microValue[0]
                                          .toLowerCase()
                                          .includes("vitamin");
                                        const unit = isVitamin ? "mcg" : "mg";
                                        const value = calculateServingValue(
                                          microValue[1]
                                        );
                                        const isExpanded =
                                          expandedNames[uniqueKey];

                                        return (
                                          <motion.div
                                            key={uniqueKey}
                                            className={cn(
                                              "p-3 rounded-lg transition-all duration-200",
                                              "bg-content3/5 hover:bg-content3/10",
                                              "border border-content3/10 hover:border-content3/20"
                                            )}
                                            whileHover={{ scale: 1.02 }}
                                          >
                                            <Tooltip
                                              content={nutrient}
                                              placement="top"
                                              delay={200}
                                              closeDelay={0}
                                              classNames={{
                                                base: "bg-content3/90 backdrop-blur-lg",
                                                content: "text-xs",
                                              }}
                                            >
                                              <button
                                                onClick={() =>
                                                  toggleNameExpansion(uniqueKey)
                                                }
                                                className="w-full text-left group"
                                              >
                                                <div className="flex items-center justify-between gap-1">
                                                  <p
                                                    className={cn(
                                                      "text-sm font-medium text-foreground/80 transition-all duration-200",
                                                      isExpanded
                                                        ? ""
                                                        : "truncate"
                                                    )}
                                                  >
                                                    {nutrient}
                                                  </p>
                                                  <ChevronDown
                                                    className={cn(
                                                      "w-3 h-3 shrink-0 text-foreground/50 transition-transform duration-200 opacity-0 group-hover:opacity-100",
                                                      isExpanded && "rotate-180"
                                                    )}
                                                  />
                                                </div>
                                              </button>
                                            </Tooltip>

                                            <div className="flex items-baseline gap-1 mt-1">
                                              <span className="text-base font-semibold">
                                                {Number(value) < 1
                                                  ? value.toFixed(3)
                                                  : value.toFixed(1)}
                                              </span>
                                              <span className="text-xs text-foreground/60">
                                                {unit}
                                              </span>
                                            </div>
                                            <div className="h-1 w-full rounded-full bg-content3/10 mt-2">
                                              <motion.div
                                                className={cn(
                                                  "h-full rounded-full",
                                                  isVitamin
                                                    ? "bg-secondary"
                                                    : "bg-primary"
                                                )}
                                                initial={{ width: 0 }}
                                                animate={{
                                                  width: `${Math.min(
                                                    (value /
                                                      (showPer100g
                                                        ? 100
                                                        : 50)) *
                                                      100,
                                                    100
                                                  )}%`,
                                                }}
                                                transition={{ duration: 0.5 }}
                                              />
                                            </div>
                                          </motion.div>
                                        );
                                      }
                                    )}
                                  </div>
                                </CardBody>
                              </Card>
                            </motion.div>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-foreground/60">
                      No micronutrient data available
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </ModalContent>
    </Modal>
  );
});
