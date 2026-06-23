import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import {
  getPatient,
  getPatientMedicalRecords,
} from '../../api/patientApi'
import { ROUTE_PATHS } from '../../app/routePaths'
import { ErrorMessage } from '../../components/ui/ErrorMessage'
import type { MedicalRecordSummary } from '../../types/medicalRecord'
import { MedicalRecordTable } from '../medicalRecords/components/MedicalRecordTable'

function parsePatientId(patientId?: string) {
  const parsedPatientId = Number(patientId)

  if (!Number.isInteger(parsedPatientId) || parsedPatientId <= 0) {
    return null
  }

  return parsedPatientId
}

function sortRecordsByRecordDateDesc(records: MedicalRecordSummary[]) {
  return [...records].sort(
    (leftRecord, rightRecord) =>
      new Date(rightRecord.recordDate).getTime() -
      new Date(leftRecord.recordDate).getTime(),
  )
}

function getPatientDetailPath(patientId: number) {
  return `/app/patients/${patientId}`
}

export function PatientMedicalRecordHistoryPage() {
  const { patientId } = useParams()
  const parsedPatientId = parsePatientId(patientId)
  const isValidPatientId = parsedPatientId !== null

  const patientQuery = useQuery({
    enabled: isValidPatientId,
    queryKey: ['patient', parsedPatientId],
    queryFn: () => getPatient(parsedPatientId as number),
  })

  const recordsQuery = useQuery({
    enabled: isValidPatientId,
    queryKey: ['patientMedicalRecords', parsedPatientId],
    queryFn: () => getPatientMedicalRecords(parsedPatientId as number),
  })

  if (!isValidPatientId) {
    return <ErrorMessage message="올바르지 않은 환자 ID입니다." />
  }

  const patient = patientQuery.data
  const records = sortRecordsByRecordDateDesc(recordsQuery.data ?? [])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-teal-700">환자 관리</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            환자별 의무기록 이력
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            to={ROUTE_PATHS.patients}
          >
            환자 목록
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            to={getPatientDetailPath(parsedPatientId)}
          >
            환자 상세
          </Link>
        </div>
      </div>

      {patientQuery.error && (
        <ErrorMessage message="환자 정보를 불러오지 못했습니다." />
      )}
      {recordsQuery.error && (
        <ErrorMessage message="환자별 의무기록을 불러오지 못했습니다." />
      )}

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {patientQuery.isLoading && (
          <p className="text-sm text-slate-600">환자 정보를 불러오는 중입니다.</p>
        )}
        {patient && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {patient.name}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                환자 ID: {patient.id}
              </p>
            </div>
            <dl className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <dt className="text-xs font-semibold text-slate-500">
                  생년월일
                </dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {patient.birthDate}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-500">성별</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {patient.gender}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-500">
                  연락처
                </dt>
                <dd className="mt-1 text-sm text-slate-900">{patient.phone}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-500">
                  보험번호
                </dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {patient.insuranceNo ?? '-'}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </section>

      <MedicalRecordTable
        isLoading={recordsQuery.isFetching}
        records={records}
      />
    </div>
  )
}
