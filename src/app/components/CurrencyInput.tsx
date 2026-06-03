import { useState, useEffect } from 'react';
import { formatCurrencyInput, getCurrencyValue, formatToBRL } from '../utils/formatters';

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = 'R$ 0,00',
  className = '',
  autoFocus = false,
  onKeyPress
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    // Quando o value externo mudar (ex: ao editar), atualiza o display
    if (value) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setDisplayValue(formatToBRL(numValue));
      }
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Formata enquanto digita
    const formatted = formatCurrencyInput(inputValue);
    setDisplayValue(formatted);

    // Retorna o valor numérico como string para o componente pai
    const numericValue = getCurrencyValue(formatted);
    onChange(numericValue.toString());
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      autoFocus={autoFocus}
      onKeyPress={onKeyPress}
    />
  );
}