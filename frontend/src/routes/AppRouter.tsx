import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MainLayout } from '../components/layout/MainLayout'
import { AdminLayout } from '../components/layout/AdminLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { HomePage } from '../pages/HomePage'
import { HotelsPage } from '../pages/HotelsPage'
import { HotelDetailPage } from '../pages/HotelDetailPage'
import { BookingPage } from '../pages/BookingPage'
import { BookingConfirmPage } from '../pages/BookingConfirmPage'
import { MyBookingsPage } from '../pages/MyBookingsPage'
import { UserDashboardPage } from '../pages/UserDashboardPage'
import { AdminDashboardPage } from '../pages/AdminDashboardPage'
import { AdminHotelsPage } from '../pages/AdminHotelsPage'
import { ServicesPage } from '../pages/ServicesPage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'hotels', element: <HotelsPage /> },
      { path: 'hotels/:id', element: <HotelDetailPage /> },
      { path: 'book/:hotelId', element: <BookingPage /> },
      { path: 'bookings', element: <MyBookingsPage /> },
      { path: 'bookings/confirm/:idempotencyKey', element: <BookingConfirmPage /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute requiredRole="user">
            <UserDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'services',
        element: (
          <ProtectedRoute requiredRole="admin">
            <ServicesPage />
          </ProtectedRoute>
        ),
      },
      { path: 'login', element: <LoginPage /> },
      {
        path: 'admin',
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: 'dashboard', element: <AdminDashboardPage /> },
          { path: 'hotels', element: <AdminHotelsPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
