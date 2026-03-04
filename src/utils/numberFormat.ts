export const formatNumber = (value: number, digits = 0): string => {
  if (Number.isNaN(value) || value === undefined || value === null) return '—';
  return value.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
};

export const formatPercentage = (value: number, digits = 1): string => {
  if (Number.isNaN(value) || value === undefined || value === null) return '—';
  return `${(value * 100).toFixed(digits)}%`;
};

export const formatRelativeChange = (value: number, digits = 1): string => {
  if (Number.isNaN(value) || value === undefined || value === null) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${(value * 100).toFixed(digits)}%`;
};

export const formatDateTime = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
};
