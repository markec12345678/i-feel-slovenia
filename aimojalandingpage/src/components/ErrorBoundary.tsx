import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="fixed bottom-6 right-6 w-96 bg-red-900/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-red-700 p-4 z-50">
          <div className="flex items-center gap-3 text-red-200">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-semibold">Napaka v AI Planerju</h4>
              <p className="text-sm text-red-300">Prosimo osvežite stran in poskusite znova.</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
