import { useEffect, useState } from 'react';
import { parseApiError } from './apiError';

const INSIGHTS_API_BASE = 'http://localhost:4000/api/ai/insights';

/** AI-generated insight payload returned by the insights API. */
export interface EmployeeInsights {
  /** Human-readable summary of the employee's activity trends. */
  summary?: string;
  /** Model confidence score in the range [0, 1]. */
  confidence?: number;
  /** Internal database ID of the employee these insights belong to. */
  employeeId?: string;
  /** Human-readable UID of the employee these insights belong to. */
  employeeUid?: string;
  /** ISO-8601 timestamp of when the insights were generated. */
  generatedAt?: string;
  /** Identifier of the AI model that produced the insights. */
  model?: string;
  /** Time taken by the backend to generate the insights, in milliseconds. */
  processingTimeMs?: number;
}

/** Remove sentences that end with '..' Those sentences currently denote PII that was added to the insights. */
function filterPiiInSummary(summary: string): string {
  const sentences = summary.split(/(?<=\.)\s+/);
  return sentences
    .filter(s => !s.trimEnd().endsWith('..'))
    .join(' ')
    .trim();
}

/** Return value of `useEmployeeInsights`. */
interface UseEmployeeInsightsResult {
  /** The fetched insights payload, or null while loading or on error. */
  insights: EmployeeInsights | null;
  /** True while the fetch is in-flight. */
  loading: boolean;
  /** Human-readable error message if the fetch failed, otherwise null. */
  error: string | null;
}

/**
 * Fetches AI-generated insights for a single employee.
 * Passes `consentToken` as the `x-consent-token` request header.
 * Re-fetches whenever `employeeId` or `consentToken` changes.
 */
export function useEmployeeInsights(
  employeeId: string,
  consentToken: string | null,
): UseEmployeeInsightsResult {
  const [insights, setInsights] = useState<EmployeeInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setInsights(null);
    setError(null);
    setLoading(true);

    async function fetchInsights() {
      try {
        const res = await fetch(`${INSIGHTS_API_BASE}/${employeeId}`, {
          headers: { 'x-consent-token': consentToken! },
        });
        if (!res.ok) {
          throw new Error(await parseApiError(res));
        }
        const data = await res.json() as EmployeeInsights;
        if (data.summary) {
          data.summary = filterPiiInSummary(data.summary);
        }
        if (!cancelled) {
          setInsights(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load insights.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchInsights();
    return () => { cancelled = true; };
  }, [employeeId, consentToken]);

  return { insights, loading, error };
}
