import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'climate' | 'nature' | 'urban';
  disabled?: boolean;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  size = 'md',
  color = 'climate',
  disabled = false,
  className
}) => {
  const sizeStyles = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4'
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5'
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7'
    }
  };

  const colorStyles = {
    climate: checked ? 'bg-climate-500' : 'bg-gray-300',
    nature: checked ? 'bg-nature-500' : 'bg-gray-300',
    urban: checked ? 'bg-urban-500' : 'bg-gray-300'
  };

  return (
    <div className={clsx("flex items-start space-x-3", className)}>
      <button
        type="button"
        className={clsx(
          "relative inline-flex flex-shrink-0 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2",
          sizeStyles[size].track,
          colorStyles[color],
          disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : `focus:ring-${color}-200`
        )}
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
      >
        <motion.span
          className={clsx(
            "pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition ease-in-out duration-200",
            sizeStyles[size].thumb
          )}
          animate={{
            x: checked ? sizeStyles[size].translate.replace('translate-x-', '') : '0'
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
      </button>
      
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <label 
              className={clsx(
                "text-sm font-medium text-gray-900 cursor-pointer",
                disabled && "cursor-not-allowed opacity-50"
              )}
              onClick={() => !disabled && onChange(!checked)}
            >
              {label}
            </label>
          )}
          {description && (
            <p className={clsx(
              "text-sm text-gray-500",
              disabled && "opacity-50"
            )}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

interface ToggleGroupProps {
  items: Array<{
    id: string;
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }>;
  title?: string;
  className?: string;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  items,
  title,
  className
}) => {
  return (
    <div className={clsx("space-y-4", className)}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      )}
      <div className="space-y-3">
        {items.map((item) => (
          <Toggle
            key={item.id}
            checked={item.checked}
            onChange={item.onChange}
            label={item.label}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};