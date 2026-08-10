import React from 'react';

class PreviewErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Preview Error Boundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-surface text-on-surface p-4 rounded-xl border border-error/30 bg-error-container/10">
          <span className="material-symbols-outlined text-error text-[48px] mb-2">error</span>
          <h3 className="font-headline-sm font-bold text-error mb-1">Preview Render Error</h3>
          <p className="font-body-sm text-on-surface-variant text-center mb-4 max-w-xs">
            We encountered an issue rendering this preview. The data might be malformed.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-error text-on-error rounded-lg font-label-md hover:bg-error/90 transition-colors"
          >
            Retry Render
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default PreviewErrorBoundary;
