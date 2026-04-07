import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

type FlagMap = Record<string, boolean>;

interface FeatureFlagContextValue {
  flags: FlagMap;
  setFlag: (name: string, enabled: boolean) => void;
}

// ── Storage key ────────────────────────────────────────────────────────────

const STORAGE_KEY = 'feature_flags';

function loadFlags(): FlagMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as FlagMap;
    }
  } catch {
    // corrupt storage — ignore
  }
  return {};
}

function saveFlags(flags: FlagMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
}

// ── Context ────────────────────────────────────────────────────────────────

const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FlagMap>(loadFlags);

  const setFlag = useCallback((name: string, enabled: boolean) => {
    setFlags(prev => {
      const next = { ...prev, [name]: enabled };
      saveFlags(next);
      return next;
    });
  }, []);

  return (
    <FeatureFlagContext.Provider value={{ flags, setFlag }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────

/**
 * Returns true if the named feature flag is enabled.
 *
 * Flags are persisted to localStorage under the key "feature_flags" as a
 * plain JSON object: { "my-flag": true, "other-flag": false }.
 * Unknown flags default to false.
 *
 * @example
 * const showNewDashboard = useFeatureFlag('new-dashboard');
 */
export function useFeatureFlag(name: string): boolean {
  const ctx = useContext(FeatureFlagContext);
  if (!ctx) throw new Error('useFeatureFlag must be used within a FeatureFlagProvider');
  return ctx.flags[name] === true;
}

/**
 * Returns the setFlag function for programmatically toggling flags.
 * Useful in dev tooling or settings panels.
 */
export function useSetFeatureFlag(): (name: string, enabled: boolean) => void {
  const ctx = useContext(FeatureFlagContext);
  if (!ctx) throw new Error('useSetFeatureFlag must be used within a FeatureFlagProvider');
  return ctx.setFlag;
}
