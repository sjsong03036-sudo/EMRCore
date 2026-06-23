import { useForm } from 'react-hook-form'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import type { PatientSearchParams } from '../../../types/patient'

interface PatientSearchFormProps {
  defaultValues?: PatientSearchParams
  onReset?: () => void
  onSearch: (params: PatientSearchParams) => void
}

interface PatientSearchFormValues {
  name: string
  phone: string
}

function normalizeSearchParams(values: PatientSearchFormValues) {
  return {
    ...(values.name.trim() ? { name: values.name.trim() } : {}),
    ...(values.phone.trim() ? { phone: values.phone.trim() } : {}),
  }
}

export function PatientSearchForm({
  defaultValues,
  onReset,
  onSearch,
}: PatientSearchFormProps) {
  const { handleSubmit, register, reset } = useForm<PatientSearchFormValues>({
    defaultValues: {
      name: defaultValues?.name ?? '',
      phone: defaultValues?.phone ?? '',
    },
  })

  const handleSearch = (values: PatientSearchFormValues) => {
    onSearch(normalizeSearchParams(values))
  }

  const handleReset = () => {
    reset({
      name: '',
      phone: '',
    })
    onReset?.()
  }

  return (
    <form
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={handleSubmit(handleSearch)}
    >
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <Input
          id="patientSearchName"
          label="이름"
          placeholder="환자 이름"
          type="text"
          {...register('name')}
        />
        <Input
          id="patientSearchPhone"
          label="연락처"
          placeholder="010-0000-0000"
          type="tel"
          {...register('phone')}
        />
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
