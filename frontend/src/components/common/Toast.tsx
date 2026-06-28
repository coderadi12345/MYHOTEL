import { useEffect } from 'react'
import { CheckCircle, XCircle, Info } from 'lucide-react'
import { useUiStore } from '../../stores'
import { cn } from '../../utils/cn'

export function Toast() {
  const { toast, clearToast } = useUiStore()

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(clearToast, 4000)
    return () => clearTimeout(timer)
  }, [toast, clearToast])

  if (!toast) return null

  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  }

  const colors = {
    success: 'bg-emerald-600',
    error: 'bg-red-600',
    info: 'bg-slate-800',
  }

  const Icon = icons[toast.type]

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4">
      <div
        className={cn(
          'flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white shadow-lg',
          colors[toast.type]
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span>{toast.message}</span>
        <button onClick={clearToast} className="ml-2 opacity-70 hover:opacity-100">
          ×
        </button>
      </div>
    </div>
  )
}
