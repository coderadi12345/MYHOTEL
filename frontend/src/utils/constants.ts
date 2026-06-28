export const APP_NAME = 'MyHotel'
export const APP_TAGLINE = 'Enterprise Hotel Booking Platform'

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
} as const

export const SERVICES = [
  {
    id: 'plain-api',
    name: 'PlainAPI',
    description: 'Hotel catalog & inventory management',
    port: 3002,
    healthPath: '/hotel-api/ping/health',
    apiPrefix: '/hotel-api',
  },
  {
    id: 'booking-service',
    name: 'Hotel Booking Service',
    description: 'Reservations, idempotency & distributed locks',
    port: 3000,
    healthPath: '/booking-api/ping/health',
    apiPrefix: '/booking-api',
  },
  {
    id: 'notification-service',
    name: 'Notification Service',
    description: 'Async email delivery via BullMQ',
    port: 3001,
    healthPath: '/notification-api/ping/health',
    apiPrefix: '/notification-api',
  },
] as const

export const PUBLIC_NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Hotels', path: '/hotels' },
] as const

export const USER_NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Hotels', path: '/hotels' },
  { label: 'My Bookings', path: '/bookings' },
  { label: 'My Dashboard', path: '/dashboard' },
] as const

export const ADMIN_NAV_ITEMS = [
  { label: 'Admin Dashboard', path: '/admin/dashboard' },
  { label: 'Manage Hotels', path: '/admin/hotels' },
  { label: 'Services', path: '/services' },
  { label: 'Public Site', path: '/' },
] as const

export const ADMIN_SIDEBAR_ITEMS = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' as const },
  { label: 'Hotels', path: '/admin/hotels', icon: 'Building2' as const },
  { label: 'Services', path: '/services', icon: 'Server' as const },
] as const
