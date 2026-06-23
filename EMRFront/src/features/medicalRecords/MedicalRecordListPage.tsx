import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ErrorMessage } from '../../components/ui/ErrorMessage'
import { Pagination } from '../../components/ui/Pagination'
import { getMedicalRecords } from '../../api/medicalRecordApi'
import type { MedicalRecordSearchParams } from '../../types/medicalRecord'
import { MedicalRecordSearchForm } from './components/MedicalRecordSearchForm'
import { MedicalRecordTable } from './components/MedicalRecordTable'

const DEFAULT_PAGE_SIZE = 10

export function MedicalRecordListPage() {
  const [searchParams, setSearchParams] =
    useState<MedicalRecordSearchParams>({
      page: 1,
      size: DEFAULT_PAGE_SIZE,
    })

  const { data, error, isFetching } = useQuery({
    queryKey: ['medicalRecords', searchParams],
    queryFn: () => getMedicalRecords(searchParams),
  })

  const handleSearch = (params: MedicalRecordSearchParams) => {
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
      <div>
        <p className="text-sm font-semibold text-teal-700">의무기록</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          의무기록 통합 조회
        </h1>
      </div>

      <MedicalRecordSearchForm
        defaultValues={searchParams}
        onReset={handleReset}
        onSearch={handleSearch}
      />

      {error && (
        <ErrorMessage message="의무기록 목록을 불러오지 못했습니다." />
      )}

      <MedicalRecordTable
        isLoading={isFetching}
        records={data?.content ?? []}
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
