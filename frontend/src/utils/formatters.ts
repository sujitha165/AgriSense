import { Severity } from '../types';

/**
 * Format numbers as Indian Rupees (₹)
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format date string into human friendly format
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Get visual badge colors based on severity
 */
export function getSeverityStyles(severity: Severity) {
  switch (severity) {
    case 'Healthy':
      return {
        bg: 'bg-emerald-100 dark:bg-emerald-950/60',
        text: 'text-emerald-800 dark:text-emerald-300',
        border: 'border-emerald-300 dark:border-emerald-800',
        dot: 'bg-emerald-500',
        bar: 'bg-emerald-500',
        badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:text-emerald-400'
      };
    case 'Low':
      return {
        bg: 'bg-blue-100 dark:bg-blue-950/60',
        text: 'text-blue-800 dark:text-blue-300',
        border: 'border-blue-300 dark:border-blue-800',
        dot: 'bg-blue-500',
        bar: 'bg-blue-500',
        badge: 'bg-blue-500/10 text-blue-700 border-blue-300 dark:text-blue-400'
      };
    case 'Moderate':
      return {
        bg: 'bg-amber-100 dark:bg-amber-950/60',
        text: 'text-amber-800 dark:text-amber-300',
        border: 'border-amber-300 dark:border-amber-800',
        dot: 'bg-amber-500',
        bar: 'bg-amber-500',
        badge: 'bg-amber-500/10 text-amber-700 border-amber-300 dark:text-amber-400'
      };
    case 'Severe':
      return {
        bg: 'bg-rose-100 dark:bg-rose-950/60',
        text: 'text-rose-800 dark:text-rose-300',
        border: 'border-rose-300 dark:border-rose-800',
        dot: 'bg-rose-500',
        bar: 'bg-rose-500',
        badge: 'bg-rose-500/10 text-rose-700 border-rose-300 dark:text-rose-400'
      };
    default:
      return {
        bg: 'bg-stone-100 dark:bg-stone-800',
        text: 'text-stone-800 dark:text-stone-300',
        border: 'border-stone-300 dark:border-stone-700',
        dot: 'bg-stone-500',
        bar: 'bg-stone-500',
        badge: 'bg-stone-500/10 text-stone-700 border-stone-300 dark:text-stone-400'
      };
  }
}
