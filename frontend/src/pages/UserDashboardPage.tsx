import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CalendarCheck,
  Clock,
  Hotel,
  MapPin,
  User as UserIcon,
} from 'lucide-react'
import { useAuthStore, useBookingStore } from '../stores'
import { PageHeader } from '../components/common/PageHeader'
import { BookingCard } from '../components/bookings/BookingCard'
import { Card, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge, statusBadgeVariant } from '../components/ui/Badge'
import { EmptyState } from '../components/common/EmptyState'
import { formatCurrency } from '../utils/formatters'

export function UserDashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const bookings = useBookingStore((s) => s.bookings)

  const pending = bookings.filter((b) => b.status === 'PENDING')
  const confirmed = bookings.filter((b) => b.status === 'CONFIRMED')
  const totalSpent = confirmed.reduce((sum, b) => sum + b.bookingAmount, 0)

  const stats = [
    {
      label: 'Total Bookings',
      value: bookings.length,
      icon: CalendarCheck,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Pending',
      value: pending.length,
      icon: Clock,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Confirmed',
      value: confirmed.length,
      icon: Hotel,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      label: 'Total Spent',
      value: formatCurrency(totalSpent),
      icon: MapPin,
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={`Welcome back, ${user?.name ?? 'Guest'}`}
        description="Your personal booking overview"
        action={
          <Link to="/hotels">
            <Button>
              Browse Hotels <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        }
      />

      <Card className="mb-8 border-primary-100 bg-gradient-to-r from-primary-50 to-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
              <UserIcon className="h-7 w-7 text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{user?.name}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <Badge variant="info" className="mt-1">
                User ID: {user?.id}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/bookings">
              <Button variant="outline" size="sm">
                All Bookings
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-xl font-bold text-slate-900">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Bookings</h2>
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.slice(0, 4).map((booking) => (
                <BookingCard
                  key={booking.bookingId}
                  booking={booking}
                  onConfirm={
                    booking.status === 'PENDING'
                      ? () => navigate(`/bookings/confirm/${booking.idempotencyKey}`)
                      : undefined
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CalendarCheck}
              title="No bookings yet"
              description="Start exploring hotels and make your first reservation."
              action={
                <Link to="/hotels">
                  <Button>Browse Hotels</Button>
                </Link>
              }
            />
          )}
        </div>

        <Card>
          <CardTitle>Pending Confirmations</CardTitle>
          <CardDescription>Bookings awaiting email confirmation</CardDescription>
          <div className="mt-4 space-y-3">
            {pending.length > 0 ? (
              pending.map((b) => (
                <div
                  key={b.bookingId}
                  className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">{b.hotelName}</p>
                    <p className="text-xs text-slate-500">#{b.bookingId}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={statusBadgeVariant(b.status)}>{b.status}</Badge>
                    <button
                      onClick={() => navigate(`/bookings/confirm/${b.idempotencyKey}`)}
                      className="mt-1 block text-xs font-medium text-primary-600 hover:text-primary-700"
                    >
                      Confirm now →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-sm text-slate-400">No pending bookings</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
