import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores'
import type { UserRole } from '../types/user.types'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Link } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (requiredRole && (user.role ?? 'user') !== requiredRole) {
    const redirect = (user.role ?? 'user') === 'admin' ? '/admin/dashboard' : '/dashboard'
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <Alert variant="error" title="Access denied">
          You don't have permission to view this page.
        </Alert>
        <Link to={redirect} className="mt-4 inline-block">
          <Button>Go to your dashboard</Button>
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
