import {
  Component,
  type ErrorInfo,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { Button } from "../Button";
import styles from "./ErrorBoundary.module.css";

interface ErrorBoundaryRenderProps {
  error: Error;
  reset: () => void;
}

interface ErrorBoundaryProps extends PropsWithChildren {
  fallback?: ReactNode | ((props: ErrorBoundaryRenderProps) => ReactNode);
  onReset?: () => void;
  resetKeys?: unknown[];
}

interface ErrorBoundaryState {
  error: Error | null;
}

function didResetKeysChange(
  previousResetKeys: unknown[] = [],
  nextResetKeys: unknown[] = [],
) {
  if (previousResetKeys.length !== nextResetKeys.length) {
    return true;
  }

  return previousResetKeys.some((resetKey, index) => {
    return !Object.is(resetKey, nextResetKeys[index]);
  });
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public override state: ErrorBoundaryState = {
    error: null,
  };

  public static getDerivedStateFromError(error: Error) {
    return {
      error,
    };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unexpected React error", error, errorInfo);
  }

  public override componentDidUpdate(previousProps: ErrorBoundaryProps) {
    if (
      this.state.error &&
      didResetKeysChange(previousProps.resetKeys, this.props.resetKeys)
    ) {
      this.reset();
    }
  }

  private reset = () => {
    this.props.onReset?.();
    this.setState({
      error: null,
    });
  };

  public override render(): ReactNode {
    if (this.state.error) {
      if (typeof this.props.fallback === "function") {
        return this.props.fallback({
          error: this.state.error,
          reset: this.reset,
        });
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <h1>Something went wrong</h1>
            <p>
              The UI crashed unexpectedly. Refresh the page to continue
              exploring movies.
            </p>
            <Button onClick={() => window.location.assign("/")}>
              Reload app
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
