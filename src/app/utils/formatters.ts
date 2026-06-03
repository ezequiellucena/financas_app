// Formata valor para moeda brasileira (ex: 1234.56 -> "1.234,56")
export function formatToBRL(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Remove formatação e retorna número
export function parseBRL(value: string): number {
  const cleaned = value.replace(/\./g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

// Formata input enquanto digita
export function formatCurrencyInput(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');

  if (!numbers) return '';

  // Converte para número e divide por 100 (centavos)
  const amount = parseInt(numbers) / 100;

  // Formata para BRL
  return formatToBRL(amount);
}

// Retorna valor numérico do input formatado
export function getCurrencyValue(formattedValue: string): number {
  if (!formattedValue) return 0;
  return parseBRL(formattedValue);
}