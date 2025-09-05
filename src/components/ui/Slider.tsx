import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  className?: string;
  disabled?: boolean;
  color?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  unit,
  className,
  disabled = false,
  color = 'climate'
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    onChange(newValue);
  };

  return (
    <div className={clsx("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between text-sm">
          <label className="font-medium text-gray-700">{label}</label>
          <span className="text-gray-500">
            {value}{unit && ` ${unit}`}
          </span>
        </div>
      )}
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          style={{ width: '100%' }}
        />
        
        <div
          className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
          onClick={(e) => {
            if (disabled) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newPercentage = (clickX / rect.width) * 100;
            const newValue = min + (newPercentage / 100) * (max - min);
            onChange(Math.round(newValue / step) * step);
          }}
        >
          {/* Progress Track */}
          <motion.div
            className={clsx(
              "absolute top-0 left-0 h-full rounded-full",
              color === 'climate' && "bg-gradient-to-r from-climate-400 to-climate-500",
              color === 'nature' && "bg-gradient-to-r from-nature-400 to-nature-500",
              disabled && "opacity-50"
            )}
            style={{ width: `${percentage}%` }}
            layoutId={`slider-progress-${label}`}
          />
          
          {/* Thumb */}
          <motion.div
            className={clsx(
              "absolute top-1/2 w-5 h-5 rounded-full shadow-lg border-2 border-white cursor-pointer transform -translate-y-1/2",
              color === 'climate' && "bg-climate-500",
              color === 'nature' && "bg-nature-500",
              disabled ? "cursor-not-allowed opacity-50" : "hover:scale-110",
            )}
            style={{ left: `${percentage}%`, marginLeft: '-10px' }}
            whileHover={disabled ? {} : { scale: 1.2 }}
            whileTap={disabled ? {} : { scale: 0.9 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0}
            onDrag={(_, info) => {
              if (disabled) return;
              const containerWidth = 300; // Approximate width, could be measured
              const dragX = info.point.x;
              const newPercentage = Math.max(0, Math.min(100, (dragX / containerWidth) * 100));
              const newValue = min + (newPercentage / 100) * (max - min);
              onChange(Math.round(newValue / step) * step);
            }}
          >
            {/* Inner dot */}
            <div className="absolute inset-1 bg-white rounded-full" />
          </motion.div>
        </div>
        
        {/* Min/Max labels */}
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
};