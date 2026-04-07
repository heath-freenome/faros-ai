import { Component, useCallback } from 'react';
import type { ErrorInfo, PropsWithChildren, ReactNode } from 'react';

import { useTelemetry } from '../hooks/useTelemetry';
import { DEFAULT_USER_ID } from '../constants';

// ── Inner class component ──────────────────────────────────────────────────

/** Props for `ErrorBoundaryCore`. */
interface ErrorBoundaryCoreProps extends PropsWithChildren {
  /** UI to render in place of the crashed subtree. Defaults to rendering nothing. */
  fallback?: ReactNode;
  /** Called with the caught error and React component stack when an error is caught. */
  onError: (error: Error, info: ErrorInfo) => void;
}

/** Internal state for `ErrorBoundaryCore`. */
interface ErrorBoundaryCoreState {
  /** Whether a render error has been caught and the subtree has crashed. */
  hasError: boolean;
}

/**
 * Class-based React error boundary that delegates error reporting to the
 * `onError` prop. Required to be a class component because React's
 * `componentDidCatch` lifecycle is not available in function components.
 */
class ErrorBoundaryCore extends Component<ErrorBoundaryCoreProps, ErrorBoundaryCoreState> {
  constructor(props: ErrorBoundaryCoreProps) {
    super(props);
    this.state = { hasError: false };
  }

  /** Switches the boundary into the error state so the fallback is rendered on the next pass. */
  static getDerivedStateFromError(): ErrorBoundaryCoreState {
    return { hasError: true };
  }

  /** Delegates the caught error and component stack to the `onError` prop for telemetry. */
  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError(error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

// ── Public component ───────────────────────────────────────────────────────

/** Props for `ErrorBoundary`. */
interface ErrorBoundaryProps extends PropsWithChildren {
  /** UI to render when the subtree crashes. Defaults to rendering nothing. */
  fallback?: ReactNode;
}

/**
 * Drop-in error boundary that catches unhandled render errors in its subtree
 * and automatically sends a telemetry event to the backend via `useTelemetry`.
 * The `sessionId` is injected by `useTelemetry` from `ConsentContext`.
 *
 * Renders `fallback` (or nothing) in place of the crashed subtree.
 * Must be placed inside `ConsentProvider`.
 */
export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const { track } = useTelemetry();

  /**
   * Fires a telemetry event capturing the error message, component stack,
   * and full stack trace. Called by `ErrorBoundaryCore.componentDidCatch`.
   */
  const handleError = useCallback((error: Error, info: ErrorInfo) => {
    track({
      userId: DEFAULT_USER_ID,
      event: 'error.boundary',
      context: info.componentStack || 'unknown',
      details: error.message,
      stackTrace: error.stack,
    });
  }, [track]);

  return (
    <ErrorBoundaryCore onError={handleError} fallback={fallback}>
      {children}
    </ErrorBoundaryCore>
  );
}
