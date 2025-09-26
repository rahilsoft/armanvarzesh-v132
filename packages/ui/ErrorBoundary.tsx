import React from 'react';
type State = { hasError: boolean };
export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: any) { console.error('UI ErrorBoundary caught:', err); }
  render() { return this.state.hasError ? (this.props.children ?? null) : (this.props.children as any); }
}
export default ErrorBoundary;
