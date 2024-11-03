import React from 'react';
import { cn } from '@/utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gradient?: string;
  className?: string;
  borderClassName?: string;
  glowClassName?: string;
}

export const GlassCard = ({
  children,
  gradient = "from-primary-500/10 to-secondary-500/10",
  className = "",
  borderClassName = "",
  glowClassName = "",
  ...props
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden backdrop-blur-md shadow-lg",
        "transition-all duration-300",
        className
      )}
      {...props}
    >
      {/* Background gradient with glass effect */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          "bg-background/50",
          gradient
        )}
      />

      {/* Inner glass border */}
      

      {/* Glow effect */}
      <div
        className={cn(
          "absolute -z-10 inset-0 blur-2xl opacity-25",
          "bg-gradient-to-br",
          gradient,
          glowClassName
        )}
      />

      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
};

// Variants
export const PrimaryGlassCard = ({ className, ...props }: GlassCardProps) => (
  <GlassCard
    gradient="from-primary-500/10 to-secondary-500/10"
    className={className}
    {...props}
  />
);

export const ContentGlassCard = ({ className, ...props }: GlassCardProps) => (
  <GlassCard
    gradient="from-background/50 to-background/30"
    className={className}
    {...props}
  />
);

export const WarningGlassCard = ({ className, ...props }: GlassCardProps) => (
  <GlassCard
    gradient="from-warning-500/10 to-secondary-500/10"
    className={className}
    {...props}
  />
);

export const SuccessGlassCard = ({ className, ...props }: GlassCardProps) => (
  <GlassCard
    gradient="from-success-500/10 to-primary-500/10"
    className={className}
    {...props}
  />
);