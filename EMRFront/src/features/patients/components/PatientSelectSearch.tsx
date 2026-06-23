import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPatients } from '../../../api/patientApi'
import { Button } from '../../../components/ui/Button'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorMessage } from '../../../components/ui/ErrorMessage'
import { Input } from '../../../components/ui/Input'
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner'
import type { Patient } from '../../../types/patient'

interface PatientSelectSearchProps {
  onSelect: (patientId: number, patient: Patient) => void
  selectedPatientId?: number
}

const DEFAULT_SEARCH_SIZE = 10

export function PatientSelectSearch({
  onSelect,
  selectedPatientId,
}: PatientSelectSearchProps) {
  const [name, setName] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState({
    name: '',
  })

  const trimmedName = submittedSearch.name.trim()
  const hasSearchParams = trimmedName.length > 0
  const patientQuery = useQuery({
    enabled: hasSearchParams,
    queryKey: ['patientSelectSearch', trimmedName],
    queryFn: () =>
      getPatients({
        ...(trimmedName ? { name: trimmedName } : {}),
        page: 1,
        size: DEFAULT_SEARCH_SIZE,
      }),
  })

  const patients = patientQuery.data?.content ?? []

  const handleSearch = () => {
    setSubmittedSearch({
      name,
    })
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <Input
          id="patientSelectSearchName"
          label="환자 이름"
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              handleSearch()
            }
          }}
          placeholder="환자 이름"
          type="search"
          value={name}
        />
        <Button onClick={handleSearch}>검색</Button>
      </div>

      <div className="mt-4">
        {patientQuery.isFetching && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <LoadingSpinner />
            환자 목록을 불러오는 중입니다.
          </div>
        )}

        {patientQuery.error && (
          <ErrorMessage message="환자 검색 결과를 불러오지 못했습니다." />
        )}

        {!patientQuery.isFetching && !hasSearchParams && (
          <EmptyState
            className="py-6"
            description="이름으로 환자를 검색하세요."
            title="검색어를 입력해주세요."
          />
        )}

        {!patientQuery.isFetching &&
          hasSearchParams &&
          patients.length === 0 && (
            <EmptyState
              className="py-6"
              description="다른 이름으로 다시 검색해보세요."
              title="검색된 환자가 없습니다."
            />
          )}

        {!patientQuery.isFetching && patients.length > 0 && (
          <div className="divide-y divide-slate-200 rounded-md border border-slate-200">
            {patients.map((patient) => {
              const isSelected = patient.id === selectedPatientId

              return (
                <div
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                  key={patient.id}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {patient.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      ID {patient.id} · {patient.birthDate} · {patient.phone}
                    </p>
                  </div>
                  <Button
                    onClick={() => onSelect(patient.id, patient)}
                    variant={isSelected ? 'primary' : 'secondary'}
                  >
                    {isSelected ? '선택됨' : '선택'}
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
