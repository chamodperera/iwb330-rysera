import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityInputProps {
  value?: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

const QuantityInput: React.FC<QuantityInputProps> = ({ 
  value = 1, 
  onChange, 
  min = 1, 
  max = 99,
  disabled = false 
}) => {
  const [focused, setFocused] = useState(false);
  
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className={`
      inline-flex items-center rounded-lg border
      ${focused ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'}
      ${disabled ? 'opacity-50' : ''}
      bg-white
    `}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className={`
          p-1 text-gray-600 hover:text-gray-900
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
        `}
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        className={`
          w-4 text-center text-gray-900 text-sm
          focus:outline-none [-moz-appearance:textfield]
          [&::-webkit-outer-spin-button]:appearance-none
          [&::-webkit-inner-spin-button]:appearance-none
          disabled:cursor-not-allowed bg-white
        `}
      />
      
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className={`
          p-1 text-gray-600 hover:text-gray-900
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
        `}
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default QuantityInput;