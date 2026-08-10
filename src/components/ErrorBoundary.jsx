import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-on-background px-4">
          <div className="bg-surface-container-low p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-outline-variant/30">
            <div className="w-16 h-16 bg-error-container text-on-error-container rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[32px]">warning</span>
            </div>
            <h1 className="font-headline-md text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="font-body-md text-on-surface-variant mb-6">
              We encountered an unexpected error. Our team has been notified.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-stitch-primary text-on-primary rounded-xl font-label-md hover:bg-stitch-primary/90 transition-colors"
              >
                Reload Page
              </button>
              <Link 
                to="/"
                className="w-full py-3 bg-surface text-stitch-primary rounded-xl font-label-md border border-stitch-primary/20 hover:bg-surface-variant transition-colors"
                onClick={() => this.setState({ hasError: false })}
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
