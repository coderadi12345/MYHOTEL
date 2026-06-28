import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BookingDraft, BookingStatus, StoredBooking } from '../types/booking.types'

interface BookingStore {
  bookings: StoredBooking[]
  draft: BookingDraft | null
  pendingIdempotencyKey: string | null
  addBooking: (booking: StoredBooking) => void
  updateBookingStatus: (bookingId: number, status: BookingStatus, userEmail?: string) => void
  setDraft: (draft: BookingDraft | null) => void
  setPendingIdempotencyKey: (key: string | null) => void
  clearDraft: () => void
  getBookingById: (bookingId: number) => StoredBooking | undefined
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      bookings: [],
      draft: null,
      pendingIdempotencyKey: null,

      addBooking: (booking) =>
        set((state) => ({ bookings: [booking, ...state.bookings] })),

      updateBookingStatus: (bookingId, status, userEmail) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.bookingId === bookingId ? { ...b, status, userEmail: userEmail ?? b.userEmail } : b
          ),
        })),

      setDraft: (draft) => set({ draft }),
      setPendingIdempotencyKey: (key) => set({ pendingIdempotencyKey: key }),
      clearDraft: () => set({ draft: null, pendingIdempotencyKey: null }),

      getBookingById: (bookingId) => get().bookings.find((b) => b.bookingId === bookingId),
    }),
    { name: 'myhotel-bookings' }
  )
)
