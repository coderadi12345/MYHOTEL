export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

export interface CreateBookingRequest {
  userId: number
  hotelId: number
  totalGuests: number
  bookingAmount: number
}

export interface CreateBookingResponse {
  bookingId: number
  idempotencyKey: string
}

export interface ConfirmBookingRequest {
  userEmail: string
}

export interface ConfirmBookingResponse {
  bookingId: number
  status: BookingStatus
}

export interface StoredBooking {
  bookingId: number
  idempotencyKey: string
  hotelId: number
  hotelName: string
  totalGuests: number
  bookingAmount: number
  status: BookingStatus
  userEmail?: string
  createdAt: string
}

export interface BookingDraft {
  hotelId: number
  hotelName: string
  totalGuests: number
  bookingAmount: number
}
