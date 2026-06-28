import { notificationClient } from './client'

export const healthApi = {
  checkNotification: async (): Promise<string> => {
    const { data } = await notificationClient.get<string>('/ping/health')
    return data
  },

  pingAll: async (): Promise<Record<string, boolean>> => {
    const checks = await Promise.allSettled([
      fetch('/hotel-api/ping/health').then((r) => r.ok),
      fetch('/booking-api/ping/health').then((r) => r.ok),
      fetch('/notification-api/ping/health').then((r) => r.ok),
    ])

    return {
      plainApi: checks[0].status === 'fulfilled' && checks[0].value,
      bookingService: checks[1].status === 'fulfilled' && checks[1].value,
      notificationService: checks[2].status === 'fulfilled' && checks[2].value,
    }
  },
}
