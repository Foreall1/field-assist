// Utility functions voor FIELD Assist

import { type ClassValue, clsx } from 'clsx';

/**
 * Combineert class names met ondersteuning voor conditional classes
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Formatteert een datum naar Nederlandse notatie
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formatteert leestijd
 */
export function formatReadTime(minutes: number): string {
  return `${minutes} min lezen`;
}

/**
 * Truncate text met ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Genereer een slug van een string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
