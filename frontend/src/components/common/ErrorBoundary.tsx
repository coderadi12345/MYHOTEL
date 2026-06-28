import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '../ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="mb-4 h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold text-slate-900">Something went wrong</h2>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
