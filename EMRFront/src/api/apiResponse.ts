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
