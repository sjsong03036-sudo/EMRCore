export type MedicalRecordType =
  | 'NURSING'
  | 'ADMISSION_DISCHARGE'
  | 'INITIAL'
  | 'FOLLOW_UP'
  | 'OPERATION'

export interface MedicalRecordSummary {
  id: number
  patientId: number
  patientName: string
  authorId: number
  authorName: string
  recordDate: string
  type: MedicalRecordType
  createdAt: string
}

export interface MedicalRecordBaseDetail extends MedicalRecordSummary {
  updatedAt?: string
}

export interface NursingRecordDetail extends MedicalRecordBaseDetail {
  nursingContent: string
  observation?: string
  type: 'NURSING'
}

export interface AdmissionDischargeRecordDetail extends MedicalRecordBaseDetail {
  admissionDate: string
  admissionReason: string
  dischargeDate?: string
  dischargeNote?: string
  type: 'ADMISSION_DISCHARGE'
}

export interface InitialRecordDetail extends MedicalRecordBaseDetail {
  chiefComplaint: string
  diagnosis?: string
  presentIllness?: string
  type: 'INITIAL'
}

export interface FollowUpRecordDetail extends MedicalRecordBaseDetail {
  plan?: string
  progressNote: string
  type: 'FOLLOW_UP'
}

export interface OperationRecordDetail extends MedicalRecordBaseDetail {
  anesthesiaType?: string
  operationName: string
  surgeon?: string
  type: 'OPERATION'
}

export type MedicalRecordDetail =
  | NursingRecordDetail
  | AdmissionDischargeRecordDetail
  | InitialRecordDetail
  | FollowUpRecordDetail
  | OperationRecordDetail

export interface MedicalRecordSearchParams {
  authorKeyword?: string
  endDate?: string
  page?: number
  patientKeyword?: string
  size?: number
  startDate?: string
  type?: MedicalRecordType
}

export interface CreateNursingRecordRequest {
  nursingContent: string
  observation?: string
  patientId: number
  recordDate: string
}

export type UpdateNursingRecordRequest = Partial<
  Omit<CreateNursingRecordRequest, 'patientId'>
>

export interface CreateAdmissionDischargeRecordRequest {
  admissionDate: string
  admissionReason: string
  dischargeDate?: string
  dischargeNote?: string
  patientId: number
  recordDate: string
}

export type UpdateAdmissionDischargeRecordRequest = Partial<
  Omit<CreateAdmissionDischargeRecordRequest, 'patientId'>
>

export interface MedicalRecordListResponse {
  content: MedicalRecordSummary[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}
