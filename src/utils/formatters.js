/**
 * Format numeric value as USD currency
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format ISO date string into readable format (e.g. Oct 24, 2026)
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

/**
 * Truncate long strings with ellipsis
 */
export const truncateText = (text, maxLength = 80) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Compute discount percentage
 */
export const calculateDiscountPercentage = (original, discount) => {
  if (!original || !discount || discount >= original) return 0;
  return Math.round(((original - discount) / original) * 100);
};
