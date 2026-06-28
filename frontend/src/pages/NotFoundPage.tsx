import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-bold text-slate-200">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-500">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6">
        <Button>
          <Home className="h-4 w-4" /> Back to Home
        </Button>
      </Link>
    </div>
  )
}
