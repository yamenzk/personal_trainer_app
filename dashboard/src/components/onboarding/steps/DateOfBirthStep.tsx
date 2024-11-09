// src/components/onboarding/steps/DateOfBirthStep.tsx
import { useState, useEffect } from 'react';
import { Input, Card, CardBody } from "@nextui-org/react";
import { Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useStepValidation } from '@/hooks/useStepValidation';

// Extend dayjs with needed plugins
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

interface DateOfBirthStepProps {
  onComplete: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialValue?: string;
}

const DateOfBirthStep = ({ onComplete, onValidationChange, initialValue = '' }: DateOfBirthStepProps) => {
  const [displayDate, setDisplayDate] = useState(initialValue ? dayjs(initialValue).format('DD/MM/YYYY') : '');
  const [error, setError] = useState('');
  const { selected, handleSelect } = useStepValidation<string>(initialValue, onComplete, onValidationChange);

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

  const formatDateInput = (input: string): string => {
    // Remove any non-digit characters
    const numbers = input.replace(/\D/g, '');
    
    // Add slashes after day and month
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const getDateValidationError = (dateStr: string): string => {
    if (!dateStr) return 'Please enter your date of birth';
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return 'Please enter a complete date';

    const [day, month, year] = dateStr.split('/').map(Number);

    if (month < 1 || month > 12) return 'Month must be between 1 and 12';
    
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
      return `Invalid day for ${dayjs().month(month - 1).format('MMMM')}`;
    }

    if (year < 1900) return 'Year must be after 1900';
    if (year > new Date().getFullYear()) return 'Date cannot be in the future.';

    const inputDate = dayjs(dateStr, 'DD/MM/YYYY', true);
    if (inputDate.isAfter(dayjs())) return 'Date cannot be in the future.';

    const age = dayjs().diff(inputDate, 'year');
    if (age < 18) return 'You must be at least 18 years old.';
    if (age > 100) return 'Please enter a valid age.';

    return '';
  };

  const handleDateChange = (value: string) => {
    const formattedValue = formatDateInput(value);
    setDisplayDate(formattedValue);
    
    if (formattedValue.length === 10) {
      const validationError = getDateValidationError(formattedValue);
      setError(validationError);
      if (!validationError) {
        const isoDate = dayjs(formattedValue, 'DD/MM/YYYY').format('YYYY-MM-DD');
        handleSelect(isoDate);
      }
    } else {
      setError('');
    }
  };

  const getAge = (dateStr: string): number | null => {
    if (!isValidDate(dateStr)) return null;
    return dayjs().diff(dayjs(dateStr, 'DD/MM/YYYY'), 'year');
  };

  // Initial validation on mount if there's an initial value
  useEffect(() => {
    if (initialValue) {
      const formattedDate = dayjs(initialValue).format('DD/MM/YYYY');
      handleDateChange(formattedDate);
    }
  }, [initialValue]);

  return (
    <div className="space-y-6">
      {/* Date Preview */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center">
          <Calendar className="w-8 h-8 text-primary-500" />
        </div>
        {displayDate && isValidDate(displayDate) && (
          <div className="text-center">
            <p className="text-xl font-semibold">
              {dayjs(displayDate, 'DD/MM/YYYY').format('DD MMMM YYYY')}
            </p>
            <p className="text-sm text-foreground/60">
              Age: {getAge(displayDate)} years
            </p>
          </div>
        )}
      </div>

      {/* Date Input */}
      <Input
        type="text"
        label="Date of Birth"
        value={displayDate}
        onValueChange={handleDateChange}
        maxLength={10}
        errorMessage={error}
        isInvalid={!!error}
        variant="bordered"
        color="primary"
        radius="lg"
        classNames={{
          input: "text-base",
          inputWrapper: "border-2",
        }}
        description="Enter your date of birth (e.g., 31/12/1990)"
        autoFocus
      />

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-content2">
          <CardBody className="p-4 space-y-2">
            <h4 className="text-sm font-semibold">Why I need this</h4>
            <p className="text-sm text-foreground/70">
              Your age helps me create a safe and effective fitness program tailored to your life stage and capabilities.
            </p>
          </CardBody>
        </Card>

        <Card className="bg-content2">
          <CardBody className="p-4 space-y-2">
            <h4 className="text-sm font-semibold">Requirements</h4>
            <ul className="text-sm text-foreground/70 space-y-1">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                Must be at least 18 years old
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                Format: DD/MM/YYYY
              </li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default DateOfBirthStep;