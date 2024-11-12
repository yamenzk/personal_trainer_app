import { Modal, ModalContent, ModalHeader, ModalBody, Card, CardBody, Button, Chip, Divider, Tabs, Tab } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBasket, Weight, Copy, X, Package, Carrot, Beef, Fish, Milk, Cookie, Apple, Egg, Grid, List, Share2 } from "lucide-react";
import { useState } from "react";
import { Food } from "@/types/meal";
import { Plan } from "@/types/plan";
import { cn } from "@/utils/cn";
import React from "react";

// Category icons mapping
const categoryIcons: Record<string, any> = {
  'Proteins': Beef,
  'Vegetables': Carrot,
  'Fruits': Apple,
  'Dairy': Milk,
  'Grains': Cookie,
  'Seafood': Fish,
  'Eggs': Egg,
  'Other': Package
};

interface GroceryListModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
  foodRefs: Record<string, any>;
  isPastPlan?: boolean;  // Add this prop
  weekNumber?: number;    // Add this prop
}

export const GroceryListModal: React.FC<GroceryListModalProps> = ({
  isOpen,
  onClose,
  plan,
  foodRefs,
  isPastPlan = false,
  weekNumber,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Changed default to 'grid'

  // Aggregate all foods for the week and group by type
  const groceryList = Object.values(plan.days).reduce((acc: Record<string, number>, day) => {
    day.foods?.forEach((food: Food) => {
      const foodRef = foodRefs[food.ref];
      const category = foodRef.category || 'Other';
      if (!acc[food.ref]) {
        acc[food.ref] = 0;
      }
      acc[food.ref] += parseFloat(food.amount);
    });
    return acc;
  }, {});

  // Group items by category
  const groupedItems = Object.entries(groceryList).reduce((acc: Record<string, any[]>, [ref, amount]) => {
    const foodRef = foodRefs[ref];
    const category = foodRef.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ ref, amount, ...foodRef });
    return acc;
  }, {});

  // Sort categories
  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return a.localeCompare(b);
  });

  const flattenedItems = Object.values(groupedItems)
    .flat()
    .sort((a, b) => a.title.localeCompare(b.title));

  const copyToClipboard = async () => {
    const text = sortedCategories
      .map(category => {
        const items = groupedItems[category]
          .map(item => `${item.title} - ${item.amount}g`)
          .join('\n');
        return `${category}:\n${items}`;
      })
      .join('\n\n');

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const text = sortedCategories
      .map(category => {
        const items = groupedItems[category]
          .map(item => `☐ ${item.title} - ${item.amount}g`)
          .join('\n');
        return `${category}:\n${items}`;
      })
      .join('\n\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Grocery List',
          text: text,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else if (navigator.clipboard) {
      await copyToClipboard();
    }
  };

  const GridItem = ({ item }: { item: any }) => (
    <div className="flex flex-col items-center text-center gap-2">
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-content3/20">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-foreground/20" />
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium line-clamp-1">{item.title}</p>
        <Chip
          size="sm"
          variant="flat"
          classNames={{
            base: "bg-secondary/10",
            content: "text-xs font-medium text-secondary"
          }}
        >
          {Math.round(item.amount)}g
        </Chip>
      </div>
    </div>
  );

  return (
    <Modal
      size="2xl"
      radius="lg"
      scrollBehavior="outside"
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      backdrop="blur"
      className="bg-white/50 dark:bg-black/50"
    >
      <ModalContent>
        <div className="p-6 space-y-6">
          {/* Enhanced Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShoppingBasket className="w-5 h-5 text-secondary" />
                <h3 className="text-xl font-bold">Grocery List</h3>
                {isPastPlan && (
                  <Chip
                    size="sm"
                    variant="flat"
                    color="primary"
                  >
                    Week {weekNumber}
                  </Chip>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-foreground/60">
                  {Object.values(groceryList).length} items needed
                </p>
                {isPastPlan && (
                  <span className="text-sm text-warning">
                    • Viewing past week
                  </span>
                )}
              </div>
            </div>
            <Button
              isIconOnly
              variant="light"
              onPress={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* View Switcher */}
          <Card className="bg-content2/50">
            <CardBody className="p-2">
              <Tabs
                color="secondary"
                variant="solid"
                radius="full"
                classNames={{
                  tabList: "bg-content-secondary/60",
                  cursor: "w-full",
                }}
                selectedKey={viewMode}
                onSelectionChange={(key) => setViewMode(key as 'grid' | 'list')}
              >
                
                <Tab
                  key="grid"
                  title={
                    <div className="flex items-center justify-center gap-2">
                      <Grid className="w-4 h-4" />
                      <span>All Items</span>
                    </div>
                  }
                />
                <Tab
                  key="list"
                  title={
                    <div className="flex items-center justify-center gap-2">
                      <List className="w-4 h-4" />
                      <span>By Category</span>
                    </div>
                  }
                />
              </Tabs>
            </CardBody>
          </Card>

          {/* Content */}
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4"
              >
                {flattenedItems.map((item) => (
                  <GridItem key={item.ref} item={item} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6"
              >
                {sortedCategories.map(category => (
                  <React.Fragment key={category}>
                    <div className="col-span-full flex items-center gap-2 mt-2 first:mt-0">
                      <div className="p-1.5 rounded-lg bg-secondary/10">
                        {React.createElement(categoryIcons[category] || categoryIcons.Other, {
                          className: "w-4 h-4 text-secondary"
                        })}
                      </div>
                      <h4 className="text-sm font-semibold">{category}</h4>
                    </div>
                    
                    {groupedItems[category].map((item) => (
                      <GridItem key={item.ref} item={item} />
                    ))}
                  </React.Fragment>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              className="flex-1"
              color="secondary"
              variant="solid"
              startContent={copied ? <X className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              onPress={copyToClipboard}
            >
              {copied ? "Copied!" : "Copy List"}
            </Button>
            <Button
              className="flex-1"
              color="primary"
              variant="bordered"
              startContent={<Share2 className="w-4 h-4" />}
              onPress={handleShare}
            >
              Share List
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
