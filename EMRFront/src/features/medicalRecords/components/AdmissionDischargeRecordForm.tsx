import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Textarea } from '../../../components/ui/Textarea'
import type {
  AdmissionDischargeRecordDetail,
  CreateAdmissionDischargeRecordRequest,
  UpdateAdmissionDischargeRecordRequest,
} from '../../../types/medicalRecord'
import type { Patient } from '../../../types/patient'
import { PatientSelectSearch } from '../../patients/components/PatientSelectSearch'

interface AdmissionDischargeRecordFormProps {
  defaultValues?: Partial<AdmissionDischargeRecordDetail>
  isSubmitting?: boolean
  mode: 'create' | 'edit'
  onSubmit: (
    values:
      | CreateAdmissionDischargeRecordRequest
      | UpdateAdmissionDischargeRecordRequest,
  ) => void
}

interface AdmissionDischargeRecordFormValues {
  admissionDate: string
  admissionReason: string
  dischargeDate: string
  dischargeNote: string
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

export function AdmissionDischargeRecordForm({
  defaultValues,
  isSubmitting = false,
  mode,
  onSubmit,
}: AdmissionDischargeRecordFormProps) {
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
  } = useForm<AdmissionDischargeRecordFormValues>({
    defaultValues: {
      admissionDate: defaultValues?.admissionDate ?? '',
      admissionReason: defaultValues?.admissionReason ?? '',
      dischargeDate: defaultValues?.dischargeDate ?? '',
      dischargeNote: defaultValues?.dischargeNote ?? '',
      patientId: defaultValues?.patientId ?? null,
      recordDate: toDateTimeLocal(defaultValues?.recordDate),
    },
  })

  const admissionDate = useWatch({
    control,
    name: 'admissionDate',
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

  const handleValidSubmit = (values: AdmissionDischargeRecordFormValues) => {
    const patientId = Number(values.patientId)
    const normalizedValues = {
      admissionDate: values.admissionDate,
      admissionReason: values.admissionReason.trim(),
      dischargeDate: values.dischargeDate || undefined,
      dischargeNote: values.dischargeNote.trim() || undefined,
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

      <div className="grid gap-5 md:grid-cols-3">
        <Input
          id="admissionDischargeRecordDate"
          label="기록일시"
          type="datetime-local"
          {...register('recordDate', {
            required: '기록일시를 입력해 주세요.',
          })}
          error={errors.recordDate?.message}
        />
        <Input
          id="admissionDate"
          label="입원일"
          type="date"
          {...register('admissionDate', {
            required: '입원일을 입력해 주세요.',
          })}
          error={errors.admissionDate?.message}
        />
        <Input
          id="dischargeDate"
          label="퇴원일"
          type="date"
          {...register('dischargeDate', {
            validate: (value) =>
              !value ||
              !admissionDate ||
              value >= admissionDate ||
              '퇴원일은 입원일보다 빠를 수 없습니다.',
          })}
          error={errors.dischargeDate?.message}
        />
      </div>

      <Textarea
        id="admissionReason"
        label="입원 사유"
        placeholder="입원 사유를 입력해 주세요."
        {...register('admissionReason', {
          required: '입원 사유를 입력해 주세요.',
          validate: (value) =>
            value.trim().length > 0 || '입원 사유를 입력해 주세요.',
        })}
        error={errors.admissionReason?.message}
      />

      <Textarea
        id="dischargeNote"
        label="퇴원 기록"
        placeholder="퇴원 기록을 입력해 주세요."
        {...register('dischargeNote')}
        error={errors.dischargeNote?.message}
      />

      <div className="flex justify-end gap-2">
        <Button isLoading={isSubmitting} type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
