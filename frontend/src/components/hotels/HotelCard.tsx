import { Link } from 'react-router-dom'
import { MapPin, Star, Users } from 'lucide-react'
import type { Hotel } from '../../types/hotel.types'
import { formatRating } from '../../utils/formatters'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

interface HotelCardProps {
  hotel: Hotel
}

export function HotelCard({ hotel }: HotelCardProps) {
  const locationInitial = hotel.location.charAt(0).toUpperCase()

  return (
    <Card hover className="group overflow-hidden p-0">
      <div className="relative h-44 bg-gradient-to-br from-primary-600 to-cyan-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-bold text-white/20">{locationInitial}</span>
        </div>
        {hotel.rating != null && hotel.rating > 0 && (
          <div className="absolute right-3 top-3">
            <Badge variant="default" className="bg-white/90 text-slate-800">
              <Star className="mr-1 inline h-3 w-3 fill-amber-400 text-amber-400" />
              {formatRating(hotel.rating)}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-700">
          {hotel.name}
        </h3>
        <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">{hotel.location}</span>
        </div>
        <p className="mt-1 truncate text-sm text-slate-400">{hotel.address}</p>
        {hotel.ratingCount != null && hotel.ratingCount > 0 && (
          <p className="mt-2 text-xs text-slate-400">{hotel.ratingCount} reviews</p>
        )}
        <div className="mt-4 flex gap-2">
          <Link to={`/hotels/${hotel.id}`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              View Details
            </Button>
          </Link>
          <Link to={`/book/${hotel.id}`}>
            <Button size="sm">
              <Users className="h-4 w-4" />
              Book
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
