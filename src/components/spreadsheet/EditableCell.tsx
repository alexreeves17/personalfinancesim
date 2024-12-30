import React, { useState, useRef, useEffect } from 'react';
import { formatCurrency, parseCurrencyInput } from '../../utils/spreadsheet/formatting';

interface Props {
  value: number;
  onChange: (value: number) => void;
  type: 'currency';
  isEditing?: boolean;
  isHighlighted?: boolean;
}

export function EditableCell({ 
  value, 
  onChange, 
  type, 
  isEditing: defaultEditing = false,
  isHighlighted: defaultHighlighted = false 
}: Props) {
  const [isEditing, setIsEditing] = useState(defaultEditing);
  const [inputValue, setInputValue] = useState(value.toString());
  const [isHighlighted, setIsHighlighted] = useState(defaultHighlighted);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    // Update highlight state when prop changes
    setIsHighlighted(defaultHighlighted);
  }, [defaultHighlighted]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const newValue = type === 'currency' ? parseCurrencyInput(inputValue) : Number(inputValue);
    if (!isNaN(newValue) && newValue !== value) {
      onChange(newValue);
    }
    setInputValue(value.toString());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(value.toString());
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full p-2 text-right border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={`p-2 text-right cursor-pointer transition-all duration-500 ${
        isHighlighted ? 'bg-blue-100 scale-105' : ''
      }`}
    >
      {type === 'currency' ? formatCurrency(value) : value}
    </div>
  );
}