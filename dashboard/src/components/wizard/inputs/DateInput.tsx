// src/components/wizard/inputs/DateInput.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, setYear, setMonth } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DateInputProps } from '@/types/types';

export const DateInput: React.FC<DateInputProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'calendar' | 'month' | 'year'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Get current year and calculate ranges
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const maxYear = currentYear - 14;

  const selectedDate = value ? new Date(value) : undefined;
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getYearRange = () => {
    const years: number[] = [];
    for (let year = maxYear; year >= minYear; year--) {
      years.push(year);
    }
    return years;
  };

  const handleDateSelect = (date: Date) => {
    onChange(format(date, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(setYear(currentMonth, year));
    setCurrentView('month');
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(setMonth(currentMonth, monthIndex));
    setCurrentView('calendar');
  };

  const renderYearGrid = () => (
    <div className="grid grid-cols-4 gap-2 p-4 h-[300px] overflow-y-auto">
      {getYearRange().map((year) => (
        <motion.button
          key={year}
          onClick={() => handleYearSelect(year)}
          className={cn(
            "p-2 rounded-lg text-sm font-medium",
            "transition-colors duration-200",
            currentMonth.getFullYear() === year
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {year}
        </motion.button>
      ))}
    </div>
  );

  const renderMonthGrid = () => (
    <div className="grid grid-cols-3 gap-2 p-4">
      {months.map((month, index) => (
        <motion.button
          key={month}
          onClick={() => handleMonthSelect(index)}
          className={cn(
            "p-2 rounded-lg text-sm font-medium",
            "transition-colors duration-200",
            currentMonth.getMonth() === index
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {month}
        </motion.button>
      ))}
    </div>
  );

  const renderDatePicker = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const dates: Date[] = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return (
      <div className="p-4">
        <div className="grid grid-cols-7 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {dates.map((date, i) => {
            const isSelected = selectedDate && 
              format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
            const isDisabled = date > new Date() || date < new Date(minYear, 0, 1);

            return (
              <motion.button
                key={i}
                onClick={() => !isDisabled && handleDateSelect(date)}
                disabled={isDisabled}
                className={cn(
                  "relative p-2 text-sm rounded-lg",
                  isSelected
                    ? "text-white"
                    : isCurrentMonth
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-400 dark:text-gray-500",
                  !isDisabled && "hover:bg-gray-100 dark:hover:bg-gray-700",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
                whileHover={!isDisabled ? { scale: 1.1 } : undefined}
                whileTap={!isDisabled ? { scale: 0.95 } : undefined}
              >
                {isSelected && (
                  <motion.div
                    layoutId="selectedDate"
                    className="absolute inset-0 bg-blue-500 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2 }}
                  />
                )}
                <span className={cn(
                  "relative",
                  isSelected && "text-white"
                )}>
                  {date.getDate()}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Date Input Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-3 rounded-xl text-left",
          "bg-white dark:bg-gray-800",
          "border-2 transition-colors duration-300",
          isOpen
            ? "border-blue-500"
            : "border-gray-200 dark:border-gray-700",
          "group hover:border-blue-200 dark:hover:border-blue-800"
        )}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-2 rounded-lg transition-colors",
            isOpen
              ? "bg-blue-100 dark:bg-blue-900/30"
              : "bg-gray-100 dark:bg-gray-700"
          )}>
            <CalendarIcon className={cn(
              "w-5 h-5",
              isOpen ? "text-blue-500" : "text-gray-500 dark:text-gray-400"
            )} />
          </div>
          
          <div className="flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Date of Birth
            </p>
            <p className="font-medium">
              {selectedDate 
                ? format(selectedDate, 'MMMM d, yyyy')
                : 'Select date'}
            </p>
          </div>
        </div>
      </motion.button>

      {/* Calendar Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={cn(
                "absolute top-full left-0 right-0 mt-2 z-50",
                "bg-white dark:bg-gray-800 rounded-xl",
                "border border-gray-200 dark:border-gray-700",
                "shadow-xl"
              )}
            >
              {/* Header */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between p-4">
                  <button
                    onClick={() => setCurrentView('year')}
                    className="text-sm font-medium hover:text-blue-500 transition-colors"
                  >
                    {currentMonth.getFullYear()}
                  </button>
                  <button
                    onClick={() => setCurrentView('month')}
                    className="text-sm font-medium hover:text-blue-500 transition-colors"
                  >
                    {format(currentMonth, 'MMMM')}
                  </button>
                  {currentView === 'calendar' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const newDate = new Date(currentMonth);
                          newDate.setMonth(newDate.getMonth() - 1);
                          setCurrentMonth(newDate);
                        }}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          const newDate = new Date(currentMonth);
                          newDate.setMonth(newDate.getMonth() + 1);
                          setCurrentMonth(newDate);
                        }}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              {currentView === 'year' && renderYearGrid()}
              {currentView === 'month' && renderMonthGrid()}
              {currentView === 'calendar' && renderDatePicker()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};