import type { HTMLAttributes, ReactNode, TableHTMLAttributes } from 'react'
import { classNames } from '../../utils/classNames'

interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  isLoading?: boolean
}

interface TableStateProps extends HTMLAttributes<HTMLTableRowElement> {
  colSpan: number
  message: string
}

export function Table({ children, className, isLoading = false, ...props }: TableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className={classNames('w-full text-left text-sm', className)} {...props}>
        {isLoading ? (
          <tbody>
            <TableState colSpan={1} message="데이터를 불러오는 중입니다." />
          </tbody>
        ) : (
          children
        )}
      </table>
    </div>
  )
}

export function TableState({ className, colSpan, message, ...props }: TableStateProps) {
  return (
    <tr className={className} {...props}>
      <td className="px-4 py-8 text-center text-sm text-slate-500" colSpan={colSpan}>
        {message}
      </td>
    </tr>
  )
}

export function TableHeader({ children }: { children: ReactNode }) {
  return <thead className="bg-slate-50 text-slate-600">{children}</thead>
}

export function TableCell({ children }: { children: ReactNode }) {
  return <td className="border-t border-slate-200 px-4 py-3">{children}</td>
}

export function TableHeadCell({ children }: { children: ReactNode }) {
  return <th className="px-4 py-3 text-xs font-semibold uppercase">{children}</th>
}
