import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

import { GRAY_300, GRAY_400, GRAY_700 } from '../constants';

interface AddButtonProps {
  label: string;
}

export function AddButton({ label }: AddButtonProps) {
  return (
    <Button
      size="small"
      variant="outlined"
      startIcon={<AddIcon sx={{ fontSize: '14px !important' }} />}
      sx={{
        color: GRAY_700,
        fontSize: '0.8125rem',
        fontWeight: 400,
        textTransform: 'none',
        px: 1.25,
        border: `1px solid ${GRAY_300}`,
        borderRadius: '6px',
        backgroundColor: 'transparent',
        '&:hover': { backgroundColor: 'transparent', borderColor: GRAY_400, color: GRAY_700 },
        minWidth: 0,
        justifyContent: 'flex-start',
        '& .MuiButton-startIcon': { mr: 0.5 },
      }}
    >
      {label}
    </Button>
  );
}
