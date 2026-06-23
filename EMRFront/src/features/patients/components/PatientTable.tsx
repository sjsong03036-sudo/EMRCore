import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import {
  Table,
  TableCell,
  TableHeadCell,
  TableHeader,
  TableState,
} from '../../../components/ui/Table'
import type { Patient } from '../../../types/patient'

interface PatientTableProps {
  isLoading?: boolean
  patients: Patient[]
}

const PATIENT_TABLE_COLUMN_COUNT = 7

function getPatientDetailPath(patientId: number) {
  return `/app/patients/${patientId}`
}

export function PatientTable({
  isLoading = false,
  patients,
}: PatientTableProps) {
  const navigate = useNavigate()

  return (
    <Table>
      <TableHeader>
        <tr>
          <TableHeadCell>ID</TableHeadCell>
          <TableHeadCell>이름</TableHeadCell>
          <TableHeadCell>생년월일</TableHeadCell>
          <TableHeadCell>성별</TableHeadCell>
          <TableHeadCell>연락처</TableHeadCell>
          <TableHeadCell>보험번호</TableHeadCell>
          <TableHeadCell>상세</TableHeadCell>
        </tr>
      </TableHeader>
      <tbody>
        {isLoading && (
          <TableState
            colSpan={PATIENT_TABLE_COLUMN_COUNT}
            message="환자 목록을 불러오는 중입니다."
          />
        )}
        {!isLoading && patients.length === 0 && (
          <TableState
            colSpan={PATIENT_TABLE_COLUMN_COUNT}
            message="조회된 환자가 없습니다."
          />
        )}
        {!isLoading &&
          patients.map((patient) => (
            <tr key={patient.id}>
              <TableCell>{patient.id}</TableCell>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.birthDate}</TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>{patient.phone}</TableCell>
              <TableCell>{patient.insuranceNo ?? '-'}</TableCell>
              <TableCell>
                <Button
                  onClick={() => navigate(getPatientDetailPath(patient.id))}
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
