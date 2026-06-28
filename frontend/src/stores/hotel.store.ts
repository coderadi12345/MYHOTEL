import { create } from 'zustand'
import type { HotelFilters } from '../types/hotel.types'

interface HotelStore {
  filters: HotelFilters
  selectedHotelId: number | null
  setFilters: (filters: Partial<HotelFilters>) => void
  resetFilters: () => void
  setSelectedHotelId: (id: number | null) => void
}

const defaultFilters: HotelFilters = {
  search: '',
  location: '',
  minRating: 0,
  sortBy: 'name',
  sortOrder: 'asc',
}

export const useHotelStore = create<HotelStore>((set) => ({
  filters: defaultFilters,
  selectedHotelId: null,
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: defaultFilters }),
  setSelectedHotelId: (id) => set({ selectedHotelId: id }),
}))
