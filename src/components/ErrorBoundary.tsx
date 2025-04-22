import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.error('App crashed:', error, info);
    
    // More detailed logging
    if (error.message?.includes('undefined has no properties')) {
      console.error('⚠️ Null/undefined value accessed. Stack trace:', error.stack);
      
      // Log additional context
      console.error('Current component state:', this.state);
      
      // Log additional environment details that might help debug
      if (typeof window !== 'undefined') {
        console.error('Window location:', window.location.href);
        console.error('User Agent:', navigator.userAgent);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black text-center p-8">
          <h2 className="text-3xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-4">An unexpected error occurred. Please try refreshing the page.</p>
          <button className="px-6 py-2 rounded-full bg-gradient-to-r from-[#007FFF] to-[#00D9FF] text-white font-semibold" onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
