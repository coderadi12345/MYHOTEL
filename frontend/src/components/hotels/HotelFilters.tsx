import { Search, SlidersHorizontal } from 'lucide-react'
import { useHotelStore } from '../../stores'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

export function HotelFilters() {
  const { filters, setFilters, resetFilters } = useHotelStore()

  return (
    <Card className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="h-5 w-5 text-slate-500" />
        <h3 className="font-medium text-slate-900">Filters & Sort</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-9 h-4 w-4 text-slate-400" />
          <Input
            label="Search"
            placeholder="Hotel name or address..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="pl-9"
          />
        </div>
        <Input
          label="Location"
          placeholder="City or region"
          value={filters.location}
          onChange={(e) => setFilters({ location: e.target.value })}
        />
        <Select
          label="Min Rating"
          value={String(filters.minRating)}
          onChange={(e) => setFilters({ minRating: Number(e.target.value) })}
          options={[
            { value: '0', label: 'Any rating' },
            { value: '3', label: '3+ stars' },
            { value: '4', label: '4+ stars' },
            { value: '4.5', label: '4.5+ stars' },
          ]}
        />
        <Select
          label="Sort by"
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-') as [
              typeof filters.sortBy,
              typeof filters.sortOrder,
            ]
            setFilters({ sortBy, sortOrder })
          }}
          options={[
            { value: 'name-asc', label: 'Name A–Z' },
            { value: 'name-desc', label: 'Name Z–A' },
            { value: 'rating-desc', label: 'Highest rated' },
            { value: 'location-asc', label: 'Location A–Z' },
          ]}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Reset filters
        </Button>
      </div>
    </Card>
  )
}

export function filterHotels<T extends { name: string; address: string; location: string; rating?: number }>(
  hotels: T[],
  filters: ReturnType<typeof useHotelStore.getState>['filters']
): T[] {
  let result = [...hotels]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q)
    )
  }

  if (filters.location) {
    const loc = filters.location.toLowerCase()
    result = result.filter((h) => h.location.toLowerCase().includes(loc))
  }

  if (filters.minRating > 0) {
    result = result.filter((h) => (h.rating ?? 0) >= filters.minRating)
  }

  result.sort((a, b) => {
    let cmp = 0
    switch (filters.sortBy) {
      case 'name':
        cmp = a.name.localeCompare(b.name)
        break
      case 'rating':
        cmp = (b.rating ?? 0) - (a.rating ?? 0)
        break
      case 'location':
        cmp = a.location.localeCompare(b.location)
        break
    }
    return filters.sortOrder === 'desc' && filters.sortBy !== 'rating' ? -cmp : cmp
  })

  return result
}
