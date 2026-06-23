import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getPatients } from '../../api/patientApi'
import { ROUTE_PATHS } from '../../app/routePaths'
import { ErrorMessage } from '../../components/ui/ErrorMessage'
import { Pagination } from '../../components/ui/Pagination'
import type { PatientSearchParams } from '../../types/patient'
import { PatientSearchForm } from './components/PatientSearchForm'
import { PatientTable } from './components/PatientTable'

const DEFAULT_PAGE_SIZE = 10

export function PatientListPage() {
  const [searchParams, setSearchParams] = useState<PatientSearchParams>({
    page: 1,
    size: DEFAULT_PAGE_SIZE,
  })

  const { data, error, isFetching } = useQuery({
    queryKey: ['patients', searchParams],
    queryFn: () => getPatients(searchParams),
  })

  const handleSearch = (params: PatientSearchParams) => {
    setSearchParams({
      ...params,
      page: 1,
      size: DEFAULT_PAGE_SIZE,
    })
  }

  const handleReset = () => {
    setSearchParams({
      page: 1,
      size: DEFAULT_PAGE_SIZE,
    })
  }

  const handlePageChange = (page: number) => {
    setSearchParams((currentParams) => ({
      ...currentParams,
      page,
    }))
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-teal-700">환자 관리</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            환자 목록
          </h1>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
          to={ROUTE_PATHS.patientNew}
        >
          환자 등록
        </Link>
      </div>

      <PatientSearchForm
        defaultValues={searchParams}
        onReset={handleReset}
        onSearch={handleSearch}
      />

      {error && (
        <ErrorMessage message="환자 목록을 불러오지 못했습니다." />
      )}

      <PatientTable
        isLoading={isFetching}
        patients={data?.content ?? []}
      />

      <Pagination
        currentPage={data?.page ?? searchParams.page ?? 1}
        isDisabled={isFetching}
        onPageChange={handlePageChange}
        totalPages={data?.totalPages ?? 1}
      />
    </div>
  )
}
