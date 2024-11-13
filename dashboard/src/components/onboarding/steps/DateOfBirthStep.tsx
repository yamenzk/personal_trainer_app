import { useState, useEffect } from 'react';
import { Input, Card, CardBody } from "@nextui-org/react";
import { Calendar, Check, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { cn } from '@/utils/cn';
import { DateOfBirthStepProps } from '@/types';
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

const DateOfBirthStep = ({ onComplete, onValidationChange, initialValue = '' }: DateOfBirthStepProps) => {
  const [displayDate, setDisplayDate] = useState(initialValue ? dayjs(initialValue).format('DD/MM/YYYY') : '');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  const formatDateInput = (input: string): string => {
    const numbers = input.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const getDateValidationError = (dateStr: string): string => {
    if (!dateStr) return 'Please enter your date of birth';
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return 'Please enter a complete date';

    const [day, month, year] = dateStr.split('/').map(Number);
    const inputDate = dayjs(dateStr, 'DD/MM/YYYY', true);
    const age = dayjs().diff(inputDate, 'year');

    if (month < 1 || month > 12) return 'Invalid month';
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return 'Invalid day';
    if (year < 1900) return 'Year must be after 1900';
    if (inputDate.isAfter(dayjs())) return 'Date cannot be in the future';
    if (age < 18) return 'You must be at least 18 years old';
    if (age > 100) return 'Please enter a valid age';

    return '';
  };

  const handleDateChange = (value: string) => {
    const formattedValue = formatDateInput(value);
    setDisplayDate(formattedValue);
    
    if (formattedValue.length === 10) {
      const validationError = getDateValidationError(formattedValue);
      setError(validationError);
      const valid = !validationError;
      setIsValid(valid);
      onValidationChange?.(valid);
      
      if (valid) {
        const isoDate = dayjs(formattedValue, 'DD/MM/YYYY').format('YYYY-MM-DD');
        onComplete(isoDate);
      }
    } else {
      setError('');
      setIsValid(false);
      onValidationChange?.(false);
    }
  };

  const getAge = (dateStr: string): number | null => {
    if (!isValid) return null;
    return dayjs().diff(dayjs(dateStr, 'DD/MM/YYYY'), 'year');
  };

  useEffect(() => {
    if (initialValue) {
      handleDateChange(dayjs(initialValue).format('DD/MM/YYYY'));
    }
  }, [initialValue]);

  const requirements = [
    { label: 'Must be 18 or older', check: isValid && (getAge(displayDate) ?? 0) >= 18 },
    { label: 'Format: DD/MM/YYYY', check: /^\d{2}\/\d{2}\/\d{4}$/.test(displayDate) },
    { label: 'Cannot be in future', check: isValid && !dayjs(displayDate, 'DD/MM/YYYY').isAfter(dayjs()) }
  ];

  return (
    <div className="space-y-4">

      {/* Date Preview */}
      <div className="flex flex-col items-center py-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-b from-primary-500/20 to-background flex items-center justify-center">
            {isValid ? (
              <span className="text-xl font-semibold text-primary-500">
                {getAge(displayDate)}
              </span>
            ) : (
              <Calendar className="w-6 h-6 text-primary-500" />
            )}
          </div>
          {isValid && (
            <div className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        {isValid && (
          <div className="text-center mt-3">
            <p className="text-base font-medium">
              {dayjs(displayDate, 'DD/MM/YYYY').format('DD MMMM YYYY')}
            </p>
            <p className="text-sm text-foreground/60">
              {getAge(displayDate)} years old
            </p>
          </div>
        )}
      </div>

      {/* Date Input */}
      <Input
        type="text"
        label="Date of Birth"
        placeholder="DD/MM/YYYY"
        value={displayDate}
        onValueChange={handleDateChange}
        maxLength={10}
        errorMessage={error}
        isInvalid={!!error}
        variant="bordered"
        radius="lg"
        autoFocus
        startContent={
          <Calendar className="w-4 h-4 text-foreground/50" />
        }
      />

      {/* Requirements */}
      <div className="grid grid-cols-3 gap-2">
        {requirements.map(({ label, check }) => (
          <div
            key={label}
            className={cn(
              "p-2 rounded-lg",
              check ? "bg-primary-500/10" : "bg-content1"
            )}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              {check ? (
                <Check className="w-4 h-4 text-primary-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-foreground/50" />
              )}
              <span className={cn(
                "text-xs",
                check ? "text-primary-500" : "text-foreground/60"
              )}>
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>
      <Card className="bg-content2">
        <CardBody className="p-3">
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/70">
            Your age helps me create a safe and effective fitness program tailored to your life stage and capabilities.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default DateOfBirthStep;