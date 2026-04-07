import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export function SkeletonRow() {
  return (
    <TableRow>
      <TableCell padding="checkbox"><Checkbox size="small" disabled /></TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Skeleton variant="circular" width={32} height={32} />
          <Box>
            <Skeleton width={110} height={14} />
            <Skeleton width={80} height={12} sx={{ mt: 0.5 }} />
          </Box>
        </Box>
      </TableCell>
      <TableCell><Skeleton width={90} height={28} /></TableCell>
      <TableCell><Skeleton width={120} height={22} /></TableCell>
      <TableCell><Skeleton width={80} height={22} /></TableCell>
      <TableCell />
    </TableRow>
  );
}
