import { AlertCircle, CheckCircle, Info } from 'lucide-react'
import { cn } from '../../utils/cn'

type AlertVariant = 'success' | 'error' | 'info' | 'warning'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  children: React.ReactNode
  className?: string
}

const config: Record<AlertVariant, { bg: string; icon: typeof Info }> = {
  success: { bg: 'bg-emerald-50 border-emerald-200 text-emerald-800', icon: CheckCircle },
  error: { bg: 'bg-red-50 border-red-200 text-red-800', icon: AlertCircle },
  info: { bg: 'bg-blue-50 border-blue-200 text-blue-800', icon: Info },
  warning: { bg: 'bg-amber-50 border-amber-200 text-amber-800', icon: AlertCircle },
}

export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const { bg, icon: Icon } = config[variant]
  return (
    <div className={cn('flex gap-3 rounded-lg border p-4', bg, className)} role="alert">
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        {title && <p className="font-medium">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  )
}
