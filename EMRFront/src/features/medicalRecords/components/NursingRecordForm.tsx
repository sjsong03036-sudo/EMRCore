import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Textarea } from '../../../components/ui/Textarea'
import type { Patient } from '../../../types/patient'
import type {
  CreateNursingRecordRequest,
  NursingRecordDetail,
  UpdateNursingRecordRequest,
} from '../../../types/medicalRecord'
import { PatientSelectSearch } from '../../patients/components/PatientSelectSearch'

interface NursingRecordFormProps {
  defaultValues?: Partial<NursingRecordDetail>
  isSubmitting?: boolean
  mode: 'create' | 'edit'
  onSubmit: (
    values: CreateNursingRecordRequest | UpdateNursingRecordRequest,
  ) => void
}

interface NursingRecordFormValues {
  nursingContent: string
  observation: string
  patientId: number | null
  recordDate: string
}

function getCurrentDateTimeLocal() {
  const now = new Date()
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000

  return new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 16)
}

function toDateTimeLocal(value?: string) {
  if (!value) {
    return getCurrentDateTimeLocal()
  }

  return value.slice(0, 16)
}

export function NursingRecordForm({
  defaultValues,
  isSubmitting = false,
  mode,
  onSubmit,
}: NursingRecordFormProps) {
  const [selectedPatient, setSelectedPatient] = useState<{
    id: number
    name: string
  } | null>(
    defaultValues?.patientId && defaultValues.patientName
      ? {
          id: defaultValues.patientId,
          name: defaultValues.patientName,
        }
      : null,
  )
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<NursingRecordFormValues>({
    defaultValues: {
      nursingContent: defaultValues?.nursingContent ?? '',
      observation: defaultValues?.observation ?? '',
      patientId: defaultValues?.patientId ?? null,
      recordDate: toDateTimeLocal(defaultValues?.recordDate),
    },
  })

  const selectedPatientId =
    useWatch({
      control,
      name: 'patientId',
    }) ?? undefined
  const submitLabel = mode === 'create' ? '저장' : '수정'

  const handlePatientSelect = (patientId: number, patient: Patient) => {
    setValue('patientId', patientId, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setSelectedPatient({
      id: patient.id,
      name: patient.name,
    })
  }

  const handleValidSubmit = (values: NursingRecordFormValues) => {
    const patientId = Number(values.patientId)
    const normalizedValues = {
      nursingContent: values.nursingContent.trim(),
      observation: values.observation.trim() || undefined,
      recordDate: values.recordDate,
    }

    if (mode === 'edit') {
      onSubmit(normalizedValues)
      return
    }

    onSubmit({
      ...normalizedValues,
      patientId,
    })
  }

  return (
    <form
      className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit(handleValidSubmit)}
    >
      <input
        type="hidden"
        {...register('patientId', {
          validate: (value) =>
            mode === 'edit' ||
            Number(value) > 0 ||
            '환자를 선택해 주세요.',
        })}
      />

      <div className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">환자 선택</h2>
          {selectedPatient && (
            <p className="mt-1 text-sm text-slate-600">
              선택된 환자: {selectedPatient.name} (ID {selectedPatient.id})
            </p>
          )}
          {errors.patientId && (
            <p className="mt-2 text-sm text-red-600">
              {errors.patientId.message}
            </p>
          )}
        </div>
        {mode === 'create' && (
          <PatientSelectSearch
            onSelect={handlePatientSelect}
            selectedPatientId={selectedPatientId}
          />
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          id="nursingRecordDate"
          label="기록일시"
          type="datetime-local"
          {...register('recordDate', {
            required: '기록일시를 입력해 주세요.',
          })}
          error={errors.recordDate?.message}
        />
      </div>

      <Textarea
        id="nursingContent"
        label="간호 내용"
        placeholder="간호 내용을 입력해 주세요."
        {...register('nursingContent', {
          required: '간호 내용을 입력해 주세요.',
          validate: (value) =>
            value.trim().length > 0 || '간호 내용을 입력해 주세요.',
        })}
        error={errors.nursingContent?.message}
      />

      <Textarea
        id="nursingObservation"
        label="관찰 사항"
        placeholder="관찰 사항을 입력해 주세요."
        {...register('observation')}
        error={errors.observation?.message}
      />

      <div className="flex justify-end gap-2">
        <Button isLoading={isSubmitting} type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
