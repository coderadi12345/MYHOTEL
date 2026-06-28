import { useNavigate, useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { hotelsApi } from '../api/hotels.api'
import { bookingsApi } from '../api/bookings.api'
import { queryKeys } from '../lib/queryClient'
import { useAuthStore, useBookingStore, useUiStore } from '../stores'
import { BookingStepper } from '../components/bookings/BookingStepper'
import { PageLoader } from '../components/ui/Spinner'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'

const bookingSchema = z.object({
  totalGuests: z.number().min(1, 'At least 1 guest required'),
  bookingAmount: z.number().min(1, 'Amount must be at least 1'),
})

type BookingFormData = z.infer<typeof bookingSchema>

const STEPS = [
  { label: 'Details', description: 'Guest & amount' },
  { label: 'Review', description: 'Confirm booking' },
  { label: 'Confirm', description: 'Email verification' },
]

export function BookingPage() {
  const { hotelId: hotelIdParam } = useParams<{ hotelId: string }>()
  const hotelId = Number(hotelIdParam)
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { addBooking, setPendingIdempotencyKey, setDraft } = useBookingStore()
  const { showToast } = useUiStore()

  const { data: hotel, isLoading, error } = useQuery({
    queryKey: queryKeys.hotels.detail(hotelId),
    queryFn: () => hotelsApi.getById(hotelId),
    enabled: !isNaN(hotelId),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { totalGuests: 2, bookingAmount: 5000 },
  })

  const createMutation = useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: (response, variables) => {
      addBooking({
        bookingId: response.bookingId,
        idempotencyKey: response.idempotencyKey,
        hotelId: variables.hotelId,
        hotelName: hotel!.name,
        totalGuests: variables.totalGuests,
        bookingAmount: variables.bookingAmount,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      })
      setPendingIdempotencyKey(response.idempotencyKey)
      showToast('Booking created! Complete confirmation with your email.', 'success')
      navigate(`/bookings/confirm/${response.idempotencyKey}`)
    },
    onError: (err: Error) => {
      showToast(err.message, 'error')
    },
  })

  const onSubmit = (data: BookingFormData) => {
    if (!isAuthenticated || !user) {
      showToast('Please sign in to book', 'error')
      navigate('/login')
      return
    }

    setDraft({
      hotelId,
      hotelName: hotel!.name,
      totalGuests: data.totalGuests,
      bookingAmount: data.bookingAmount,
    })

    createMutation.mutate({
      userId: user.id,
      hotelId,
      totalGuests: data.totalGuests,
      bookingAmount: data.bookingAmount,
    })
  }

  if (isLoading) return <PageLoader />

  if (error || !hotel) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Alert variant="error">{(error as Error)?.message ?? 'Hotel not found'}</Alert>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <BookingStepper steps={STEPS} currentStep={0} />

      <Card>
        <h1 className="text-xl font-bold text-slate-900">Book {hotel.name}</h1>
        <p className="mt-1 text-sm text-slate-500">{hotel.location} · {hotel.address}</p>

        {!isAuthenticated && (
          <Alert variant="warning" title="Sign in required" className="mt-4">
            You need to{' '}
            <Link to="/login" className="font-medium underline">
              sign in
            </Link>{' '}
            before creating a booking.
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input
            label="Total Guests"
            id="totalGuests"
            type="number"
            min="1"
            error={errors.totalGuests?.message}
            {...register('totalGuests', { valueAsNumber: true })}
          />
          <Input
            label="Booking Amount (INR)"
            id="bookingAmount"
            type="number"
            min="1"
            error={errors.bookingAmount?.message}
            {...register('bookingAmount', { valueAsNumber: true })}
          />

          {isAuthenticated && user && (
            <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              Booking as <strong>{user.name}</strong> (User ID: {user.id})
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Link to={`/hotels/${hotelId}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" loading={createMutation.isPending} className="flex-1">
              Create Booking
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
