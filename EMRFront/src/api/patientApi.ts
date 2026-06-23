import { axiosInstance } from './axiosInstance'
import { normalizePageResponse, unwrapApiResponse } from './apiResponse'
import { getPatientMedicalRecords as getMedicalRecordsByPatient } from './medicalRecordApi'
import type {
  CreatePatientRequest,
  Patient,
  PatientListResponse,
  PatientSearchParams,
  UpdatePatientRequest,
} from '../types/patient'

function toPageParams(params: PatientSearchParams) {
  return {
    ...params,
    page: params.page ? params.page - 1 : undefined,
  }
}

export async function getPatients(params: PatientSearchParams = {}) {
  const response = await axiosInstance.get<PatientListResponse>('/patients', {
    params: toPageParams(params),
  })

  return normalizePageResponse<Patient>(
    unwrapApiResponse<PatientListResponse>(response.data),
  )
}

export async function getPatient(patientId: number) {
  const response = await axiosInstance.get<Patient>(`/patients/${patientId}`)

  return unwrapApiResponse<Patient>(response.data)
}

export async function createPatient(request: CreatePatientRequest) {
  const response = await axiosInstance.post<number>('/patients', request)
  const patientId = unwrapApiResponse<number>(response.data)

  return getPatient(patientId)
}

export async function updatePatient(
  patientId: number,
  request: UpdatePatientRequest,
) {
  await axiosInstance.patch(`/patients/${patientId}`, request)

  return getPatient(patientId)
}

export async function deletePatient(patientId: number) {
  await axiosInstance.delete(`/patients/${patientId}`)
}

export async function getPatientMedicalRecords(patientId: number) {
  return getMedicalRecordsByPatient(patientId)
}
