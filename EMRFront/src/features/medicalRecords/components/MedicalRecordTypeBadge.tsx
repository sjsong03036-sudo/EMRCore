import { Badge } from '../../../components/ui/Badge'
import type { MedicalRecordType } from '../../../types/medicalRecord'
import { medicalRecordTypeLabels } from '../medicalRecordLabels'

interface MedicalRecordTypeBadgeProps {
  type: MedicalRecordType
}

const medicalRecordTypeTones: Record<
  MedicalRecordType,
  'gray' | 'green' | 'red' | 'teal'
> = {
  ADMISSION_DISCHARGE: 'green',
  FOLLOW_UP: 'gray',
  INITIAL: 'teal',
  NURSING: 'teal',
  OPERATION: 'red',
}

export function MedicalRecordTypeBadge({ type }: MedicalRecordTypeBadgeProps) {
  return (
    <Badge tone={medicalRecordTypeTones[type]}>
      {medicalRecordTypeLabels[type]}
    </Badge>
  )
}
