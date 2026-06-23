import { axiosInstance } from './axiosInstance'
import { unwrapApiResponse } from './apiResponse'
import type {
  CreateAdmissionDischargeRecordRequest,
  CreateNursingRecordRequest,
  MedicalRecordDetail,
  MedicalRecordListResponse,
  MedicalRecordSearchParams,
  NursingRecordDetail,
  AdmissionDischargeRecordDetail,
  UpdateAdmissionDischargeRecordRequest,
  UpdateNursingRecordRequest,
} from '../types/medicalRecord'

export async function getMedicalRecords(
  params: MedicalRecordSearchParams = {},
) {
  const response = await axiosInstance.get<MedicalRecordListResponse>(
    '/medical-records',
    { params },
  )

  return unwrapApiResponse<MedicalRecordListResponse>(response.data)
}

export async function getMedicalRecord(recordId: number) {
  const response = await axiosInstance.get<MedicalRecordDetail>(
    `/medical-records/${recordId}`,
  )

  return unwrapApiResponse<MedicalRecordDetail>(response.data)
}

export async function createNursingRecord(
  request: CreateNursingRecordRequest,
) {
  const response = await axiosInstance.post<NursingRecordDetail>(
    '/medical-records/nursing',
    request,
  )

  return unwrapApiResponse<NursingRecordDetail>(response.data)
}

export async function updateNursingRecord(
  recordId: number,
  request: UpdateNursingRecordRequest,
) {
  const response = await axiosInstance.patch<NursingRecordDetail>(
    `/medical-records/nursing/${recordId}`,
    request,
  )

  return unwrapApiResponse<NursingRecordDetail>(response.data)
}

export async function deleteNursingRecord(recordId: number) {
  await axiosInstance.delete(`/medical-records/nursing/${recordId}`)
}

export async function createAdmissionDischargeRecord(
  request: CreateAdmissionDischargeRecordRequest,
) {
  const response = await axiosInstance.post<AdmissionDischargeRecordDetail>(
    '/medical-records/admission-discharge',
    request,
  )

  return unwrapApiResponse<AdmissionDischargeRecordDetail>(response.data)
}

export async function updateAdmissionDischargeRecord(
  recordId: number,
  request: UpdateAdmissionDischargeRecordRequest,
) {
  const response = await axiosInstance.patch<AdmissionDischargeRecordDetail>(
    `/medical-records/admission-discharge/${recordId}`,
    request,
  )

  return unwrapApiResponse<AdmissionDischargeRecordDetail>(response.data)
}

export async function deleteAdmissionDischargeRecord(recordId: number) {
  await axiosInstance.delete(
    `/medical-records/admission-discharge/${recordId}`,
  )
}
