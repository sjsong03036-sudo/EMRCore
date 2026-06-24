import { axiosInstance } from './axiosInstance'
import { normalizePageResponse, unwrapApiResponse } from './apiResponse'
import type {
  CreateAdmissionDischargeRecordRequest,
  CreateNursingRecordRequest,
  MedicalRecordDetail,
  MedicalRecordHistory,
  MedicalRecordHistoryListResponse,
  MedicalRecordSearchParams,
  UpdateAdmissionDischargeRecordRequest,
  UpdateNursingRecordRequest,
} from '../types/medicalRecord'

interface BackendNursingRecord {
  authorId: number
  authorName: string
  createdAt: string
  id: number
  objective?: string
  patientId: number
  patientName: string
  plan?: string
  recordedAt: string
  subjective?: string
  updatedAt?: string
}

interface BackendAdmissionDischargeRecord {
  admittedAt: string
  attendingPhysician?: string
  authorId: number
  authorName: string
  createdAt: string
  diagnosis?: string
  dischargeSummary?: string
  dischargedAt?: string
  id: number
  outcome?: string
  patientId: number
  patientName: string
  reason?: string
  recordedAt: string
  roomNumber?: string
  updatedAt?: string
  ward?: string
}

function toPageParams(params: MedicalRecordSearchParams) {
  return {
    page: params.page ? params.page - 1 : undefined,
    size: params.size,
  }
}

function toDateTime(value?: string) {
  if (!value) {
    return undefined
  }

  return value.length === 10 ? `${value}T00:00:00` : value
}

function mapNursingRecord(record: BackendNursingRecord) {
  return {
    authorId: record.authorId,
    authorName: record.authorName,
    createdAt: record.createdAt,
    id: record.id,
    nursingContent: record.subjective ?? '',
    observation: record.objective,
    patientId: record.patientId,
    patientName: record.patientName,
    recordDate: record.recordedAt,
    type: 'NURSING' as const,
    updatedAt: record.updatedAt,
  }
}

function mapAdmissionDischargeRecord(
  record: BackendAdmissionDischargeRecord,
) {
  return {
    admissionDate: record.admittedAt?.slice(0, 10) ?? '',
    admissionReason: record.reason ?? '',
    authorId: record.authorId,
    authorName: record.authorName,
    createdAt: record.createdAt,
    dischargeDate: record.dischargedAt?.slice(0, 10),
    dischargeNote: record.dischargeSummary,
    id: record.id,
    patientId: record.patientId,
    patientName: record.patientName,
    recordDate: record.recordedAt,
    type: 'ADMISSION_DISCHARGE' as const,
    updatedAt: record.updatedAt,
  }
}

function mapNursingCreateRequest(request: CreateNursingRecordRequest) {
  return {
    objective: request.observation,
    patientId: request.patientId,
    recordedAt: request.recordDate,
    subjective: request.nursingContent,
  }
}

function mapNursingUpdateRequest(request: UpdateNursingRecordRequest) {
  return {
    objective: request.observation,
    subjective: request.nursingContent,
  }
}

function mapAdmissionDischargeCreateRequest(
  request: CreateAdmissionDischargeRecordRequest,
) {
  return {
    admittedAt: toDateTime(request.admissionDate),
    dischargeSummary: request.dischargeNote,
    dischargedAt: toDateTime(request.dischargeDate),
    patientId: request.patientId,
    reason: request.admissionReason,
    recordedAt: request.recordDate,
  }
}

function mapAdmissionDischargeUpdateRequest(
  request: UpdateAdmissionDischargeRecordRequest,
) {
  return {
    admittedAt: toDateTime(request.admissionDate),
    dischargeSummary: request.dischargeNote,
    dischargedAt: toDateTime(request.dischargeDate),
    reason: request.admissionReason,
  }
}

