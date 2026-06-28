import { useParams, useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle } from 'lucide-react'
import { bookingsApi } from '../api/bookings.api'
import { useBookingStore, useAuthStore, useUiStore } from '../stores'
import { BookingStepper } from '../components/bookings/BookingStepper'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { Alert } from '../components/ui/Alert'
import { formatCurrency } from '../utils/formatters'

const confirmSchema = z.object({
  userEmail: z.string().email('Valid email required'),
})

type ConfirmFormData = z.infer<typeof confirmSchema>

const STEPS = [
  { label: 'Details', description: 'Guest & amount' },
  { label: 'Review', description: 'Confirm booking' },
  { label: 'Confirm', description: 'Email verification' },
]

export function BookingConfirmPage() {
  const { idempotencyKey } = useParams<{ idempotencyKey: string }>()
  const navigate = useNavigate()
  const { bookings, updateBookingStatus, clearDraft, pendingIdempotencyKey } = useBookingStore()
  const { user } = useAuthStore()
  const { showToast } = useUiStore()

  const booking = bookings.find((b) => b.idempotencyKey === idempotencyKey)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmSchema),
    defaultValues: { userEmail: user?.email ?? '' },
  })

  const confirmMutation = useMutation({
    mutationFn: (data: ConfirmFormData) =>
      bookingsApi.confirm(idempotencyKey!, data),
    onSuccess: (response, variables) => {
      updateBookingStatus(response.bookingId, response.status, variables.userEmail)
      clearDraft()
      showToast('Booking confirmed! Confirmation email queued.', 'success')
      navigate('/bookings')
    },
    onError: (err: Error) => {
      showToast(err.message, 'error')
    },
  })

  if (!idempotencyKey || (!booking && !pendingIdempotencyKey)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Alert variant="error" title="Booking not found">
          This booking session was not found. It may have expired.
        </Alert>
        <Link to="/hotels" className="mt-4 inline-block">
          <Button>Browse Hotels</Button>
        </Link>
      </div>
    )
  }

  if (booking?.status === 'CONFIRMED') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Already Confirmed</h1>
        <p className="mt-2 text-slate-500">Booking #{booking.bookingId} is confirmed.</p>
        <Link to="/bookings" className="mt-6 inline-block">
          <Button>View My Bookings</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <BookingStepper steps={STEPS} currentStep={2} />

      <Card>
        <h1 className="text-xl font-bold text-slate-900">Confirm Your Booking</h1>
        <p className="mt-1 text-sm text-slate-500">
          Step 2 of the booking flow — triggers Notification Service email
        </p>

        {booking && (
          <div className="mt-4 rounded-lg bg-slate-50 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Hotel</span>
              <span className="font-medium">{booking.hotelName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Guests</span>
              <span className="font-medium">{booking.totalGuests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount</span>
              <span className="font-medium">{formatCurrency(booking.bookingAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Booking ID</span>
              <span className="font-medium">#{booking.bookingId}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit((data) => confirmMutation.mutate(data))} className="mt-6 space-y-4">
          <Input
            label="Email for confirmation"
            id="userEmail"
            type="email"
            placeholder="you@example.com"
            error={errors.userEmail?.message}
            {...register('userEmail')}
          />
          <Alert variant="info">
            A confirmation email will be sent via the Notification Service (BullMQ queue).
          </Alert>
          <Button type="submit" loading={confirmMutation.isPending} className="w-full" size="lg">
            Confirm Booking
          </Button>
        </form>
      </Card>
    </div>
  )
}
