import React, { Component } from 'react';

/**
 * WidgetErrorBoundary Component
 * React Error Boundary specifically designed to isolate widget rendering errors.
 * Displays a localized fallback UI without breaking the parent layout.
 */
export class WidgetErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('WidgetErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-6 m-2 border border-rose-200 dark:border-rose-900/50 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 text-center min-h-[160px]">
          <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h4 className="text-sm font-semibold text-rose-800 dark:text-rose-300">
            Failed to load data
          </h4>

          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400/80 max-w-xs">
            {this.props.message || 'An error occurred while loading this widget component.'}
          </p>

          <button
            type="button"
            onClick={this.handleReset}
            className="mt-4 px-3 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/40 dark:hover:bg-rose-900/70 rounded-md transition-colors duration-150 cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WidgetErrorBoundary;
