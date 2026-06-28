import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({ children, className, hover, padding = 'md' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white shadow-sm',
        paddingMap[padding],
        hover && 'transition-shadow hover:shadow-md',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('text-lg font-semibold text-slate-900', className)}>{children}</h3>
}

export function CardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-sm text-slate-500', className)}>{children}</p>
}
