import { APP_NAME } from '../../utils/constants'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{APP_NAME}</h3>
            <p className="mt-2 text-sm text-slate-500">
              Enterprise microservices hotel booking platform powered by PlainAPI,
              Booking Service, and Notification Service.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-slate-900">Services</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-500">
              <li>PlainAPI — Hotel Catalog (Port 3002)</li>
              <li>Booking Service — Reservations (Port 3000)</li>
              <li>Notification Service — Email Queue (Port 3001)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-900">Tech Stack</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-500">
              <li>React + TypeScript + Vite</li>
              <li>Zustand State Management</li>
              <li>TanStack Query + Axios</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} {APP_NAME}. Microservices Architecture Demo.
        </div>
      </div>
    </footer>
  )
}
