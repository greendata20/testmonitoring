import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'climate' | 'nature';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  rounded = false,
  icon,
  children,
  className,
  ...props
}) => {
  const baseStyles = "inline-flex items-center font-medium transition-all duration-200";
  
  const variantStyles = {
    default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    success: "bg-green-100 text-green-800 hover:bg-green-200",
    warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    danger: "bg-red-100 text-red-800 hover:bg-red-200",
    info: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    climate: "bg-gradient-to-r from-climate-100 to-climate-200 text-climate-800 hover:from-climate-200 hover:to-climate-300",
    nature: "bg-gradient-to-r from-nature-100 to-nature-200 text-nature-800 hover:from-nature-200 hover:to-nature-300"
  };
  
  const sizeStyles = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2"
  };

  const roundedStyles = rounded ? "rounded-full" : "rounded-lg";

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        roundedStyles,
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.span>
  );
};

interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'online' | 'offline' | 'loading' | 'error' | 'success';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
  ...props
}) => {
  const statusConfig = {
    online: { variant: 'success' as const, icon: '🟢' },
    offline: { variant: 'default' as const, icon: '⚫' },
    loading: { variant: 'info' as const, icon: '🔄' },
    error: { variant: 'danger' as const, icon: '🔴' },
    success: { variant: 'success' as const, icon: '✅' }
  };

  const config = statusConfig[status];

  return (
    <Badge 
      variant={config.variant}
      icon={<span className="animate-pulse">{config.icon}</span>}
      {...props}
    >
      {children || status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};