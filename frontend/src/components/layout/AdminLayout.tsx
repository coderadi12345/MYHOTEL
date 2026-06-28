import { Link, Outlet, useLocation } from 'react-router-dom'
import { Building2, LayoutDashboard, Server, Shield } from 'lucide-react'
import { ADMIN_SIDEBAR_ITEMS, APP_NAME } from '../../utils/constants'
import { cn } from '../../utils/cn'

const iconMap = {
  LayoutDashboard,
  Building2,
  Server,
}

export function AdminLayout() {
  const location = useLocation()

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100">
      <div className="border-b border-slate-200 bg-slate-900 px-4 py-3 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">{APP_NAME} Admin</p>
            <p className="text-xs text-slate-400">Platform management console</p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1">
            {ADMIN_SIDEBAR_ITEMS.map((item) => {
              const Icon = iconMap[item.icon]
              const active =
                location.pathname === item.path ||
                (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path))

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-white text-primary-700 shadow-sm'
                      : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
