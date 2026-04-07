import { BLUE_600, GRAY_50, GRAY_200, GRAY_300 } from '../constants';

/**
 * MUI `sx` object for compact outlined text inputs used in the detail panel.
 * Applies a light background, subdued border colours, and reduced vertical padding.
 */
export const fieldInputSx = {
  '& .MuiOutlinedInput-root': {
    fontSize: '0.8125rem',
    backgroundColor: GRAY_50,
    '& fieldset': { borderColor: GRAY_200 },
    '&:hover fieldset': { borderColor: GRAY_300 },
    '&.Mui-focused fieldset': { borderColor: BLUE_600, borderWidth: '1px' },
  },
  '& .MuiInputBase-input': { py: '6px', px: '10px' },
};
