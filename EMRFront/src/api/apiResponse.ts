type ApiResponseKey = 'data' | 'result'

const responseWrapperKeys: ApiResponseKey[] = ['data', 'result']

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function unwrapApiResponse<T>(responseData: unknown): T {
  if (isObject(responseData)) {
    for (const key of responseWrapperKeys) {
      if (key in responseData) {
        return responseData[key] as T
      }
    }
  }

  return responseData as T
}

interface SpringPage<T> {
  content?: T[]
  number?: number
  page?: number
  size?: number
  totalElements?: number
  totalPages?: number
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export function normalizePageResponse<T>(
  pageData: SpringPage<T>,
): PageResponse<T> {
  return {
    content: pageData.content ?? [],
    page:
      typeof pageData.page === 'number'
        ? pageData.page
        : (pageData.number ?? 0) + 1,
    size: pageData.size ?? 0,
    totalElements: pageData.totalElements ?? 0,
    totalPages: pageData.totalPages ?? 1,
  }
}
