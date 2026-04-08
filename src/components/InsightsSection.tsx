import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import { BLUE_50, BLUE_600, GRAY_400, GRAY_700, GRAY_900 } from '../constants';
import { useEmployeeInsights } from '../hooks/useEmployeeInsights';

/** Props for `InsightsSection`. */
interface InsightsSectionProps {
  /** Internal database ID of the employee whose insights should be fetched. */
  employeeId: string;
  /** Active consent token forwarded to the insights API request. */
  consentToken: string;
}

/**
 * Collapsible AI insights card rendered inside `EmployeeDetailPanel`.
 * Fetches insights for the given employee and renders the summary text and
 * a confidence progress bar.  Shows skeleton placeholders while loading.
 */
export function InsightsSection({ employeeId, consentToken }: InsightsSectionProps) {
  const { insights, loading, error, retry } = useEmployeeInsights(employeeId, consentToken);

  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        borderRadius: '8px',
        backgroundColor: BLUE_50,
        border: `1px solid ${BLUE_600}22`,
      }}
    >
      {/* Section header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
        <AutoAwesomeIcon sx={{ fontSize: 15, color: BLUE_600 }} />
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: GRAY_900 }}>
          AI Insights
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Skeleton variant="text" width="90%" height={14} />
          <Skeleton variant="text" width="75%" height={14} />
          <Skeleton variant="text" width="82%" height={14} />
          {/* Confidence bar skeleton */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Skeleton variant="text" width={64} height={14} />
            <Skeleton variant="rounded" sx={{ flex: 1 }} height={4} />
            <Skeleton variant="text" width={28} height={14} />
          </Box>
        </Box>
      )}

      {error && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Typography sx={{ fontSize: '0.8125rem', color: 'error.main' }}>
            {error}
          </Typography>
          <Button
            size="small"
            onClick={retry}
            sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'error.main', flexShrink: 0, minWidth: 0, p: 0, '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' } }}
          >
            Retry
          </Button>
        </Box>
      )}

      {insights && !loading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {insights.summary && (
            <Typography sx={{ fontSize: '0.8125rem', color: GRAY_700, lineHeight: 1.5 }}>
              {insights.summary}
            </Typography>
          )}

          {insights.confidence !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Typography sx={{ fontSize: '0.75rem', color: GRAY_400, flexShrink: 0 }}>
                Confidence
              </Typography>
              <Box sx={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: `${BLUE_600}22` }}>
                <Box
                  sx={{
                    width: `${Math.round(insights.confidence * 100)}%`,
                    height: '100%',
                    borderRadius: 2,
                    backgroundColor: BLUE_600,
                  }}
                />
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: GRAY_400, flexShrink: 0 }}>
                {Math.round(insights.confidence * 100)}%
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
