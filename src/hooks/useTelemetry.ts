import { useCallback } from 'react';

import { useConsent } from '../context/ConsentContext';
import { getApiBaseUrl } from '../config';

const TELEMETRY_ENDPOINT = `${getApiBaseUrl()}/api/telemetry`;

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Returns a stable SHA-256 hex digest of the given string.
 * The same input always produces the same output (idempotent), so the
 * anonymised userId can still be used to correlate events across requests
 * without exposing the raw identifier.
 *
 * @param value - The plain-text string to hash.
 * @returns Lowercase hex-encoded SHA-256 digest.
 */
async function sha256Hex(value: string): Promise<string> {
  const encoded = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ── Types ──────────────────────────────────────────────────────────────────

/**
 * Telemetry event payload sent to the backend.
 * Core fields identify the session, user, and action; optional fields
 * capture error details and HTTP request diagnostics.
 */
export interface TelemetryEvent {
  /** Identifier of the user who triggered the event. */
  userId: string;
  /** Short, dot-namespaced event name, e.g. `"consent.granted"`. */
  event: string;
  /** Free-text description of where in the app the event occurred. */
  context: string;
  /** Optional additional detail or metadata about the event. */
  details?: string;
  /** Stack trace string when reporting a caught error. */
  stackTrace?: string;
  /** ISO-8601 timestamp at which an associated HTTP request was initiated. */
  requestStart?: string;
  /** Elapsed time in milliseconds for an associated HTTP request. */
  requestDuration?: number;
  /** HTTP status code returned by an associated request. */
  requestStatus?: number;
  /** Human-readable error message from an associated failed request. */
  requestError?: string;
}

/** Return value of `useTelemetry`. */
interface UseTelemetryResult {
  /**
   * Sends a telemetry event to the backend.
   * Failures are silently swallowed so telemetry never breaks the calling code.
   */
  track: (event: TelemetryEvent) => void;
}

// ── Hook ───────────────────────────────────────────────────────────────────

/**
 * Provides a stable `track` function for firing-and-forgetting telemetry
 * events to the backend. The `sessionId` is sourced automatically from
 * `ConsentContext` and injected into every event. Errors from the POST are
 * suppressed — telemetry must never affect the user-facing experience.
 */
export function useTelemetry(): UseTelemetryResult {
  // Ideally the sessionId would come from a request cookie or something but for the sake of this project, we are
  // going to get it from the consent since that is creating a unique id for the session storage instance
  const { sessionId } = useConsent();

  /**
   * POSTs a telemetry event to the backend.
   * The `sessionId` from `ConsentContext` is automatically injected, and the
   * `userId` is replaced with its SHA-256 hex digest before transmission so
   * the raw identifier is never sent over the wire.
   * The call is fire-and-forget: the returned Promise is not awaited and
   * any network or server error is silently caught.
   */
  const track = useCallback((event: TelemetryEvent) => {
    sha256Hex(event.userId)
      .then(hashedUserId =>
        fetch(TELEMETRY_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...event, sessionId, userId: hashedUserId }),
        })
      )
      .catch(() => {
        // Intentionally suppressed — telemetry failures must not surface to the user.
      });
  }, [sessionId]);

  return { track };
}
