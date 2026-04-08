import { Component, useCallback } from 'react';
import type { ErrorInfo, PropsWithChildren, ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { useTelemetry } from '../hooks/useTelemetry';
import { DEFAULT_USER_ID, GRAY_400, GRAY_700, GRAY_900 } from '../constants';

// ── Problem ID generation ──────────────────────────────────────────────────

/**
 * Generates a human-readable problem ID in the form `ERR-NNNNNNNN`,
 * e.g. `ERR-84729163`. Easy to quote in support requests and search in logs.
 */
function generateProblemId(): string {
  const num = Math.floor(10_000_000 + Math.random() * 90_000_000);
  return `ERR-${num}`;
}

// ── Inner class component ──────────────────────────────────────────────────

/** Props for `ErrorBoundaryCore`. */
interface ErrorBoundaryCoreProps extends PropsWithChildren {
  /**
   * Called with the caught error, React component stack, and the generated
   * problem ID when an error is caught. Used to report telemetry.
   */
  onError: (error: Error, info: ErrorInfo, problemId: string) => void;
}

/** Internal state for `ErrorBoundaryCore`. */
interface ErrorBoundaryCoreState {
  /** Whether a render error has been caught and the subtree has crashed. */
  hasError: boolean;
  /**
   * Unique identifier generated at the moment the error is caught.
   * Shown to the user and included in telemetry so support can correlate reports.
   */
  problemId: string | null;
}

/**
 * Class-based React error boundary that catches render errors, generates a
 * unique problem ID, and delegates reporting to the `onError` prop.
 * Required to be a class component because React's `componentDidCatch`
 * lifecycle is not available in function components.
 */
class ErrorBoundaryCore extends Component<ErrorBoundaryCoreProps, ErrorBoundaryCoreState> {
  constructor(props: ErrorBoundaryCoreProps) {
    super(props);
    this.state = { hasError: false, problemId: null };
  }

  /**
   * Switches to the error state and generates a unique problem ID.
   * Runs before `componentDidCatch` so the ID is available in both the
   * fallback UI and the telemetry call.
   */
  static getDerivedStateFromError(): ErrorBoundaryCoreState {
    return { hasError: true, problemId: generateProblemId() };
  }

  /** Passes the caught error, component stack, and problem ID to `onError` for telemetry. */
  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError(error, info, this.state.problemId!);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorFallback problemId={this.state.problemId!} />;
    }
    return this.props.children;
  }
}

// ── Fallback UI ────────────────────────────────────────────────────────────

/** Props for `ErrorFallback`. */
interface ErrorFallbackProps {
  /** The unique problem ID to display to the user for support reference. */
  problemId: string;
}

/**
 * Full-page fallback rendered by `ErrorBoundaryCore` when the subtree crashes.
 * Displays a short explanation, the problem ID for support, and a reload button.
 */
function ErrorFallback({ problemId }: ErrorFallbackProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 2,
        px: 3,
        textAlign: 'center',
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 40, color: 'error.main', mb: 0.5 }} />

      <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: GRAY_900 }}>
        Something went wrong
      </Typography>

      <Typography sx={{ fontSize: '0.875rem', color: GRAY_700, maxWidth: 420 }}>
        An unexpected error occurred and this part of the page could not be displayed.
        If the problem persists, please contact support with the problem ID below.
      </Typography>

      <Box
        sx={{
          px: 2,
          py: 1,
          borderRadius: '6px',
          backgroundColor: 'grey.100',
          border: '1px solid',
          borderColor: 'grey.300',
        }}
      >
        <Typography sx={{ fontSize: '0.75rem', color: GRAY_400, mb: 0.25 }}>
          Problem ID
        </Typography>
        <Typography
          sx={{ fontSize: '0.8125rem', fontFamily: 'monospace', color: GRAY_700, letterSpacing: '0.03em' }}
        >
          {problemId}
        </Typography>
      </Box>

      <Button
        variant="contained"
        size="small"
        onClick={() => window.location.reload()}
        sx={{ mt: 0.5, textTransform: 'none', fontWeight: 500 }}
      >
        Reload Page
      </Button>
    </Box>
  );
}

// ── Public component ───────────────────────────────────────────────────────

/** Props for `ErrorBoundary`. */
type ErrorBoundaryProps = PropsWithChildren;

/**
 * Drop-in error boundary that catches unhandled render errors in its subtree,
 * generates a unique problem ID, displays a user-friendly fallback with a
 * reload button, and fires a telemetry event via `useTelemetry`.
 *
 * The problem ID is shown to the user and included in telemetry so errors
 * can be correlated between user reports and backend logs.
 * Must be placed inside `ConsentProvider`.
 *
 * **Telemetry**
 * | Event | When | `details` |
 * |---|---|---|
 * | `error.boundary` | Unhandled render error caught | `{ problemId, message }` |
 */
export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const { track } = useTelemetry();

  /**
   * Fires a telemetry event including the problem ID, error message, component
   * stack, and full stack trace. Called by `ErrorBoundaryCore.componentDidCatch`.
   */
  const handleError = useCallback((error: Error, info: ErrorInfo, problemId: string) => {
    track({
      userId: DEFAULT_USER_ID,
      event: 'error.boundary',
      context: info.componentStack || 'unknown',
      details: JSON.stringify({ problemId, message: error.message }),
      stackTrace: error.stack,
    });
  }, [track]);

  return (
    <ErrorBoundaryCore onError={handleError}>
      {children}
    </ErrorBoundaryCore>
  );
}
