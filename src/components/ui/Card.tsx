import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  interactive = false,
  header,
  footer,
  children,
  className,
  ...props
}) => {
  const baseStyles = "rounded-2xl transition-all duration-300";
  
  const variantStyles = {
    default: "bg-white shadow-lg hover:shadow-xl border border-gray-100",
    glass: "bg-white/80 backdrop-blur-lg shadow-glass border border-white/20 hover:bg-white/90",
    elevated: "bg-white shadow-2xl hover:shadow-3xl border-0 transform hover:-translate-y-1",
    outlined: "bg-transparent border-2 border-climate-200 hover:border-climate-300 hover:bg-climate-50/50"
  };
  
  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };

  const interactiveStyles = interactive 
    ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={interactive ? { y: -4 } : {}}
      className={clsx(
        baseStyles,
        variantStyles[variant],
        paddingStyles[padding],
        interactiveStyles,
        className
      )}
      {...(props as any)}
    >
      {header && (
        <div className="mb-4 pb-4 border-b border-gray-100">
          {header}
        </div>
      )}
      
      <div className="flex-1">
        {children}
      </div>
      
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {footer}
        </div>
      )}
    </motion.div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={clsx("mb-4", className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h3 className={clsx("text-xl font-bold text-gray-900", className)} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => (
  <p className={clsx("text-gray-600 mt-1", className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={clsx("space-y-4", className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={clsx("flex items-center justify-between pt-4 mt-4 border-t border-gray-100", className)} {...props}>
    {children}
  </div>
);