import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { useConsent } from '../context/ConsentContext';
import { BLUE_600, BLUE_700, DEFAULT_USER_ID, GRAY_200, GRAY_700, GRAY_900, OPT_OUT_TOKEN, WHITE } from '../constants';

const CONSENT_API = 'http://localhost:4000/api/ai/consent';

interface AiInsightsConsentDialogProps {
  open: boolean;
  onClose?: () => void;
}

export function AiInsightsConsentDialog({ open, onClose }: AiInsightsConsentDialogProps) {
  const { setConsentToken } = useConsent();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleYes() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(CONSENT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: DEFAULT_USER_ID, scope: 'insights' }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json() as { consentToken: string };
      setConsentToken(data.consentToken);
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  function handleNo() {
    setConsentToken(OPT_OUT_TOKEN);
    onClose?.();
  }

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: '10px',
          border: `1px solid ${GRAY_200}`,
          minWidth: 420,
          px: 0.5,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1rem', color: GRAY_900, pb: 1 }}>
        Enable employee insights capability
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <DialogContentText sx={{ fontSize: '0.875rem', color: GRAY_700 }}>
          AI-powered employee insights will analyze activity data to surface productivity
          trends and recommendations. Do you consent to enabling this capability?
        </DialogContentText>

        {error && (
          <DialogContentText sx={{ fontSize: '0.8125rem', color: 'error.main', mt: 1.5 }}>
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
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { backgroundColor: 'transparent', color: GRAY_900 },
          }}
        >
          No
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleYes}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={13} sx={{ color: WHITE }} /> : null}
          sx={{
            backgroundColor: BLUE_600,
            color: WHITE,
            fontSize: '0.8125rem',
            fontWeight: 500,
            textTransform: 'none',
            borderRadius: '6px',
            px: 2,
            boxShadow: 'none',
            '&:hover': { backgroundColor: BLUE_700, boxShadow: 'none' },
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
