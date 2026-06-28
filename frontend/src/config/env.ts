export const env = {
  hotelApi: import.meta.env.VITE_HOTEL_API ?? '/hotel-api',
  bookingApi: import.meta.env.VITE_BOOKING_API ?? '/booking-api',
  notificationApi: import.meta.env.VITE_NOTIFICATION_API ?? '/notification-api',
} as const
