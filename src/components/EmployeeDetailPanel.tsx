import { useState } from 'react';
import type { ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import type { Employee } from '../types';
import {
  WHITE, GRAY_200, GRAY_400, GRAY_500, GRAY_700, GRAY_900,
  BLUE_600, BLUE_700,
  ENABLE_AI_EMPLOYEE_INSIGHTS, OPT_OUT_TOKEN,
} from '../constants';
import { useFeatureFlag } from '../context/FeatureFlags';
import { useConsent } from '../context/ConsentContext';
import { fieldInputSx } from '../styles/fieldInputSx';
import { FieldLabel } from './FieldLabel';
import { AddButton } from './AddButton';
import { StatusChooser } from './StatusChooser';
import { InsightsSection } from './InsightsSection';

// ── Props ──────────────────────────────────────────────────────────────────

interface EmployeeDetailPanelProps {
  employee: Employee;
  onClose: () => void;
}

// ── Component ──────────────────────────────────────────────────────────────

export function EmployeeDetailPanel({ employee, onClose }: EmployeeDetailPanelProps) {
  const [name, setName] = useState(employee.name);
  const [email, setEmail] = useState(employee.email);
  const [trackingStatus, setTrackingStatus] = useState(employee.trackingStatus);
  const [trackingCategory, setTrackingCategory] = useState(employee.trackingCategory);

  const aiInsightsEnabled = useFeatureFlag(ENABLE_AI_EMPLOYEE_INSIGHTS);
  const { consentToken } = useConsent();
  const showInsights = aiInsightsEnabled && consentToken !== null && consentToken !== OPT_OUT_TOKEN;

  function handleStatusChange(status: string, category: string) {
    setTrackingStatus(status);
    setTrackingCategory(category);
  }

  return (
    <Box
      sx={{
        width: 380,
        flexShrink: 0,
        borderLeft: `1px solid ${GRAY_200}`,
        backgroundColor: WHITE,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 1.75,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${GRAY_200}`,
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontWeight: 600, color: GRAY_900, fontSize: '0.9375rem' }}>
          {employee.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.25 }}>
          <IconButton size="small" sx={{ color: GRAY_400, '&:hover': { color: GRAY_700 } }}>
            <OpenInNewIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton size="small" onClick={onClose} sx={{ color: GRAY_400, '&:hover': { color: GRAY_700 } }}>
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Status chooser row */}
      <Box sx={{ px: 3, py: 1.5, borderBottom: `1px solid ${GRAY_200}`, flexShrink: 0 }}>
        <StatusChooser
          status={trackingStatus}
          category={trackingCategory}
          onChange={handleStatusChange}
        />
      </Box>

      {/* Scrollable content */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, pt: 2.5, pb: 2 }}>
        {showInsights && (
          <InsightsSection employeeId={employee.id} consentToken={consentToken} />
        )}

        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: GRAY_900, mb: 2.5 }}>
          Profile Info
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
          {/* UID */}
          <Box>
            <FieldLabel>UID</FieldLabel>
            <TextField
              size="small"
              fullWidth
              defaultValue={employee.uid}
              InputProps={{ readOnly: true }}
              sx={{
                ...fieldInputSx,
                '& .MuiInputBase-input': { py: '6px', px: '10px', color: GRAY_500 },
              }}
            />
          </Box>

          {/* Title */}
          <Box>
            <FieldLabel>Title</FieldLabel>
            <AddButton label="Add Title" />
          </Box>

          <Divider sx={{ borderColor: GRAY_200 }} />

          {/* Name */}
          <Box>
            <FieldLabel>Name</FieldLabel>
            <TextField
              size="small"
              fullWidth
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              sx={fieldInputSx}
            />
          </Box>

          {/* Email */}
          <Box>
            <FieldLabel>Email</FieldLabel>
            <TextField
              size="small"
              fullWidth
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              sx={fieldInputSx}
            />
          </Box>

          {/* Role */}
          <Box>
            <FieldLabel>Role</FieldLabel>
            <AddButton label="Add Role" />
          </Box>

          {/* Location */}
          <Box>
            <FieldLabel>Location</FieldLabel>
            <AddButton label="Add Location" />
          </Box>

          {/* Level */}
          <Box>
            <FieldLabel>Level</FieldLabel>
            <AddButton label="Add Level" />
          </Box>

          {/* Employment Type */}
          <Box>
            <FieldLabel>Employment Type</FieldLabel>
            <AddButton label="Add Employment Type" />
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${GRAY_200}`,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexShrink: 0,
        }}
      >
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: BLUE_600,
            color: WHITE,
            fontSize: '0.8125rem',
            fontWeight: 500,
            textTransform: 'none',
            borderRadius: '6px',
            px: 2,
            py: 0.625,
            boxShadow: 'none',
            '&:hover': { backgroundColor: BLUE_700, boxShadow: 'none' },
          }}
        >
          Save
        </Button>
        <Button
          size="small"
          onClick={onClose}
          sx={{
            color: GRAY_700,
            fontSize: '0.8125rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { backgroundColor: 'transparent', color: GRAY_900 },
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
