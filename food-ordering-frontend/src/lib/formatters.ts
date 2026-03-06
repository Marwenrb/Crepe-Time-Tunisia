/**
 * Shared formatting utilities
 *
 * Single source of truth for currency and date formatting across the app.
 * All monetary amounts stored in centimes (÷ 100 → TND).
 */

/** Format a centimes amount to a TND display string. */
export const formatCurrency = (amount: number): string => {
  const safe = Number(amount) || 0;
  return `${(safe / 100).toFixed(2)} TND`;
};

/** Format an ISO date string to a localised fr-FR date-time string. */
export const formatDateTime = (dateString: string): string =>
  new Date(dateString).toLocaleString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
