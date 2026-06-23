import { isAxiosError } from 'axios'

interface ApiErrorResponse {
  error?: string
  message?: string
}

const defaultApiErrorMessages: Record<number, string> = {
  400: '요청 값을 확인해 주세요.',
  403: '현재 계정 권한으로는 이 작업을 수행할 수 없습니다.',
  404: '요청한 데이터를 찾을 수 없습니다.',
  409: '이미 처리되었거나 중복된 데이터입니다.',
  500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
}

function getServerErrorMessage(data: unknown) {
  if (!data || typeof data !== 'object') {
    return null
  }

  const { error, message } = data as ApiErrorResponse

  if (typeof message === 'string' && message.trim()) {
    return message
  }

  if (typeof error === 'string' && error.trim()) {
    return error
  }

  return null
}

export function getApiErrorStatus(error: unknown) {
  if (!isAxiosError(error)) {
    return null
  }

  return error.response?.status ?? null
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = '요청 처리 중 오류가 발생했습니다.',
) {
  if (!isAxiosError(error)) {
    return fallbackMessage
  }

  const serverMessage = getServerErrorMessage(error.response?.data)

  if (serverMessage) {
    return serverMessage
  }

  const status = error.response?.status

  if (status && defaultApiErrorMessages[status]) {
    return defaultApiErrorMessages[status]
  }

  return fallbackMessage
}
