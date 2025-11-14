import React from 'react';
import { Input } from './input';
import { Plus, Minus } from 'lucide-react';

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  value: string | number;
  onValueChange: (value: string) => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export const NumberInput = ({
  value,
  onValueChange,
  onIncrement,
  onDecrement,
  className,
  disabled,
  ...props
}: NumberInputProps) => {
  return (
    <div className={`relative flex items-center ${className || ''}`}>
      <Input
        type="number"
        className="pr-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" // Hide default spinners
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
        {...props}
      />
      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center bg-secondary/80 rounded-md border border-border">
        <button
          type="button"
          onClick={onDecrement}
          tabIndex={-1}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-l-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Decrement"
          disabled={disabled || !onDecrement}
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-border"></div>
        <button
          type="button"
          onClick={onIncrement}
          tabIndex={-1}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-r-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Increment"
          disabled={disabled || !onIncrement}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};