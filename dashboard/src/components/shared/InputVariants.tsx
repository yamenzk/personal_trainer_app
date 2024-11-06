import React from 'react';
import Input, { InputProps } from './Input';
import { Scale, Search, Mail, User, Calendar, Info } from 'lucide-react';

export const WeightInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'startContent' | 'endContent'>>(
  (props, ref) => (
    <Input
      ref={ref}
      type="number"
      startContent={<Scale className="text-default-400" size={18} />}
      endContent={
        <div className="pointer-events-none flex items-center">
          <span className="text-default-400 text-small">kg</span>
        </div>
      }
      {...props}
    />
  )
);

export const SearchInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'startContent'>>(
  (props, ref) => (
    <Input
      ref={ref}
      type="search"
      startContent={<Search className="text-default-400" size={18} />}
      placeholder="Search..."
      {...props}
    />
  )
);

export const EmailInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'startContent'>>(
  (props, ref) => (
    <Input
      ref={ref}
      type="email"
      startContent={<Mail className="text-default-400" size={18} />}
      placeholder="Enter your email"
      {...props}
    />
  )
);

export const NameInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'startContent'>>(
  (props, ref) => (
    <Input
      ref={ref}
      type="text"
      startContent={<User className="text-default-400" size={18} />}
      placeholder="Enter your name"
      {...props}
    />
  )
);

export const DateInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'startContent'>>(
  (props, ref) => (
    <Input
      ref={ref}
      type="date"
      startContent={<Calendar className="text-default-400" size={18} />}
      {...props}
    />
  )
);

WeightInput.displayName = 'WeightInput';
SearchInput.displayName = 'SearchInput';
EmailInput.displayName = 'EmailInput';
NameInput.displayName = 'NameInput';
DateInput.displayName = 'DateInput';

export { Input };
export type { InputProps };