
import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  tieneError: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      tieneError: false,
    };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      tieneError: true,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      "Error capturado por ErrorBoundary:",
      error,
      info.componentStack
    );
  }

  render() {
    if (this.state.tieneError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
