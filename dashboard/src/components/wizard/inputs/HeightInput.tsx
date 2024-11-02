// src/components/wizard/inputs/HeightInput.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HeightInputProps } from '@/types/types';

const commonHeights = {
  cm: [150, 160, 170, 180, 190, 200],
  ft: [
    { ft: 5, in: 0 },
    { ft: 5, in: 4 },
    { ft: 5, in: 8 },
    { ft: 6, in: 0 },
    { ft: 6, in: 4 },
    { ft: 6, in: 8 }
  ]
};

export const HeightInput: React.FC<HeightInputProps> = ({ value, onChange }) => {
  const [unit, setUnit] = useState<'cm' | 'ft'>('cm');
  const [feet, setFeet] = useState(0);
  const [inches, setInches] = useState(0);

  useEffect(() => {
    if (unit === 'ft' && value) {
      const totalInches = value / 2.54;
      setFeet(Math.floor(totalInches / 12));
      setInches(Math.round(totalInches % 12));
    }
  }, [unit, value]);

  const handleUnitChange = (newUnit: 'cm' | 'ft') => {
    setUnit(newUnit);
    if (newUnit === 'cm' && feet && inches) {
      onChange(Math.round((feet * 30.48) + (inches * 2.54)));
    }
  };

  const increment = () => {
    if (unit === 'cm' && value) {
      onChange(value + 1);
    } else if (unit === 'ft') {
      if (inches === 11) {
        setFeet(feet + 1);
        setInches(0);
      } else {
        setInches(inches + 1);
      }
      onChange(Math.round((feet * 30.48) + ((inches + 1) * 2.54)));
    }
  };

  const decrement = () => {
    if (unit === 'cm' && value && value > 0) {
      onChange(value - 1);
    } else if (unit === 'ft') {
      if (inches === 0) {
        setFeet(Math.max(0, feet - 1));
        setInches(11);
      } else {
        setInches(inches - 1);
      }
      const newInches = inches === 0 ? 11 : inches - 1;
      const newFeet = inches === 0 ? Math.max(0, feet - 1) : feet;
      onChange(Math.round((newFeet * 30.48) + (newInches * 2.54)));
    }
  };

  return (
    <div className="space-y-8">
      {/* Current Value Display */}
      <div className="relative flex justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            "relative w-32 h-32 rounded-full",
            "bg-gradient-to-br from-blue-500 to-purple-500"
          )}
        >
          <div className="absolute inset-1 rounded-full bg-white dark:bg-gray-900" />
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <motion.span 
              className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
              key={unit === 'cm' ? value : `${feet}'${inches}`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {unit === 'cm' 
                ? value 
                : `${feet}'${inches}"`
              }
            </motion.span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {unit === 'cm' ? 'centimeters' : 'feet & inches'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Unit Toggle */}
      <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {(['cm', 'ft'] as const).map((unitOption) => (
          <motion.button
            key={unitOption}
            onClick={() => handleUnitChange(unitOption)}
            className={cn(
              "flex-1 py-3 text-sm font-medium rounded-lg",
              "relative overflow-hidden",
              "transition-colors duration-200"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {unit === unitOption && (
              <motion.div
                layoutId="unitBackground"
                className="absolute inset-0 bg-white dark:bg-gray-700"
                transition={{ type: "spring", bounce: 0.2 }}
              />
            )}
            <span className={cn(
              "relative",
              unit === unitOption
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400"
            )}>
              {unitOption.toUpperCase()}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={decrement}
          className={cn(
            "p-3 rounded-xl",
            "bg-gray-100 dark:bg-gray-800",
            "text-gray-500 dark:text-gray-400",
            "hover:bg-gray-200 dark:hover:bg-gray-700",
            "transition-colors"
          )}
        >
          <Minus className="w-5 h-5" />
        </motion.button>

        <div className="w-24 text-center">
          <span className="text-lg font-medium">
            {unit === 'cm' 
              ? `${value || 0} cm`
              : `${feet}'${inches}"`
            }
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={increment}
          className={cn(
            "p-3 rounded-xl",
            "bg-gray-100 dark:bg-gray-800",
            "text-gray-500 dark:text-gray-400",
            "hover:bg-gray-200 dark:hover:bg-gray-700",
            "transition-colors"
          )}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Quick Select */}
      <div className="grid grid-cols-3 gap-3">
        {(unit === 'cm' ? commonHeights.cm : commonHeights.ft).map((height, index) => (
          <motion.button
            key={index}
            onClick={() => {
              if (typeof height === 'number') {
                onChange(height);
              } else {
                onChange(Math.round((height.ft * 30.48) + (height.in * 2.54)));
                setFeet(height.ft);
                setInches(height.in);
              }
            }}
            className={cn(
              "p-3 rounded-xl text-center",
              "border-2 transition-all duration-200",
              unit === 'cm' && value === height ||
              unit === 'ft' && typeof height !== 'number' && feet === height.ft && inches === height.in
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700",
              "hover:border-blue-200 dark:hover:border-blue-800"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg font-medium">
              {typeof height === 'number' 
                ? `${height}cm`
                : `${height.ft}'${height.in}"`
              }
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};