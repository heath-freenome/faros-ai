/**
 * Returns the Faros API base URL.
 * Reads `VITE_FAROS_API_BASE_URL` from the Vite environment at build time,
 * falling back to `http://localhost:4000` when the variable is not set.
 *
 * @example
 * // .env.local
 * // VITE_FAROS_API_BASE_URL=https://api.faros.ai
 */
export function getApiBaseUrl(): string {
  return import.meta.env.VITE_FAROS_API_BASE_URL ?? 'http://localhost:4000';
}
