import { useForm } from 'react-hook-form'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import {
  PATIENT_GENDERS,
  type CreatePatientRequest,
  type Patient,
  type UpdatePatientRequest,
} from '../../../types/patient'

type PatientFormValues = CreatePatientRequest

interface PatientFormProps {
  defaultValues?: Partial<Patient>
  isSubmitting?: boolean
  mode: 'create' | 'edit'
  onSubmit: (values: CreatePatientRequest | UpdatePatientRequest) => void
}

const phonePattern = /^01[016789]-?\d{3,4}-?\d{4}$/

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

export function PatientForm({
  defaultValues,
  isSubmitting = false,
  mode,
  onSubmit,
}: PatientFormProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<PatientFormValues>({
    defaultValues: {
      birthDate: defaultValues?.birthDate ?? '',
      gender: defaultValues?.gender ?? '',
      insuranceNo: defaultValues?.insuranceNo ?? '',
      name: defaultValues?.name ?? '',
      phone: defaultValues?.phone ?? '',
    },
  })

  const submitLabel = mode === 'create' ? '등록' : '수정'

  const handleValidSubmit = (values: PatientFormValues) => {
    onSubmit({
      ...values,
      insuranceNo: values.insuranceNo?.trim() || undefined,
      name: values.name.trim(),
      phone: values.phone.trim(),
    })
  }

  return (
    <form
      className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit(handleValidSubmit)}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Input
          id="patientName"
          label="이름"
          placeholder="환자 이름"
          type="text"
          {...register('name', {
            required: '이름을 입력해 주세요.',
          })}
          error={errors.name?.message}
        />

        <Input
          id="patientBirthDate"
          label="생년월일"
          max={getToday()}
          type="date"
          {...register('birthDate', {
            required: '생년월일을 입력해 주세요.',
            validate: (value) =>
              value <= getToday() || '미래 날짜는 입력할 수 없습니다.',
          })}
          error={errors.birthDate?.message}
        />

        <Select
          id="patientGender"
          label="성별"
          {...register('gender', {
            required: '성별을 선택해 주세요.',
          })}
          error={errors.gender?.message}
        >
          <option value="">성별 선택</option>
          {PATIENT_GENDERS.map((gender) => (
            <option key={gender} value={gender}>
              {gender === 'MALE' ? '남성' : '여성'} ({gender})
            </option>
          ))}
        </Select>

        <Input
          id="patientPhone"
          label="연락처"
          placeholder="010-0000-0000"
          type="tel"
          {...register('phone', {
            pattern: {
              message: '올바른 연락처 형식으로 입력해 주세요.',
              value: phonePattern,
            },
            required: '연락처를 입력해 주세요.',
          })}
          error={errors.phone?.message}
        />

        <Input
          id="patientInsuranceNo"
          label="보험번호"
          placeholder="보험번호"
          type="text"
          {...register('insuranceNo')}
          error={errors.insuranceNo?.message}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button isLoading={isSubmitting} type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
