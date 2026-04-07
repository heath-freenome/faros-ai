import { useEffect } from 'react';

import { isConsentExpired, useConsent } from '../context/ConsentContext';
import { useFeatureFlags } from '../context/FeatureFlags';
import { DEFAULT_USER_ID, OPT_OUT_TOKEN } from '../constants';
import { useTelemetry } from '../hooks/useTelemetry';

/**
 * Invisible component that fires a single telemetry event on initial page render.
 * Records the state of every feature flag and whether AI consent is currently
 * granted and active so backend analytics can correlate user behavior with active flag
 * and consent combinations.
 *
 * Must be mounted inside both `FeatureFlagProvider` and `ConsentProvider`.
 * Renders nothing — place it anywhere in the provider subtree.
 */
export function PageLoadTelemetry() {
  const { track } = useTelemetry();
  const flags = useFeatureFlags();
  const { consentToken, expiresAt } = useConsent();

  useEffect(() => {
    const aiConsentGranted: boolean | null = consentToken === null ? null : consentToken !== OPT_OUT_TOKEN;
    const aiConsentActive: boolean | null =  consentToken === null ? null : !isConsentExpired(expiresAt);

    track({
      userId: DEFAULT_USER_ID,
      event: 'page.load',
      context: 'App',
      details: JSON.stringify({ flags, aiConsentGranted, aiConsentActive }),
    });
    // Intentionally omitting `flags` and `track` from deps — this must fire
    // exactly once on mount with the initial flag snapshot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
