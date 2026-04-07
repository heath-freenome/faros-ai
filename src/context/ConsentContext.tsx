import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

/** Persisted consent state stored in sessionStorage. */
export interface ConsentState {
  /** The active consent token, `OPT_OUT_TOKEN` if declined, or `null` if not yet answered. */
  consentToken: string | null;
  /** ISO-8601 datetime string at which the consent token expires, or `null`. */
  expiresAt: string | null;
}

/** Value exposed by `ConsentContext`. */
interface ConsentContextValue extends ConsentState {
  /** Unique identifier for the current browser tab session, stable for its lifetime. */
  sessionId: string;
  /** Record consent granted via the API — stores both token and expiry. */
  setConsent: (token: string, expiresAt: string) => void;
  /** Store a token without an expiry date, used for the opt-out sentinel path. */
  setConsentToken: (token: string) => void;
}

// ── Storage keys ───────────────────────────────────────────────────────────

const TOKEN_KEY      = 'ai_employee_insights_consent';
const EXPIRY_KEY     = 'ai_employee_insights_consent_expires_at';
const SESSION_ID_KEY = 'ai_employee_insights_session_id';

/**
 * Returns the session ID for the current browser tab.
 * Reads the existing ID from sessionStorage if one was already generated this session,
 * otherwise creates a new UUID, persists it, and returns it.
 * Because sessionStorage is scoped to the tab, each new tab starts a fresh session.
 */
function loadSessionId(): string {
  const existing = sessionStorage.getItem(SESSION_ID_KEY);
  if (existing) {
    return existing;
  }
  const newId = crypto.randomUUID();
  sessionStorage.setItem(SESSION_ID_KEY, newId);
  return newId;
}

/** Reads the current consent state from sessionStorage, returning nulls when absent. */
function loadState(): ConsentState {
  return {
    consentToken: sessionStorage.getItem(TOKEN_KEY),
    expiresAt:    sessionStorage.getItem(EXPIRY_KEY),
  };
}

/**
 * Writes the consent token and optional expiry to sessionStorage.
 * Removes the expiry key entirely when `expiresAt` is null (opt-out path).
 */
function persistConsent(token: string, expiresAt: string | null): void {
  sessionStorage.setItem(TOKEN_KEY, token);
  if (expiresAt !== null) {
    sessionStorage.setItem(EXPIRY_KEY, expiresAt);
  } else {
    sessionStorage.removeItem(EXPIRY_KEY);
  }
}

// ── Context ────────────────────────────────────────────────────────────────

const ConsentContext = createContext<ConsentContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────

/** Provides AI-insights consent state to the subtree and persists it in sessionStorage. */
export function ConsentProvider({ children }: { children: ReactNode }) {
  const [sessionId] = useState<string>(loadSessionId);
  const [state, setState] = useState<ConsentState>(loadState);

  function setConsent(token: string, expiresAt: string) {
    persistConsent(token, expiresAt);
    setState({ consentToken: token, expiresAt });
  }

  function setConsentToken(token: string) {
    persistConsent(token, null);
    setState({ consentToken: token, expiresAt: null });
  }

  return (
    <ConsentContext.Provider value={{ ...state, sessionId, setConsent, setConsentToken }}>
      {children}
    </ConsentContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────

/** Returns the consent state and setters. Must be used within a `ConsentProvider`. */
export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return ctx;
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Returns true if expiresAt is set and is in the past. */
export function isConsentExpired(expiresAt: string | null): boolean {
  if (!expiresAt) {
    return false;
  }
  return new Date(expiresAt).getTime() < Date.now();
}
