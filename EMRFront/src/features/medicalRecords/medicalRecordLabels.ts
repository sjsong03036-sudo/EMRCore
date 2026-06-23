import type { MedicalRecordType } from '../../types/medicalRecord'

export const medicalRecordTypeLabels: Record<MedicalRecordType, string> = {
  ADMISSION_DISCHARGE: '입퇴원기록',
  FOLLOW_UP: '재진기록',
  INITIAL: '초진기록',
  NURSING: '간호기록',
  OPERATION: '수술기록',
}
