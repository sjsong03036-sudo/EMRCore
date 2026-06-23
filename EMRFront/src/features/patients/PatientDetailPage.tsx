import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getApiErrorStatus } from '../../api/apiError'
import {
  deletePatient,
  getPatient,
  getPatientMedicalRecords,
} from '../../api/patientApi'
import { ROUTE_PATHS } from '../../app/routePaths'
import { RoleGuard } from '../../components/RoleGuard'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorMessage } from '../../components/ui/ErrorMessage'

function getPatientEditPath(patientId: number) {
  return `/app/patients/${patientId}/edit`
}

function getPatientRecordsPath(patientId: number) {
  return `/app/patients/${patientId}/records`
}

function getRecordDetailPath(recordId: number) {
  return `/app/medical-records/${recordId}`
}

function parsePatientId(patientId?: string) {
  const parsedPatientId = Number(patientId)

  if (!Number.isInteger(parsedPatientId) || parsedPatientId <= 0) {
    return null
  }

  return parsedPatientId
}

function getDeletePatientErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error)

  if (status === 403) {
    return '현재 계정 권한으로는 환자를 삭제할 수 없습니다.'
  }

  if (status === 404) {
    return '삭제할 환자를 찾을 수 없습니다.'
  }

  return '환자 삭제에 실패했습니다.'
}

export function PatientDetailPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { patientId } = useParams()
  const parsedPatientId = parsePatientId(patientId)
  const isValidPatientId = parsedPatientId !== null
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

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

  const deleteMutation = useMutation({
    mutationFn: () => deletePatient(parsedPatientId as number),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['patients'] })
      navigate(ROUTE_PATHS.patients, { replace: true })
    },
  })

  if (!isValidPatientId) {
    return <ErrorMessage message="올바르지 않은 환자 ID입니다." />
  }

  const patient = patientQuery.data
  const recentRecords = recordsQuery.data?.slice(0, 5) ?? []

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-teal-700">환자 관리</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            환자 상세
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            to={getPatientRecordsPath(parsedPatientId)}
          >
            기록 이력
          </Link>
          <RoleGuard allowedRoles={['ADMIN_STAFF', 'NURSE']}>
            <Link
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              to={getPatientEditPath(parsedPatientId)}
            >
              수정
            </Link>
          </RoleGuard>
          <RoleGuard allowedRoles={['ADMIN_STAFF']}>
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              variant="danger"
            >
              삭제
            </Button>
          </RoleGuard>
        </div>
      </div>

      {patientQuery.error && (
        <ErrorMessage message="환자 상세 정보를 불러오지 못했습니다." />
      )}
      {deleteMutation.error && (
        <ErrorMessage
          message={getDeletePatientErrorMessage(deleteMutation.error)}
        />
      )}

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {patientQuery.isLoading && (
          <p className="text-sm text-slate-600">환자 정보를 불러오는 중입니다.</p>
        )}
        {patient && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {patient.name}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  환자 ID: {patient.id}
                </p>
              </div>
              <Badge tone={patient.deletedAt ? 'red' : 'teal'}>
                {patient.deletedAt ? '삭제됨' : '활성'}
              </Badge>
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

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              최근 의무기록
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              환자별 기록 이력 중 최근 항목을 표시합니다.
            </p>
          </div>
          <Link
            className="text-sm font-semibold text-teal-700 hover:text-teal-800"
            to={getPatientRecordsPath(parsedPatientId)}
          >
            전체 보기
          </Link>
        </div>

        {recordsQuery.isLoading && (
          <p className="text-sm text-slate-600">의무기록을 불러오는 중입니다.</p>
        )}
        {recordsQuery.error && (
          <ErrorMessage message="최근 의무기록을 불러오지 못했습니다." />
        )}
        {!recordsQuery.isLoading && recentRecords.length === 0 && (
          <EmptyState title="작성된 의무기록이 없습니다." />
        )}
        {recentRecords.length > 0 && (
          <div className="divide-y divide-slate-200">
            {recentRecords.map((record) => (
              <div
                className="flex flex-wrap items-center justify-between gap-3 py-3"
                key={record.id}
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {record.type}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {record.recordDate} · {record.authorName}
                  </p>
                </div>
                <Link
                  className="text-sm font-semibold text-teal-700 hover:text-teal-800"
                  to={getRecordDetailPath(record.id)}
                >
                  상세
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <ConfirmModal
        confirmLabel="삭제"
        description="삭제한 환자는 목록에서 제외됩니다. 계속 진행하시겠습니까?"
        isConfirming={deleteMutation.isPending}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="환자 삭제"
      />
    </div>
  )
}
