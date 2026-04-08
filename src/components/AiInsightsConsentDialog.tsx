import { useCallback, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { useConsent } from '../context/ConsentContext';
import { DEFAULT_USER_ID, GRAY_700, GRAY_900, OPT_OUT_TOKEN, WHITE } from '../constants';
import { getApiBaseUrl } from '../config';
import { parseApiError } from '../hooks/parseApiError.ts';
import { useTelemetry } from '../hooks/useTelemetry';
import { PrimaryButton } from '../styles/components';

const CONSENT_API = `${getApiBaseUrl()}/api/ai/consent`;

/** Internal state for the feedback snackbar shown after a consent action. */
interface SnackbarState {
  /** Whether the snackbar is currently visible. */
  open: boolean;
  /** Alert severity level, controls the icon and background colour. */
  severity: 'success' | 'info';
  /** Message text displayed inside the snackbar. */
  message: string;
}

const SNACKBAR_CLOSED: SnackbarState = { open: false, severity: 'success', message: '' };

/**
 * Formats an ISO-8601 expiry timestamp into a locale-aware, human-readable string.
 * Falls back to the raw string if parsing fails.
 */
function formatExpiry(expiresAt: string): string {
  try {
    return new Date(expiresAt).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return expiresAt;
  }
}

/** Props for `AiInsightsConsentDialog`. */
interface AiInsightsConsentDialogProps {
  /** Flag indicating whether the dialog is open */
  open: boolean;
  /** Called after the user either grants or declines consent. */
  onClose?: () => void;
}

/**
 * Modal dialog that asks the user to grant or decline AI employee insights consent.
 * On "Yes", POSTs to the consent API and stores the returned token + expiry.
 * On "No", stores the opt-out sentinel token.
 * In both cases a confirmation snackbar is shown after the dialog closes.
 *
 * **Telemetry**
 * | Event | When | `details` |
 * |---|---|---|
 * | `api.consent.success` | Consent granted via API | `{ scope, expiresAt }` |
 * | `api.consent.error` | Consent API call failed | `{ scope }` |
 * | `consent.optOut` | User clicked No | — |
 */
export function AiInsightsConsentDialog({ open, onClose }: AiInsightsConsentDialogProps) {
  const { setConsent, setConsentToken } = useConsent();
  const { track } = useTelemetry();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>(SNACKBAR_CLOSED);

  /** Resets the snackbar to its closed state. */
  const closeSnackbar = useCallback(() => setSnackbar(SNACKBAR_CLOSED), []);

  /** POSTs to the consent API and stores the returned token + expiry on success. */
  async function handleYes() {
    setLoading(true);
    setError(null);
    const requestStart = new Date().toISOString();
    const t0 = Date.now();
    let responseStatus: number | undefined;
    try {
      const res = await fetch(CONSENT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: DEFAULT_USER_ID, scope: 'insights' }),
      });
      responseStatus = res.status;
      if (!res.ok) {
        throw new Error(await parseApiError(res));
      }
      const data = await res.json() as { consentToken: string; expiresAt: string };
      track({
        userId: DEFAULT_USER_ID,
        event: 'api.consent.success',
        context: 'AiInsightsConsentDialog',
        details: JSON.stringify({ scope: 'insights', expiresAt: data.expiresAt }),
        requestStart,
        requestDuration: Date.now() - t0,
        requestStatus: responseStatus,
      });
      setConsent(data.consentToken, data.expiresAt);
      onClose?.();
      setSnackbar({
        open: true,
        severity: 'success',
        message: `AI employee insights enabled. Consent expires ${formatExpiry(data.expiresAt)}.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      track({
        userId: DEFAULT_USER_ID,
        event: 'api.consent.error',
        context: 'AiInsightsConsentDialog',
        details: JSON.stringify({ scope: 'insights' }),
        requestStart,
        requestDuration: Date.now() - t0,
        requestStatus: responseStatus,
        requestError: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  /** Stores the opt-out sentinel token and closes the dialog without an API call. */
  function handleNo() {
    track({
      userId: DEFAULT_USER_ID,
      event: 'consent.optOut',
      context: 'AiInsightsConsentDialog',
    });
    setConsentToken(OPT_OUT_TOKEN);
    onClose?.();
    setSnackbar({
      open: true,
      severity: 'info',
      message: 'You have declined AI employee insights. You can enable it at any time from the toolbar.',
    });
  }

  return (
    <>
      <Dialog
        open={open}
        disableEscapeKeyDown
        PaperProps={{ elevation: 2, sx: { minWidth: 420, px: 0.5 } }}
      >
        <DialogTitle>Enable employee insights capability</DialogTitle>

        <DialogContent sx={{ pt: 0 }}>
          <DialogContentText>
            AI-powered employee insights will analyze activity data to surface productivity
            trends and recommendations. Do you consent to enabling this capability?
          </DialogContentText>

          {error && (
            <DialogContentText sx={{ color: 'error.main', mt: 1.5 }}>
              {error} Please try again.
            </DialogContentText>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            size="small"
            onClick={handleNo}
            disabled={loading}
            sx={{
              color: GRAY_700,
              fontSize: '0.8125rem',
              '&:hover': { backgroundColor: 'transparent', color: GRAY_900 },
            }}
          >
            No
          </Button>
          <PrimaryButton
            onClick={handleYes}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={13} sx={{ color: WHITE }} /> : null}
            sx={{ px: 2 }}
          >
            Yes
          </PrimaryButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={closeSnackbar}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
