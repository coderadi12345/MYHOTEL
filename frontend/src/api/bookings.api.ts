import { bookingClient } from './client'
import type {
  ConfirmBookingRequest,
  ConfirmBookingResponse,
  CreateBookingRequest,
  CreateBookingResponse,
} from '../types/booking.types'

export const bookingsApi = {
  create: async (payload: CreateBookingRequest): Promise<CreateBookingResponse> => {
    const { data } = await bookingClient.post<CreateBookingResponse>('/bookings', payload)
    return data
  },

  confirm: async (
    idempotencyKey: string,
    payload: ConfirmBookingRequest
  ): Promise<ConfirmBookingResponse> => {
    const { data } = await bookingClient.post<ConfirmBookingResponse>(
      `/bookings/confirm/${idempotencyKey}`,
      payload
    )
    return data
  },

  health: async (): Promise<string> => {
    const { data } = await bookingClient.get<string>('/ping/health')
    return data
  },
}
