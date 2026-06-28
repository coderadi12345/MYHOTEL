import { Calendar, Hash, Mail, Users } from 'lucide-react'
import type { StoredBooking } from '../../types/booking.types'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { Card } from '../ui/Card'
import { Badge, statusBadgeVariant } from '../ui/Badge'

interface BookingCardProps {
  booking: StoredBooking
  onConfirm?: () => void
}

export function BookingCard({ booking, onConfirm }: BookingCardProps) {
  return (
    <Card hover>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-900">{booking.hotelName}</h3>
          <p className="mt-1 text-sm text-slate-500">Booking #{booking.bookingId}</p>
        </div>
        <Badge variant={statusBadgeVariant(booking.status)}>{booking.status}</Badge>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Users className="h-4 w-4 text-slate-400" />
          {booking.totalGuests} guest{booking.totalGuests !== 1 ? 's' : ''}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Hash className="h-4 w-4 text-slate-400" />
          {formatCurrency(booking.bookingAmount)}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="h-4 w-4 text-slate-400" />
          {formatDate(booking.createdAt)}
        </div>
        {booking.userEmail && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Mail className="h-4 w-4 text-slate-400" />
            {booking.userEmail}
          </div>
        )}
      </div>

      {booking.status === 'PENDING' && onConfirm && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <button
            onClick={onConfirm}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Complete confirmation →
          </button>
        </div>
      )}
    </Card>
  )
}
