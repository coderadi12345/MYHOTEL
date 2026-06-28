import { hotelClient } from './client'
import type { ApiResponse } from '../types/api.types'
import type { CreateHotelDto, Hotel, UpdateHotelDto } from '../types/hotel.types'

export const hotelsApi = {
  getAll: async (): Promise<Hotel[]> => {
    const { data } = await hotelClient.get<ApiResponse<Hotel[]>>('/hotels')
    return data.data
  },

  getById: async (id: number): Promise<Hotel> => {
    const { data } = await hotelClient.get<ApiResponse<Hotel>>(`/hotels/${id}`)
    return data.data
  },

  create: async (payload: CreateHotelDto): Promise<Hotel> => {
    const { data } = await hotelClient.post<ApiResponse<Hotel>>('/hotels', payload)
    return data.data
  },

  update: async (id: number, payload: UpdateHotelDto): Promise<Hotel> => {
    const { data } = await hotelClient.patch<ApiResponse<Hotel>>(`/hotels/${id}`, payload)
    return data.data
  },

  delete: async (id: number): Promise<boolean> => {
    const { data } = await hotelClient.delete<ApiResponse<boolean>>(`/hotels/${id}`)
    return data.data
  },

  health: async (): Promise<string> => {
    const { data } = await hotelClient.get<string>('/ping/health')
    return data
  },
}
