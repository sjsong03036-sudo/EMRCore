import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import {
  Table,
  TableCell,
  TableHeadCell,
  TableHeader,
  TableState,
} from '../../../components/ui/Table'
import type { MedicalRecordSummary } from '../../../types/medicalRecord'
import { MedicalRecordTypeBadge } from './MedicalRecordTypeBadge'

interface MedicalRecordTableProps {
  isLoading?: boolean
  records: MedicalRecordSummary[]
}

const MEDICAL_RECORD_TABLE_COLUMN_COUNT = 6

function getMedicalRecordDetailPath(recordId: number) {
  return `/app/medical-records/${recordId}`
}

export function MedicalRecordTable({
  isLoading = false,
  records,
}: MedicalRecordTableProps) {
  const navigate = useNavigate()

  return (
    <Table>
      <TableHeader>
        <tr>
          <TableHeadCell>기록 ID</TableHeadCell>
          <TableHeadCell>기록일시</TableHeadCell>
          <TableHeadCell>환자명</TableHeadCell>
          <TableHeadCell>기록 타입</TableHeadCell>
          <TableHeadCell>작성자</TableHeadCell>
          <TableHeadCell>상세</TableHeadCell>
        </tr>
      </TableHeader>
      <tbody>
        {isLoading && (
          <TableState
            colSpan={MEDICAL_RECORD_TABLE_COLUMN_COUNT}
            message="의무기록 목록을 불러오는 중입니다."
          />
        )}
        {!isLoading && records.length === 0 && (
          <TableState
            colSpan={MEDICAL_RECORD_TABLE_COLUMN_COUNT}
            message="조회된 의무기록이 없습니다."
          />
        )}
        {!isLoading &&
          records.map((record) => (
            <tr key={record.id}>
              <TableCell>{record.id}</TableCell>
              <TableCell>{record.recordDate}</TableCell>
              <TableCell>{record.patientName}</TableCell>
              <TableCell>
                <MedicalRecordTypeBadge type={record.type} />
              </TableCell>
              <TableCell>{record.authorName}</TableCell>
              <TableCell>
                <Button
                  onClick={() => navigate(getMedicalRecordDetailPath(record.id))}
                  variant="secondary"
                >
                  상세
                </Button>
              </TableCell>
            </tr>
          ))}
      </tbody>
    </Table>
  )
}
