import { Server, Database, Mail, Lock, GitBranch, Layers } from 'lucide-react'
import { SERVICES } from '../utils/constants'
import { PageHeader } from '../components/common/PageHeader'
import { ServiceStatusPanel } from '../components/common/ServiceStatusPanel'
import { Card, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

const ARCHITECTURE = [
  {
    icon: Layers,
    title: 'Frontend (React)',
    port: 5173,
    stack: 'React, Zustand, TanStack Query, Tailwind',
    role: 'User interface, state management, API orchestration',
  },
  {
    icon: Server,
    title: 'PlainAPI',
    port: 3002,
    stack: 'Express, Sequelize, MySQL, Zod',
    role: 'Hotel catalog CRUD with soft deletes',
  },
  {
    icon: Database,
    title: 'Booking Service',
    port: 3000,
    stack: 'Express, Prisma, MySQL, Redlock, BullMQ',
    role: 'Reservations with idempotency & distributed locks',
  },
  {
    icon: Mail,
    title: 'Notification Service',
    port: 3001,
    stack: 'Express, BullMQ, Handlebars, Gmail SMTP',
    role: 'Async email worker consuming queue-mailer',
  },
]

export function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Microservices"
        description="Architecture overview of the MYHOTEL platform"
      />

      <div className="mb-8">
        <ServiceStatusPanel />
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        {ARCHITECTURE.map(({ icon: Icon, title, port, stack, role }) => (
          <Card key={title} hover>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-100">
                <Icon className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>{title}</CardTitle>
                  <Badge variant="info">:{port}</Badge>
                </div>
                <p className="mt-1 text-xs text-primary-600">{stack}</p>
                <CardDescription className="mt-2">{role}</CardDescription>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mb-8">
        <CardTitle>Communication Flow</CardTitle>
        <div className="mt-4 space-y-4 text-sm text-slate-600">
          <div className="flex items-start gap-3">
            <GitBranch className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
            <div>
              <p className="font-medium text-slate-900">Synchronous (HTTP)</p>
              <p>Frontend → PlainAPI for hotel data</p>
              <p>Frontend → Booking Service for create/confirm bookings</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Lock className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
            <div>
              <p className="font-medium text-slate-900">Distributed Locking</p>
              <p>Redlock on hotel:{`{hotelId}`} during booking creation prevents race conditions</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
            <div>
              <p className="font-medium text-slate-900">Asynchronous (BullMQ + Redis)</p>
              <p>Booking Service enqueues to queue-mailer → Notification Service worker sends email</p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>API Endpoints Reference</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-2 font-medium text-slate-700">Service</th>
                <th className="pb-2 font-medium text-slate-700">Endpoint</th>
                <th className="pb-2 font-medium text-slate-700">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {[
                ...SERVICES.map((s) => ({
                  service: s.name,
                  endpoint: `${s.apiPrefix}/ping`,
                  method: 'GET',
                })),
                { service: 'PlainAPI', endpoint: '/hotel-api/hotels', method: 'GET/POST' },
                { service: 'PlainAPI', endpoint: '/hotel-api/hotels/:id', method: 'GET/PATCH/DELETE' },
                { service: 'Hotel Booking Service', endpoint: '/booking-api/bookings', method: 'POST' },
                {
                  service: 'Hotel Booking Service',
                  endpoint: '/booking-api/bookings/confirm/:key',
                  method: 'POST',
                },
              ].map((row, i) => (
                <tr key={i}>
                  <td className="py-2 text-slate-600">{row.service}</td>
                  <td className="py-2 text-primary-700">{row.endpoint}</td>
                  <td className="py-2">
                    <Badge variant="default">{row.method}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
