import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

export interface ConsentState {
  consentToken: string | null;
  expiresAt: string | null;
}

interface ConsentContextValue extends ConsentState {
  setConsent: (token: string, expiresAt: string) => void;
  setConsentToken: (token: string) => void; // opt-out path (no expiry)
}

// ── Storage keys ───────────────────────────────────────────────────────────

const TOKEN_KEY   = 'ai_employee_insights_consent';
const EXPIRY_KEY  = 'ai_employee_insights_consent_expires_at';

function loadState(): ConsentState {
  return {
    consentToken: sessionStorage.getItem(TOKEN_KEY),
    expiresAt:    sessionStorage.getItem(EXPIRY_KEY),
  };
}

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

export function ConsentProvider({ children }: { children: ReactNode }) {
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
    <ConsentContext.Provider value={{ ...state, setConsent, setConsentToken }}>
      {children}
    </ConsentContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────

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
