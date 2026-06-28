import { create } from 'zustand'

interface UiStore {
  sidebarOpen: boolean
  globalLoading: boolean
  toast: { message: string; type: 'success' | 'error' | 'info' } | null
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setGlobalLoading: (loading: boolean) => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  clearToast: () => void
}

export const useUiStore = create<UiStore>((set) => ({
  sidebarOpen: false,
  globalLoading: false,
  toast: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
  showToast: (message, type = 'info') => set({ toast: { message, type } }),
  clearToast: () => set({ toast: null }),
}))
