import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { LogIn, Shield, User } from 'lucide-react'
import { useAuthStore, useUiStore } from '../stores'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { Alert } from '../components/ui/Alert'
import { cn } from '../utils/cn'
import type { UserRole } from '../types/user.types'

const loginSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  userId: z.number().min(1, 'User ID must be at least 1'),
})

type LoginFormData = z.infer<typeof loginSchema>

const ROLE_DEFAULTS: Record<UserRole, LoginFormData> = {
  user: { name: 'Demo User', email: 'demo@myhotel.com', userId: 1 },
  admin: { name: 'Admin User', email: 'admin@myhotel.com', userId: 99 },
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((s) => s.login)
  const { showToast } = useUiStore()
  const [role, setRole] = useState<UserRole>('user')

  const from = (location.state as { from?: string })?.from

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: ROLE_DEFAULTS.user,
  })

  const switchRole = (newRole: UserRole) => {
    setRole(newRole)
    reset(ROLE_DEFAULTS[newRole])
  }

  const onSubmit = (data: LoginFormData) => {
    login({ id: data.userId, name: data.name, email: data.email, role })
    showToast(`Welcome, ${data.name}!`, 'success')

    if (from) {
      navigate(from)
    } else {
      navigate(role === 'admin' ? '/admin/dashboard' : '/dashboard')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
            <LogIn className="h-7 w-7 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sign In</h1>
          <p className="mt-1 text-sm text-slate-500">Choose your account type to continue</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => switchRole('user')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
              role === 'user'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <User className="h-4 w-4" /> User
          </button>
          <button
            type="button"
            onClick={() => switchRole('admin')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
              role === 'admin'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Shield className="h-4 w-4" /> Admin
          </button>
        </div>

        <Alert variant="info" className="mb-6">
          {role === 'admin'
            ? 'Admin access opens the platform management console — hotel CRUD, service health, and catalog analytics.'
            : 'User access opens your personal dashboard — bookings, confirmations, and hotel browsing.'}
        </Alert>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" id="name" error={errors.name?.message} {...register('name')} />
          <Input
            label="Email"
            id="email"
            type="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="User ID"
            id="userId"
            type="number"
            min="1"
            error={errors.userId?.message}
            {...register('userId', { valueAsNumber: true })}
          />
          <Button
            type="submit"
            className="w-full"
            size="lg"
            variant={role === 'admin' ? 'secondary' : 'primary'}
          >
            Sign in as {role === 'admin' ? 'Admin' : 'User'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
