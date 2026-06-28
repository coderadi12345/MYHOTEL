import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Building2,
  MapPin,
  Plus,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'
import { hotelsApi } from '../api/hotels.api'
import { queryKeys } from '../lib/queryClient'
import { useAuthStore } from '../stores'
import { PageHeader } from '../components/common/PageHeader'
import { ServiceStatusPanel } from '../components/common/ServiceStatusPanel'
import { Card, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { formatRating } from '../utils/formatters'
import { PageLoader } from '../components/ui/Spinner'

export function AdminDashboardPage() {
  const { user } = useAuthStore()

  const { data: hotels, isLoading } = useQuery({
    queryKey: queryKeys.hotels.all,
    queryFn: hotelsApi.getAll,
  })

  const locations = new Set(hotels?.map((h) => h.location) ?? []).size
  const avgRating =
    hotels && hotels.length > 0
      ? hotels.reduce((sum, h) => sum + (h.rating ?? 0), 0) /
        hotels.filter((h) => h.rating != null).length || 0
      : 0
  const topRated = [...(hotels ?? [])]
    .filter((h) => h.rating != null)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 5)

  const stats = [
    {
      label: 'Total Hotels',
      value: hotels?.length ?? 0,
      icon: Building2,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Locations',
      value: locations,
      icon: MapPin,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      label: 'Avg Rating',
      value: avgRating > 0 ? formatRating(avgRating) : '—',
      icon: Star,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Active Services',
      value: '3',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description={`Platform overview — signed in as ${user?.name}`}
        action={
          <Link to="/admin/hotels">
            <Button>
              <Plus className="h-4 w-4" /> Add Hotel
            </Button>
          </Link>
        }
      />

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

      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <ServiceStatusPanel />

        <Card>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common admin tasks</CardDescription>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Manage Hotels', path: '/admin/hotels', desc: 'CRUD via PlainAPI' },
              { label: 'View Services', path: '/services', desc: 'Microservices health' },
              { label: 'Public Site', path: '/', desc: 'Customer-facing app' },
              { label: 'Hotel Catalog', path: '/hotels', desc: 'Preview listings' },
            ].map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-primary-200 hover:bg-primary-50"
              >
                <p className="font-medium text-slate-900">{action.label}</p>
                <p className="text-xs text-slate-500">{action.desc}</p>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Top Rated Hotels</CardTitle>
            <CardDescription>Highest rated properties in catalog</CardDescription>
          </div>
          <Link to="/admin/hotels">
            <Button variant="outline" size="sm">
              Manage all
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : topRated.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-700">Hotel</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Location</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Rating</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Reviews</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topRated.map((hotel) => (
                  <tr key={hotel.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{hotel.name}</td>
                    <td className="px-4 py-3 text-slate-600">{hotel.location}</td>
                    <td className="px-4 py-3">
                      <Badge variant="info">{formatRating(hotel.rating)}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{hotel.ratingCount ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center py-12 text-center">
            <Users className="mb-3 h-10 w-10 text-slate-300" />
            <p className="text-sm text-slate-500">No hotels in catalog yet.</p>
            <Link to="/admin/hotels" className="mt-4">
              <Button size="sm">Add your first hotel</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  )
}
