import { useState } from 'react';
import type { ReactNode, ChangeEvent, MouseEvent } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';

import type { Employee } from '../types';
import {
  WHITE, GRAY_50, GRAY_100, GRAY_200, GRAY_300, GRAY_400, GRAY_500, GRAY_600, GRAY_700, GRAY_900,
  GREEN_100, GREEN_700,
  AMBER_100, AMBER_700,
  BLUE_600, BLUE_700,
} from '../constants';

// ── Status option definitions ──────────────────────────────────────────────

interface StatusOption {
  status: string;
  category: string;
  bg: string;
  color: string;
  label: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  { status: 'Included', category: 'Active',   bg: GREEN_100, color: GREEN_700, label: 'Included · Active' },
  { status: 'Included', category: 'Inactive', bg: AMBER_100, color: AMBER_700, label: 'Included · Inactive' },
  { status: 'Ignored',  category: '',         bg: GRAY_100,  color: GRAY_600,  label: 'Ignored' },
];

function getOption(status: string, category: string): StatusOption {
  return (
    STATUS_OPTIONS.find(o => o.status === status && o.category === category) ??
    STATUS_OPTIONS[0]
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: GRAY_500, mb: 0.625 }}>
      {children}
    </Typography>
  );
}

function AddButton({ label }: { label: string }) {
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

const fieldInputSx = {
  '& .MuiOutlinedInput-root': {
    fontSize: '0.8125rem',
    backgroundColor: GRAY_50,
    '& fieldset': { borderColor: GRAY_200 },
    '&:hover fieldset': { borderColor: GRAY_300 },
    '&.Mui-focused fieldset': { borderColor: BLUE_600, borderWidth: '1px' },
  },
  '& .MuiInputBase-input': { py: '6px', px: '10px' },
};

// ── Status chooser ─────────────────────────────────────────────────────────

interface StatusChooserProps {
  status: string;
  category: string;
  onChange: (status: string, category: string) => void;
}

function StatusChooser({ status, category, onChange }: StatusChooserProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const current = getOption(status, category);

  function open(e: MouseEvent<HTMLElement>) {
    setAnchor(e.currentTarget);
  }

  function select(opt: StatusOption) {
    onChange(opt.status, opt.category);
    setAnchor(null);
  }

  return (
    <>
      {/* Trigger — styled as the badge + dropdown arrow */}
      <Box
        onClick={open}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.625,
          px: 1,
          py: 0.375,
          borderRadius: '2px',
          backgroundColor: current.bg,
          color: current.color,
          border: `1px solid ${current.color}40`,
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'filter 0.1s',
          '&:hover': { filter: 'brightness(0.95)' },
        }}
      >
        <PersonIcon sx={{ fontSize: 13 }} />
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1 }}>
          {current.label}
        </Typography>
        <KeyboardArrowDownIcon sx={{ fontSize: 14, ml: 0.25, opacity: 0.7 }} />
      </Box>

      {/* Options popover */}
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          elevation: 2,
          sx: {
            mt: 0.75,
            minWidth: 200,
            borderRadius: '8px',
            border: `1px solid ${GRAY_200}`,
            overflow: 'hidden',
            py: 0.75,
          },
        }}
      >
        <Typography
          sx={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: GRAY_400,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            px: 2,
            pt: 0.75,
            pb: 1,
          }}
        >
          Tracking status
        </Typography>

        {STATUS_OPTIONS.map(opt => {
          const isSelected = opt.status === status && opt.category === category;
          return (
            <Box
              key={opt.label}
              onClick={() => select(opt)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1,
                cursor: 'pointer',
                backgroundColor: isSelected ? GRAY_50 : 'transparent',
                '&:hover': { backgroundColor: GRAY_50 },
              }}
            >
              {/* Badge */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.625,
                  px: 1,
                  py: 0.375,
                  borderRadius: '6px',
                  backgroundColor: opt.bg,
                  color: opt.color,
                  border: `1px solid ${opt.color}40`,
                }}
              >
                <PersonIcon sx={{ fontSize: 13 }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1 }}>
                  {opt.label}
                </Typography>
              </Box>

              {/* Checkmark for selected */}
              {isSelected && (
                <CheckIcon sx={{ fontSize: 15, color: BLUE_600, flexShrink: 0 }} />
              )}
            </Box>
          );
        })}
      </Popover>
    </>
  );
}

// ── Main panel ─────────────────────────────────────────────────────────────

interface EmployeeDetailPanelProps {
  employee: Employee;
  onClose: () => void;
}

export function EmployeeDetailPanel({ employee, onClose }: EmployeeDetailPanelProps) {
  const [name, setName] = useState(employee.name);
  const [email, setEmail] = useState(employee.email);
  const [trackingStatus, setTrackingStatus] = useState(employee.trackingStatus);
  const [trackingCategory, setTrackingCategory] = useState(employee.trackingCategory);

  const uid = employee.uid;

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
              defaultValue={uid}
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
