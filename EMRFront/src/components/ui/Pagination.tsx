import { classNames } from '../../utils/classNames'
import { Button } from './Button'

interface PaginationProps {
  className?: string
  currentPage: number
  isDisabled?: boolean
  onPageChange: (page: number) => void
  totalPages: number
}

export function Pagination({
  className,
  currentPage,
  isDisabled = false,
  onPageChange,
  totalPages,
}: PaginationProps) {
  const canMovePrevious = currentPage > 1
  const canMoveNext = currentPage < totalPages

  return (
    <nav
      aria-label="페이지네이션"
      className={classNames('flex items-center justify-end gap-3', className)}
    >
      <Button
        disabled={isDisabled || !canMovePrevious}
        onClick={() => onPageChange(currentPage - 1)}
        variant="secondary"
      >
        이전
      </Button>
      <span className="text-sm text-slate-600">
        {currentPage} / {Math.max(totalPages, 1)}
      </span>
      <Button
        disabled={isDisabled || !canMoveNext}
        onClick={() => onPageChange(currentPage + 1)}
        variant="secondary"
      >
        다음
      </Button>
    </nav>
  )
}
