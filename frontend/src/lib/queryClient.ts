import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

export const queryKeys = {
  hotels: {
    all: ['hotels'] as const,
    detail: (id: number) => ['hotels', id] as const,
  },
  health: {
    all: ['health'] as const,
  },
} as const
