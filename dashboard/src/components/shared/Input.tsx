import React from 'react';
import { Input as NextInput, InputProps as NextInputProps } from "@nextui-org/react";
import { cn } from '@/utils/cn';

export interface InputProps extends Omit<NextInputProps, 'classNames'> {
  fullWidth?: boolean;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((
  { 
    fullWidth = true,
    error,
    className,
    ...props
  }, 
  ref
) => {
  return (
    <div className={cn(
      'w-full space-y-2',
      !fullWidth && 'max-w-xs',
      className
    )}>
      <NextInput
        ref={ref}
        {...props}
        isInvalid={!!error}
        classNames={{
          base: "w-full",
          mainWrapper: "h-full",
          input: cn(
            "bg-transparent",
            "text-foreground",
            "placeholder:text-foreground/50",
          ),
          inputWrapper: cn(
            "h-full",
            "bg-content/5",
            "backdrop-blur-xl",
            "backdrop-saturate-150",
            "!cursor-text",
            "hover:bg-content/10",
            "group-data-[focused=true]:bg-content/10",
            "!border-divider",
            "group-data-[focused=true]:!border-primary",
            "shadow-sm",
            "!transition-colors",
            "!duration-200",
            error ? [
              "border-danger",
              "group-data-[focused=true]:border-danger",
              "focus:border-danger"
            ] : [
              "border-divider/50",
              "group-data-[focused=true]:border-primary",
              "focus:border-primary"
            ]
          ),
          clearButton: cn(
            "text-foreground/50",
            "hover:text-foreground/80"
          ),
          errorMessage: "text-danger text-xs",
          description: "text-foreground/50 text-xs",
          label: cn(
            "text-foreground/50",
            "group-data-[filled=true]:text-foreground/90"
          ),
        }}
        errorMessage={error}
      />
    </div>
  );
});

Input.displayName = 'Input';

export default Input;