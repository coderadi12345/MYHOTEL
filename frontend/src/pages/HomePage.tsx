import { Link } from 'react-router-dom'
import { ArrowRight, Building2, CalendarCheck, Mail, Server, Shield } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { hotelsApi } from '../api/hotels.api'
import { queryKeys } from '../lib/queryClient'
import { APP_NAME, APP_TAGLINE } from '../utils/constants'
import { Button } from '../components/ui/Button'
import { HotelCard } from '../components/hotels/HotelCard'
import { ServiceStatusPanel } from '../components/common/ServiceStatusPanel'
import { HotelCardSkeleton } from '../components/ui/Skeleton'

export function HomePage() {
  const { data: hotels, isLoading } = useQuery({
    queryKey: queryKeys.hotels.all,
    queryFn: hotelsApi.getAll,
  })

  const featured = hotels?.slice(0, 3) ?? []

  return (
    <div>
      <section className="gradient-hero px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-blue-200">
              Microservices Platform
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {APP_NAME}
            </h1>
            <p className="mt-4 text-lg text-blue-100">{APP_TAGLINE}</p>
            <p className="mt-2 text-blue-200">
              Browse hotels, create reservations, and receive email confirmations — powered by
              three independent backend services.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/hotels">
                <Button size="lg" className="bg-white text-primary-700 hover:bg-blue-50">
                  Explore Hotels
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">
          Platform Architecture
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Building2,
              title: 'PlainAPI',
              desc: 'Hotel catalog with full CRUD, soft deletes, and Sequelize ORM on MySQL.',
            },
            {
              icon: CalendarCheck,
              title: 'Booking Service',
              desc: 'Two-step booking flow with Redlock, idempotency keys, and Prisma ORM.',
            },
            {
              icon: Mail,
              title: 'Notification Service',
              desc: 'Async email delivery via BullMQ workers and Handlebars templates.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <Icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-100 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Featured Hotels</h2>
              <p className="text-slate-500">Handpicked from our catalog</p>
            </div>
            <Link to="/hotels" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View all →
            </Link>
          </div>
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <HotelCardSkeleton key={i} />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500">No hotels available yet. Add some in Admin.</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <ServiceStatusPanel />
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Server className="h-6 w-6 text-primary-600" />
                <h3 className="text-lg font-semibold">Frontend Stack</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• React 18 + TypeScript + Vite</li>
                <li>• Zustand for global state management</li>
                <li>• TanStack Query for server state & caching</li>
                <li>• React Hook Form + Zod validation</li>
                <li>• React Router v6 for navigation</li>
                <li>• Tailwind CSS for styling</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary-600" />
                <h3 className="text-lg font-semibold">Booking Flow</h3>
              </div>
              <ol className="space-y-2 text-sm text-slate-600">
                <li>1. Select a hotel and enter guest details</li>
                <li>2. Create a PENDING booking via Booking Service</li>
                <li>3. Confirm with email to trigger notification</li>
                <li>4. Notification Service sends confirmation email via BullMQ</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
