import { axiosInstance } from './axiosInstance'
import { unwrapApiResponse } from './apiResponse'
import type { MedicalRecordSummary } from '../types/medicalRecord'
import type {
  CreatePatientRequest,
  Patient,
  PatientListResponse,
  PatientSearchParams,
  UpdatePatientRequest,
} from '../types/patient'

export async function getPatients(params: PatientSearchParams = {}) {
  const response = await axiosInstance.get<PatientListResponse>('/patients', {
    params,
  })

  return unwrapApiResponse<PatientListResponse>(response.data)
}

export async function getPatient(patientId: number) {
  const response = await axiosInstance.get<Patient>(`/patients/${patientId}`)

  return unwrapApiResponse<Patient>(response.data)
}

export async function createPatient(request: CreatePatientRequest) {
  const response = await axiosInstance.post<Patient>('/patients', request)

  return unwrapApiResponse<Patient>(response.data)
}

export async function updatePatient(
  patientId: number,
  request: UpdatePatientRequest,
) {
  const response = await axiosInstance.patch<Patient>(
    `/patients/${patientId}`,
    request,
  )

  return unwrapApiResponse<Patient>(response.data)
}

export async function deletePatient(patientId: number) {
  await axiosInstance.delete(`/patients/${patientId}`)
}

export async function getPatientMedicalRecords(patientId: number) {
  const response = await axiosInstance.get<MedicalRecordSummary[]>(
    `/patients/${patientId}/medical-records`,
  )

  return unwrapApiResponse<MedicalRecordSummary[]>(response.data)
}
