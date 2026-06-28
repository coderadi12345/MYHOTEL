export interface Hotel {
  id: number
  name: string
  address: string
  location: string
  rating?: number
  ratingCount?: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CreateHotelDto {
  name: string
  address: string
  location: string
  rating?: number
  ratingCount?: number
}

export type UpdateHotelDto = Partial<CreateHotelDto>

export interface HotelFilters {
  search: string
  location: string
  minRating: number
  sortBy: 'name' | 'rating' | 'location'
  sortOrder: 'asc' | 'desc'
}
