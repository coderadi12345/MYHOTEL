import { useQuery } from '@tanstack/react-query'
import { Activity, CheckCircle, XCircle } from 'lucide-react'
import { healthApi } from '../../api/health.api'
import { SERVICES } from '../../utils/constants'
import { queryKeys } from '../../lib/queryClient'
import { Card, CardTitle, CardDescription } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Spinner } from '../ui/Spinner'

export function ServiceStatusPanel() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: queryKeys.health.all,
    queryFn: healthApi.pingAll,
    refetchInterval: 30000,
  })

  const serviceKeys = ['plainApi', 'bookingService', 'notificationService'] as const

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <CardTitle>Microservices Health</CardTitle>
          <CardDescription>Real-time status of backend services</CardDescription>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
        >
          <Activity className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-3">
          {SERVICES.map((service, index) => {
            const key = serviceKeys[index]
            const healthy = data?.[key] ?? false

            return (
              <div
                key={service.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-900">{service.name}</p>
                  <p className="text-xs text-slate-500">
                    Port {service.port} · {service.description}
                  </p>
                </div>
                <Badge variant={healthy ? 'success' : 'danger'}>
                  {healthy ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Online
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <XCircle className="h-3 w-3" /> Offline
                    </span>
                  )}
                </Badge>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
