import axios, { type AxiosError, type AxiosInstance } from 'axios'
import type { ApiError } from '../types/api.types'

function createClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
  })

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message ??
        error.message ??
        'An unexpected error occurred'
      return Promise.reject(new Error(message))
    }
  )

  return client
}

export const hotelClient = createClient('/hotel-api')
export const bookingClient = createClient('/booking-api')
export const notificationClient = createClient('/notification-api')