export async function getMedicalRecords(
  params: MedicalRecordSearchParams = {},
) {
  if (!params.patientId) {
    return {
      content: [],
      page: params.page ?? 1,
      size: params.size ?? 10,
      totalElements: 0,
      totalPages: 1,
    }
  }

  const records = await getPatientMedicalRecords(params.patientId)

  return {
    content: records,
    page: params.page ?? 1,
    size: params.size ?? records.length,
    totalElements: records.length,
    totalPages: 1,
  }
}

export async function getNursingRecord(recordId: number) {
  const response = await axiosInstance.get<BackendNursingRecord>(
    `/medical-records/nursing/${recordId}`,
  )

  return mapNursingRecord(
    unwrapApiResponse<BackendNursingRecord>(response.data),
  )
}

export async function getAdmissionDischargeRecord(recordId: number) {
  const response = await axiosInstance.get<BackendAdmissionDischargeRecord>(
    `/medical-records/admission-discharge/${recordId}`,
  )

  return mapAdmissionDischargeRecord(
    unwrapApiResponse<BackendAdmissionDischargeRecord>(response.data),
  )
}

export async function getMedicalRecord(recordId: number) {
  try {
    return await getNursingRecord(recordId)
  } catch {
    return getAdmissionDischargeRecord(recordId)
  }
}

export async function createNursingRecord(
  request: CreateNursingRecordRequest,
) {
  const response = await axiosInstance.post<number>(
    '/medical-records/nursing',
    mapNursingCreateRequest(request),
  )
  const recordId = unwrapApiResponse<number>(response.data)

  return getNursingRecord(recordId)
}

export async function updateNursingRecord(
  recordId: number,
  request: UpdateNursingRecordRequest,
) {
  await axiosInstance.patch(
    `/medical-records/nursing/${recordId}`,
    mapNursingUpdateRequest(request),
  )

  return getNursingRecord(recordId)
}

export async function deleteNursingRecord(recordId: number) {
  await axiosInstance.delete(`/medical-records/nursing/${recordId}`)
}

export async function createAdmissionDischargeRecord(
  request: CreateAdmissionDischargeRecordRequest,
) {
  const response = await axiosInstance.post<number>(
    '/medical-records/admission-discharge',
    mapAdmissionDischargeCreateRequest(request),
  )
  const recordId = unwrapApiResponse<number>(response.data)

  return getAdmissionDischargeRecord(recordId)
}

export async function updateAdmissionDischargeRecord(
  recordId: number,
  request: UpdateAdmissionDischargeRecordRequest,
) {
  await axiosInstance.patch(
    `/medical-records/admission-discharge/${recordId}`,
    mapAdmissionDischargeUpdateRequest(request),
  )

  return getAdmissionDischargeRecord(recordId)
}

export async function deleteAdmissionDischargeRecord(recordId: number) {
  await axiosInstance.delete(
    `/medical-records/admission-discharge/${recordId}`,
  )
}

export async function getPatientMedicalRecords(patientId: number) {
  const params = {
    ...toPageParams({ page: 1, size: 100 }),
    patientId,
  }
  const [nursingResponse, admissionDischargeResponse] = await Promise.all([
    axiosInstance.get('/medical-records/nursing', { params }),
    axiosInstance.get('/medical-records/admission-discharge', { params }),
  ])
  const nursingPage = normalizePageResponse<BackendNursingRecord>(
    unwrapApiResponse(nursingResponse.data),
  )
  const admissionDischargePage =
    normalizePageResponse<BackendAdmissionDischargeRecord>(
      unwrapApiResponse(admissionDischargeResponse.data),
    )

  return [
    ...nursingPage.content.map(mapNursingRecord),
    ...admissionDischargePage.content.map(mapAdmissionDischargeRecord),
  ] satisfies MedicalRecordDetail[]
}

export async function getMedicalRecordHistories(recordId: number) {
  const response =
    await axiosInstance.get<MedicalRecordHistoryListResponse>(
      '/medical-records/history',
      {
        params: {
          page: 0,
          recordId,
          size: 20,
        },
      },
    )

  return normalizePageResponse<MedicalRecordHistory>(
    unwrapApiResponse<MedicalRecordHistoryListResponse>(response.data),
  )
}
