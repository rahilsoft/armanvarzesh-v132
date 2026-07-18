import React from 'react';
type State = { hasError: boolean };
export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: any) { console.error('UI ErrorBoundary caught:', err); }
  render() {
    // Rendering children again after an error just re-throws it; the whole
    // point of the boundary is to swap in a fallback.
    if (this.state.hasError) {
      return (
        <div role="alert" dir="rtl" style={{ padding: 16 }}>
          خطایی رخ داد. لطفاً صفحه را دوباره بارگیری کنید.
        </div>
      );
    }
    return this.props.children as any;
  }
}
export default ErrorBoundary;
