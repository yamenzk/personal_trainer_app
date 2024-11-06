// src/components/shared/GlassCard.tsx
import React from 'react';
import { cn } from '@/utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'solid' | 'gradient' | 'frosted';
  gradient?: string;
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
  onPress?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const GlassCard = ({
  children,
  variant = 'primary',
  gradient,
  intensity = 'medium',
  className = "",
  onPress,
  ...props
}: GlassCardProps) => {
  const baseStyles = "relative rounded-xl overflow-hidden transition-all duration-300";
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return `
          backdrop-blur-md 
          ${intensity === 'light' ? 'bg-background/30' : 
            intensity === 'medium' ? 'bg-background/50' : 
            'bg-background/70'}
          border border-white/10
        `;
      case 'secondary':
        return `
          backdrop-blur-sm
          bg-content/5
          border border-content/10
          hover:border-content/20
        `;
      case 'solid':
        return `
          bg-content/10
          border border-content/5
        `;
      case 'gradient':
        return `
          backdrop-blur-lg
          bg-gradient-to-br ${gradient || 'from-primary-500/10 to-secondary-500/10'}
          border border-white/20
        `;
      case 'frosted':
        return `
          backdrop-blur-xl
          bg-white/5
          border border-white/10
          shadow-xl
        `;
      default:
        return '';
    }
  };

  return (
    <div
      className={cn(
        baseStyles,
        getVariantStyles(),
        className
      )}
      onClick={onPress}
      {...props}
    >
      {variant === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-br opacity-10" />
      )}
      <div className="relative">{children}</div>
    </div>
  );
};