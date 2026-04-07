import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

interface ConsentContextValue {
  consentToken: string | null;
  setConsentToken: (token: string) => void;
}

// ── Storage key ────────────────────────────────────────────────────────────

const STORAGE_KEY = 'ai_employee_insights_consent';

function loadToken(): string | null {
  return sessionStorage.getItem(STORAGE_KEY);
}

function persistToken(token: string): void {
  sessionStorage.setItem(STORAGE_KEY, token);
}

// ── Context ────────────────────────────────────────────────────────────────

const ConsentContext = createContext<ConsentContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consentToken, setToken] = useState<string | null>(loadToken);

  function setConsentToken(token: string) {
    persistToken(token);
    setToken(token);
  }

  return (
    <ConsentContext.Provider value={{ consentToken, setConsentToken }}>
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
