import { useNavigate } from 'react-router-dom'
import { CalendarCheck } from 'lucide-react'
import { useBookingStore } from '../stores'
import { PageHeader } from '../components/common/PageHeader'
import { BookingCard } from '../components/bookings/BookingCard'
import { EmptyState } from '../components/common/EmptyState'
import { Button } from '../components/ui/Button'
import { Link } from 'react-router-dom'

export function MyBookingsPage() {
  const navigate = useNavigate()
  const bookings = useBookingStore((s) => s.bookings)

  const pending = bookings.filter((b) => b.status === 'PENDING').length
  const confirmed = bookings.filter((b) => b.status === 'CONFIRMED').length

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="My Bookings"
        description="Stored locally — Booking Service has no list endpoint yet"
        action={
          <Link to="/hotels">
            <Button>New Booking</Button>
          </Link>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total', value: bookings.length },
          { label: 'Pending', value: pending },
          { label: 'Confirmed', value: confirmed },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {bookings.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {bookings.map((booking) => (
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
          description="Browse hotels and create your first reservation through the two-step booking flow."
          action={
            <Link to="/hotels">
              <Button>Browse Hotels</Button>
            </Link>
          }
        />
      )}
    </div>
  )
}
