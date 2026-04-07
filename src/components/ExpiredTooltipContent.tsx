import Box from '@mui/material/Box';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Typography from '@mui/material/Typography';

interface ExpiredTooltipContentProps {
  onReconsent: () => void;
}

export function ExpiredTooltipContent({ onReconsent }: ExpiredTooltipContentProps) {
  return (
    <Box sx={{ p: 0.5, maxWidth: 240 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
        <WarningAmberIcon sx={{ fontSize: 14 }}/>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
          Consent expired
        </Typography>
      </Box>
      <Typography sx={{ fontSize: '0.75rem', lineHeight: 1.5, opacity: 0.9 }}>
        Your AI employee insights consent has expired. Click to re-consent and continue
        using this feature.
      </Typography>
      <Typography
        onClick={onReconsent}
        sx={{
          fontSize: '0.75rem',
          fontWeight: 600,
          mt: 1,
          cursor: 'pointer',
          textDecoration: 'underline',
          opacity: 0.9,
          '&:hover': { opacity: 1 },
        }}
      >
        Re-consent now
      </Typography>
    </Box>
  );
}