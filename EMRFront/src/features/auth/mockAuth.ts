const MOCK_AUTH_STORAGE_KEY = 'emr_mock_authenticated'

export function isMockAuthenticated() {
  if (import.meta.env.VITE_MOCK_AUTH === 'true') {
    return true
  }

  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(MOCK_AUTH_STORAGE_KEY) === 'true'
}
