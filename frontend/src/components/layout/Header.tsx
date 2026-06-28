import { Link, useLocation } from 'react-router-dom'
import { Building2, Menu, Shield, User, LogOut, X } from 'lucide-react'
import { APP_NAME, PUBLIC_NAV_ITEMS, USER_NAV_ITEMS, ADMIN_NAV_ITEMS } from '../../utils/constants'
import { cn } from '../../utils/cn'
import { useAuthStore, useUiStore } from '../../stores'
import { Button } from '../ui/Button'
import type { UserRole } from '../../types/user.types'

function getNavItems(role?: UserRole) {
  if (role === 'admin') return ADMIN_NAV_ITEMS
  if (role === 'user') return USER_NAV_ITEMS
  return PUBLIC_NAV_ITEMS
}

export function Header() {
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUiStore()

  const role = user?.role ?? (isAuthenticated ? 'user' : undefined)
  const navItems = getNavItems(role)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to={role === 'admin' ? '/admin/dashboard' : '/'} className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg',
                role === 'admin' ? 'bg-slate-900' : 'bg-primary-600'
              )}
            >
              {role === 'admin' ? (
                <Shield className="h-5 w-5 text-white" />
              ) : (
                <Building2 className="h-5 w-5 text-white" />
              )}
            </div>
            <span className="text-xl font-bold text-slate-900">{APP_NAME}</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                location.pathname === item.path ||
                  (item.path !== '/' && location.pathname.startsWith(item.path))
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 sm:flex">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full',
                    role === 'admin' ? 'bg-slate-900' : 'bg-primary-100'
                  )}
                >
                  {role === 'admin' ? (
                    <Shield className="h-4 w-4 text-white" />
                  ) : (
                    <User className="h-4 w-4 text-primary-700" />
                  )}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs capitalize text-slate-500">{role} · ID {user.id}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>

      {sidebarOpen && (
        <nav className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'block rounded-lg px-3 py-2.5 text-sm font-medium',
                location.pathname === item.path
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
