import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, MapPin, Star, Users } from 'lucide-react'
import { hotelsApi } from '../api/hotels.api'
import { queryKeys } from '../lib/queryClient'
import { formatRating } from '../utils/formatters'
import { PageLoader } from '../components/ui/Spinner'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

export function HotelDetailPage() {
  const { id } = useParams<{ id: string }>()
  const hotelId = Number(id)

  const { data: hotel, isLoading, error } = useQuery({
    queryKey: queryKeys.hotels.detail(hotelId),
    queryFn: () => hotelsApi.getById(hotelId),
    enabled: !isNaN(hotelId),
  })

  if (isLoading) return <PageLoader />

  if (error || !hotel) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Alert variant="error" title="Hotel not found">
          {(error as Error)?.message ?? 'The requested hotel could not be found.'}
        </Alert>
        <Link to="/hotels" className="mt-4 inline-block">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" /> Back to Hotels
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/hotels" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" /> Back to Hotels
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative mb-6 h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-cyan-600 sm:h-80">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl font-bold text-white/20">
                {hotel.location.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900">{hotel.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 text-slate-500">
              <MapPin className="h-4 w-4" />
              {hotel.location}
            </span>
            {hotel.rating != null && hotel.rating > 0 && (
              <Badge variant="info">
                <Star className="mr-1 inline h-3 w-3 fill-amber-400 text-amber-400" />
                {formatRating(hotel.rating)}
                {hotel.ratingCount ? ` (${hotel.ratingCount} reviews)` : ''}
              </Badge>
            )}
          </div>
          <p className="mt-4 text-slate-600">{hotel.address}</p>

          <Card className="mt-6">
            <h2 className="font-semibold text-slate-900">About this property</h2>
            <p className="mt-2 text-sm text-slate-600">
              Experience exceptional hospitality at {hotel.name}, located in the heart of{' '}
              {hotel.location}. Book your stay through our microservices-powered reservation
              system with guaranteed idempotent confirmations.
            </p>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <h2 className="text-lg font-semibold text-slate-900">Book your stay</h2>
            <p className="mt-1 text-sm text-slate-500">
              Reserve via Hotel Booking Service with distributed locking
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Hotel ID</span>
                <span className="font-medium">#{hotel.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Location</span>
                <span className="font-medium">{hotel.location}</span>
              </div>
            </div>
            <Link to={`/book/${hotel.id}`} className="mt-6 block">
              <Button className="w-full" size="lg">
                <Users className="h-5 w-5" />
                Book Now
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
