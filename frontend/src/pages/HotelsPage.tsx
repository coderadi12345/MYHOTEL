import { useQuery } from '@tanstack/react-query'
import { Building2 } from 'lucide-react'
import { hotelsApi } from '../api/hotels.api'
import { queryKeys } from '../lib/queryClient'
import { useHotelStore } from '../stores'
import { PageHeader } from '../components/common/PageHeader'
import { HotelCard } from '../components/hotels/HotelCard'
import { HotelFilters, filterHotels } from '../components/hotels/HotelFilters'
import { EmptyState } from '../components/common/EmptyState'
import { Alert } from '../components/ui/Alert'
import { HotelCardSkeleton } from '../components/ui/Skeleton'

export function HotelsPage() {
  const filters = useHotelStore((s) => s.filters)

  const { data: hotels, isLoading, error } = useQuery({
    queryKey: queryKeys.hotels.all,
    queryFn: hotelsApi.getAll,
  })

  const filtered = hotels ? filterHotels(hotels, filters) : []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Hotels"
        description="Browse our catalog powered by PlainAPI microservice"
      />

      <HotelFilters />

      {error && (
        <Alert variant="error" title="Failed to load hotels" className="mb-6">
          {(error as Error).message}. Make sure PlainAPI is running on port 3002.
        </Alert>
      )}

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <HotelCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <>
          <p className="mb-4 text-sm text-slate-500">
            Showing {filtered.length} of {hotels?.length ?? 0} hotels
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={Building2}
          title="No hotels found"
          description={
            hotels?.length
              ? 'Try adjusting your filters to see more results.'
              : 'No hotels in the catalog yet. Add hotels from the Admin panel.'
          }
        />
      )}
    </div>
  )
}
