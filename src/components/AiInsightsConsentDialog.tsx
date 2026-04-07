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
import { parseApiError } from '../hooks/apiError.ts';
import { PrimaryButton } from '../styles/components';

const CONSENT_API = 'http://localhost:4000/api/ai/consent';

interface SnackbarState {
  open: boolean;
  severity: 'success' | 'info';
  message: string;
}

const SNACKBAR_CLOSED: SnackbarState = { open: false, severity: 'success', message: '' };

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

interface AiInsightsConsentDialogProps {
  open: boolean;
  onClose?: () => void;
}

export function AiInsightsConsentDialog({ open, onClose }: AiInsightsConsentDialogProps) {
  const { setConsent, setConsentToken } = useConsent();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>(SNACKBAR_CLOSED);

  const closeSnackbar = useCallback(() => setSnackbar(SNACKBAR_CLOSED), []);

  async function handleYes() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(CONSENT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: DEFAULT_USER_ID, scope: 'insights' }),
      });
      if (!res.ok) {
        throw new Error(await parseApiError(res));
      }
      const data = await res.json() as { consentToken: string; expiresAt: string };
      setConsent(data.consentToken, data.expiresAt);
      onClose?.();
      setSnackbar({
        open: true,
        severity: 'success',
        message: `AI employee insights enabled. Consent expires ${formatExpiry(data.expiresAt)}.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  function handleNo() {
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
