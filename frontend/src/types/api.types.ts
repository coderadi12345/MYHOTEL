export interface ApiResponse<T> {
  message: string
  data: T
  success: boolean
}

export interface ApiError {
  message: string
  success: false
  errors?: Array<{ field: string; message: string }>
  error?: unknown
}

export interface PaginatedMeta {
  total: number
  page: number
  pageSize: number
}
