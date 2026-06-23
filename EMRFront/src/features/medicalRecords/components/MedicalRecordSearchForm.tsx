import { useForm } from 'react-hook-form'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import type {
  MedicalRecordSearchParams,
  MedicalRecordType,
} from '../../../types/medicalRecord'
import { medicalRecordTypeLabels } from '../medicalRecordLabels'

const medicalRecordTypes: MedicalRecordType[] = [
  'NURSING',
  'ADMISSION_DISCHARGE',
  'INITIAL',
  'FOLLOW_UP',
  'OPERATION',
]

interface MedicalRecordSearchFormProps {
  defaultValues?: MedicalRecordSearchParams
  onReset?: () => void
  onSearch: (params: MedicalRecordSearchParams) => void
}

interface MedicalRecordSearchFormValues {
  authorKeyword: string
  endDate: string
  patientKeyword: string
  startDate: string
  type: '' | MedicalRecordType
}

function normalizeSearchParams(values: MedicalRecordSearchFormValues) {
  return {
    ...(values.authorKeyword.trim()
      ? { authorKeyword: values.authorKeyword.trim() }
      : {}),
    ...(values.endDate ? { endDate: values.endDate } : {}),
    ...(values.patientKeyword.trim()
      ? { patientKeyword: values.patientKeyword.trim() }
      : {}),
    ...(values.startDate ? { startDate: values.startDate } : {}),
    ...(values.type ? { type: values.type } : {}),
  }
}

export function MedicalRecordSearchForm({
  defaultValues,
  onReset,
  onSearch,
}: MedicalRecordSearchFormProps) {
  const { handleSubmit, register, reset } =
    useForm<MedicalRecordSearchFormValues>({
      defaultValues: {
        authorKeyword: defaultValues?.authorKeyword ?? '',
        endDate: defaultValues?.endDate ?? '',
        patientKeyword: defaultValues?.patientKeyword ?? '',
        startDate: defaultValues?.startDate ?? '',
        type: defaultValues?.type ?? '',
      },
    })

  const handleSearch = (values: MedicalRecordSearchFormValues) => {
    onSearch(normalizeSearchParams(values))
  }

  const handleReset = () => {
    reset({
      authorKeyword: '',
      endDate: '',
      patientKeyword: '',
      startDate: '',
      type: '',
    })
    onReset?.()
  }

  return (
    <form
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={handleSubmit(handleSearch)}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] lg:items-end">
        <Input
          id="medicalRecordStartDate"
          label="시작일"
          type="date"
          {...register('startDate')}
        />
        <Input
          id="medicalRecordEndDate"
          label="종료일"
          type="date"
          {...register('endDate')}
        />
        <Input
          id="medicalRecordPatientKeyword"
          label="환자"
          placeholder="환자명 또는 ID"
          type="text"
          {...register('patientKeyword')}
        />
        <Input
          id="medicalRecordAuthorKeyword"
          label="작성자"
          placeholder="작성자명"
          type="text"
          {...register('authorKeyword')}
        />
        <Select id="medicalRecordType" label="기록 타입" {...register('type')}>
          <option value="">전체</option>
          {medicalRecordTypes.map((type) => (
            <option key={type} value={type}>
              {medicalRecordTypeLabels[type]}
            </option>
          ))}
        </Select>
        <div className="flex gap-2">
          <Button type="submit">검색</Button>
          <Button onClick={handleReset} variant="secondary">
            초기화
          </Button>
        </div>
      </div>
    </form>
  )
}
