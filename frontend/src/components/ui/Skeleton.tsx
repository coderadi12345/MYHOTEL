import { cn } from '../../utils/cn'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-lg bg-slate-200', className)} />
}

export function HotelCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <Skeleton className="mb-4 h-40 w-full" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-2 h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  )
}
