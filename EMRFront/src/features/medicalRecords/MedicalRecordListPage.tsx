import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorMessage } from '../../components/ui/ErrorMessage'
import { getMedicalRecords } from '../../api/medicalRecordApi'
import type { MedicalRecordSummary } from '../../types/medicalRecord'
import type { Patient } from '../../types/patient'
import { PatientSelectSearch } from '../patients/components/PatientSelectSearch'
import { MedicalRecordTable } from './components/MedicalRecordTable'

const DEFAULT_PAGE_SIZE = 10

function sortRecordsByRecordDateDesc(records: MedicalRecordSummary[]) {
  return [...records].sort(
    (leftRecord, rightRecord) =>
      new Date(rightRecord.recordDate).getTime() -
      new Date(leftRecord.recordDate).getTime(),
  )
}

export function MedicalRecordListPage() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const selectedPatientId = selectedPatient?.id

  const { data, error, isFetching } = useQuery({
    enabled: !!selectedPatientId,
    queryKey: ['medicalRecords', selectedPatientId],
    queryFn: () =>
      getMedicalRecords({
        patientId: selectedPatientId,
        page: 1,
        size: DEFAULT_PAGE_SIZE,
      }),
  })

  const handlePatientSelect = (_patientId: number, patient: Patient) => {
    setSelectedPatient(patient)
  }
  const records = sortRecordsByRecordDateDesc(data?.content ?? [])

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-teal-700">의무기록</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          의무기록 통합 조회
        </h1>
      </div>

      <PatientSelectSearch
        onSelect={handlePatientSelect}
        selectedPatientId={selectedPatientId}
      />

      {selectedPatient && (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">선택된 환자</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">
            {selectedPatient.name}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            ID {selectedPatient.id} · {selectedPatient.birthDate} ·{' '}
            {selectedPatient.phone}
          </p>
        </section>
      )}

      {error && (
        <ErrorMessage message="의무기록 목록을 불러오지 못했습니다." />
      )}

      {!selectedPatient ? (
        <EmptyState
          description="환자 이름으로 검색한 뒤 조회할 환자를 선택하세요."
          title="환자를 선택하면 의무기록을 조회할 수 있습니다."
        />
      ) : (
        <MedicalRecordTable isLoading={isFetching} records={records} />
      )}
    </div>
  )
}
