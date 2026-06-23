export const PATIENT_GENDERS = ['MALE', 'FEMALE'] as const

export type PatientGender = (typeof PATIENT_GENDERS)[number] | string

export interface Patient {
  id: number
  name: string
  birthDate: string
  gender: PatientGender
  phone: string
  insuranceNo?: string
  deletedAt?: string | null
}

export interface PatientSearchParams {
  name?: string
  page?: number
  phone?: string
  size?: number
}

export interface CreatePatientRequest {
  birthDate: string
  gender: PatientGender
  insuranceNo?: string
  name: string
  phone: string
}

export type UpdatePatientRequest = Partial<CreatePatientRequest>

export interface PatientListResponse {
  content: Patient[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}
