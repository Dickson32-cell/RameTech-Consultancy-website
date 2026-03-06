// src/lib/api-response.ts
// Standard API response format

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}

export function successResponse<T>(data: T, meta?: ApiResponse<T>['meta']): ApiResponse<T> {
  return {
    success: true,
    data,
    ...(meta && { meta })
  }
}

export function errorResponse(error: string): ApiResponse<null> {
  return {
    success: false,
    error
  }
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): ApiResponse<T[]> {
  return {
    success: true,
    data,
    meta: {
      page,
      limit,
      total
    }
  }
}
