import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { AppRouter } from './routes/AppRouter'
import { ErrorBoundary } from './components/common/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
