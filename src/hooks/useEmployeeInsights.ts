import { useEffect, useState } from 'react';
import { parseApiError } from './apiError';

const INSIGHTS_API_BASE = 'http://localhost:4000/api/ai/insights';

export interface EmployeeInsights {
  summary?: string;
  confidence?: number;
  employeeId?: string;
  employeeUid?: string;
  generatedAt?: string;
  model?: string;
  processingTimeMs?: number;
  [key: string]: unknown;
}

/** Remove sentences that end with '..' Those sentences currently denote PII that was added to the insights. */
function filterPiiInSummary(summary: string): string {
  const sentences = summary.split(/(?<=\.)\s+/);
  return sentences
    .filter(s => !s.trimEnd().endsWith('..'))
    .join(' ')
    .trim();
}

interface UseEmployeeInsightsResult {
  insights: EmployeeInsights | null;
  loading: boolean;
  error: string | null;
}

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
