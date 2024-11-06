import { useState } from 'react';
import { Input, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Calendar, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

// Extend dayjs with needed plugins
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

interface DateOfBirthStepProps {
  onComplete: (value: string) => void;
  isLoading?: boolean;
}

const DateOfBirthStep = ({ onComplete, isLoading = false }: DateOfBirthStepProps) => {
  const [displayDate, setDisplayDate] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Helper function to check if a date is valid
  const isValidDate = (dateStr: string): boolean => {
    // First check if it matches the format
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return false;

    const [day, month, year] = dateStr.split('/').map(Number);
    
    // Basic range checks
    if (year < 1900 || year > new Date().getFullYear()) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1) return false;

    // Check days in month (accounting for leap years)
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return false;

    // Check if date is not in future
    const inputDate = dayjs(dateStr, 'DD/MM/YYYY', true);
    if (inputDate.isAfter(dayjs())) return false;

    // Check age restrictions
    const age = dayjs().diff(inputDate, 'year');
    if (age < 16 || age > 100) return false;

    return true;
  };

  // Convert dd/mm/yyyy to yyyy-mm-dd
  const convertToISODate = (dateStr: string): string | null => {
    if (!dateStr || !isValidDate(dateStr)) return null;
    const parsed = dayjs(dateStr, 'DD/MM/YYYY', true);
    return parsed.format('YYYY-MM-DD');
  };

  const formatDateInput = (input: string): string => {
    // Remove any non-digit characters
    const numbers = input.replace(/\D/g, '');
    
    // Add slashes after day and month
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const getDateValidationError = (dateStr: string): string => {
    if (!dateStr) return '';
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return 'Please enter a complete date';

    const [day, month, year] = dateStr.split('/').map(Number);

    if (month < 1 || month > 12) return 'Month must be between 1 and 12';
    
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
      return `Invalid day for ${dayjs().month(month - 1).format('MMMM')}`;
    }

    if (year < 1900) return 'Year must be after 1900';
    if (year > new Date().getFullYear()) return 'Date cannot be in the future';

    const inputDate = dayjs(dateStr, 'DD/MM/YYYY', true);
    if (inputDate.isAfter(dayjs())) return 'Date cannot be in the future';

    const age = dayjs().diff(inputDate, 'year');
    if (age < 16) return 'You must be at least 16 years old';
    if (age > 100) return 'Please enter a valid age below 100';

    return '';
  };

  const handleDateChange = (value: string) => {
    const formattedValue = formatDateInput(value);
    setDisplayDate(formattedValue);
    
    // Only validate if we have a complete date
    if (formattedValue.length === 10) {
      const validationError = getDateValidationError(formattedValue);
      setError(validationError);
      setIsValid(!validationError);
    } else {
      setError('');
      setIsValid(false);
    }
  };

  const handleSubmit = () => {
    if (!displayDate) {
      setError('Please enter your date of birth');
      return;
    }

    const validationError = getDateValidationError(displayDate);
    if (validationError) {
      setError(validationError);
      return;
    }

    const isoDate = convertToISODate(displayDate);
    if (!isoDate) {
      setError('Please enter a valid date in DD/MM/YYYY format');
      return;
    }

    onComplete(isoDate);
  };

  const getAge = (dateStr: string): number | null => {
    if (!isValidDate(dateStr)) return null;
    return dayjs().diff(dayjs(dateStr, 'DD/MM/YYYY'), 'year');
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Input
          type="text"
          label="Date of Birth"
          variant="underlined"
          color="primary"
          value={displayDate}
          onValueChange={handleDateChange}
          maxLength={10}
          errorMessage={error}
          isInvalid={!!error}
        />
        <p className="text-sm text-foreground/50 pl-1">
          Enter your date of birth in the format: 31/12/1990
        </p>

        {/* Date Preview */}
        {displayDate && isValid && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-primary-500/5 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary-500" />
              <span className="font-medium">
                {dayjs(displayDate, 'DD/MM/YYYY').format('DD MMMM YYYY')}
              </span>
            </div>
            <span className="text-sm text-foreground/60">
              Age: {getAge(displayDate)} years
            </span>
          </motion.div>
        )}

        {/* Info Box */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-500/5">
          <AlertCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/70">
            Your age helps me create a safe and effective fitness program tailored to your life stage and capabilities.
          </p>
        </div>
      </div>

      <Button
        color="primary"
        size="lg"
        className="w-full bg-gradient-to-r from-primary-500 to-secondary-500"
        onPress={handleSubmit}
        isLoading={isLoading}
      >
        Continue
      </Button>
    </div>
  );
};

export default DateOfBirthStep;