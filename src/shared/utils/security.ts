import { env } from '../config/env';

export const isSafeOrigin = (origin: string): boolean => {
  const allowedOrigins = [
    env.VITE_API_URL,
    env.VITE_MAIN_APP_URL,
    window.location.origin,
  ];
  return allowedOrigins.includes(origin);
};

export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
