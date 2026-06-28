import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { Toast } from '../common/Toast'

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </div>
  )
}
