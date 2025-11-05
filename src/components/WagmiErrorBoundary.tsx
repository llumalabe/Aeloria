'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onError: () => void;
}

interface State {
  hasError: boolean;
}

export class WagmiErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('WagmiErrorBoundary caught error:', error);
    console.error('Error info:', errorInfo);
    // Notify parent component
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null; // Return nothing, let parent handle fallback
    }

    return this.props.children;
  }
}
